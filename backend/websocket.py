from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from . import models, database, redis_client, traffic
from .config import settings
import time

async def vless_websocket_handler(websocket: WebSocket, db: Session, uuid_val: str):
    await websocket.accept()
    
    # Validate Link
    link = db.query(models.Link).filter(models.Link.uuid == uuid_val, models.Link.is_active == True).first()
    if not link:
        await websocket.close(code=1008)
        return

    # Check Traffic Limit
    if link.traffic_limit and link.traffic_used >= link.traffic_limit:
        await websocket.close(code=1008)
        return

    # Track Connection
    conn = models.Connection(link_id=link.id, user_ip=websocket.client)
    db.add(conn)
    db.commit()
    
    # Update Redis active count
    redis_conn = redis_client.get_redis()
    redis_conn.sadd(f"active_conns:{link.id}", websocket.client)
    redis_conn.incr("global_active_conns")

    try:
        while True:
            # In a real VLESS implementation, we would decode the VLESS header here
            data = await websocket.receive_bytes()
            
            # Update traffic usage
            traffic.update_traffic(db, link.id, len(data))
            
            # Simulate forwarding (Mock: echo back or actual proxying)
            # For this project, we simulate the proxying by acknowledging
            await websocket.send_bytes(data)
            
    except WebSocketDisconnect:
        pass
    finally:
        # Cleanup
        conn.disconnected_at = time.time()
        db.commit()
        redis_conn.srem(f"active_conns:{link.id}", websocket.client)
        redis_conn.decr("global_active_conns")
