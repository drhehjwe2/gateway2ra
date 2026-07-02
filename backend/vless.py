from sqlalchemy.orm import Session
from . import models, utils, schemas
from .config import settings

def create_vless_link(db: Session, user_id: int, link_data: schemas.LinkCreate):
    uuid_val = utils.generate_uuid()
    path = f"/vless/{uuid_val}"
    
    new_link = models.Link(
        user_id=user_id,
        name=link_data.name or "CyberGate User",
        uuid=uuid_val,
        path=path,
        traffic_limit=link_data.traffic_limit,
        expires_at=link_data.expires_at
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    full_link = utils.create_vless_link(new_link.uuid, new_link.name)
    return new_link, full_link

def toggle_link_status(db: Session, link_id: str, status: bool):
    link = db.query(models.Link).filter(models.Link.id == link_id).first()
    if link:
        link.is_active = status
        db.commit()
        db.refresh(link)
    return link
