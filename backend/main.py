from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from . import models, schemas, auth, database, vless, utils, websocket, redis_client
from .config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Init
models.Base.metadata.create_all(bind=database.engine)

# --- AUTH ROUTES ---

@app.post("/api/auth/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- LINK MANAGEMENT ROUTES ---

@app.post("/api/links", response_model=schemas.LinkOut)
async def create_link(link_data: schemas.LinkCreate, 
                      current_user: models.User = Depends(auth.get_current_user), 
                      db: Session = Depends(database.get_db)):
    link, full_link = vless.create_vless_link(db, current_user.id, link_data)
    # We store the full link in a temporary redis key or just return it in headers
    # For now, we'll return the link object, and the frontend will construct it or we add a field
    return link

@app.get("/api/links", response_model=List[schemas.LinkOut])
async def list_links(current_user: models.User = Depends(auth.get_current_user), 
                    db: Session = Depends(database.get_db)):
    return db.query(models.Link).filter(models.Link.user_id == current_user.id).all()

@app.put("/api/links/{link_id}", response_model=schemas.LinkOut)
async def update_link(link_id: str, update_data: schemas.LinkUpdate, 
                      current_user: models.User = Depends(auth.get_current_user), 
                      db: Session = Depends(database.get_db)):
    link = db.query(models.Link).filter(models.Link.id == link_id, models.Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    for var, value in update_data.dict(exclude_unset=True).items():
        setattr(link, var, value)
    
    db.commit()
    db.refresh(link)
    return link

@app.delete("/api/links/{link_id}")
async def delete_link(link_id: str, 
                      current_user: models.User = Depends(auth.get_current_user), 
                      db: Session = Depends(database.get_db)):
    link = db.query(models.Link).filter(models.Link.id == link_id, models.Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    db.delete(link)
    db.commit()
    return {"detail": "Link deleted"}

@app.get("/api/links/{link_id}/qr")
async def get_link_qr(link_id: str, 
                     current_user: models.User = Depends(auth.get_current_user), 
                     db: Session = Depends(database.get_db)):
    link = db.query(models.Link).filter(models.Link.id == link_id, models.Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    full_link = utils.create_vless_link(link.uuid, link.name)
    qr_bytes = utils.generate_qr_code(full_link)
    return Response(content=qr_bytes, media_type="image/png")

# --- STATS ROUTES ---

@app.get("/api/stats", response_model=schemas.TrafficStats)
async def get_stats(current_user: models.User = Depends(auth.get_current_user), 
                    db: Session = Depends(database.get_db)):
    redis_conn = redis_client.get_redis()
    
    total_links = db.query(models.Link).count()
    active_links = db.query(models.Link).filter(models.Link.is_active == True).count()
    
    # Sum of all traffic_used in DB
    total_traffic = db.query(models.Link).with_entities(models.Link.traffic_used).all()
    total_traffic_sum = sum([t[0] for t in total_traffic]) if total_traffic else 0
    
    active_conns = int(redis_conn.get("global_active_conns") or 0)
    
    return {
        "total_traffic": total_traffic_sum,
        "active_connections": active_conns,
        "total_links": total_links,
        "active_links": active_links
    }

# --- HEALTH CHECK ---
@app.get("/health")
async def health():
    return {"status": "online", "timestamp": datetime.utcnow()}

# --- VLESS WEBSOCKET ENDPOINT ---
@app.websocket("/vless/{uuid_val}")
async def vless_ws(websocket: WebSocket, uuid_val: str):
    # We need a DB session for the websocket
    db = database.SessionLocal()
    try:
        await websocket.websocket_handler(websocket, db, uuid_val)
    except Exception as e:
        print(f"WS Error: {e}")
    finally:
        db.close()

# Need to manually map the handler because of how FastAPI WS works
# In main.py, the @app.websocket defines the route, but we call the logic
from .websocket import vless_websocket_handler
app.websocket("/vless/{uuid_val}")(lambda websocket, uuid_val: vless_websocket_handler(websocket, database.SessionLocal(), uuid_val))
# Wait, the above lambda is slightly wrong for FastAPI. Correcting:

@app.websocket("/vless/{uuid_val}")
async def vless_endpoint(websocket: WebSocket, uuid_val: str):
    db = database.SessionLocal()
    try:
        await vless_websocket_handler(websocket, db, uuid_val)
    finally:
        db.close()
