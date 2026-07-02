from sqlalchemy.orm import Session
from . import models, redis_client
import time

def update_traffic(db: Session, link_id: str, bytes_count: int):
    # Update in Redis for real-time tracking
    redis_conn = redis_client.get_redis()
    current_usage = redis_conn.incrby(f"traffic:{link_id}", bytes_count)
    
    # Periodically sync to DB or do it on disconnect
    # For simplicity, we update the DB periodically or use a threshold
    # Here we'll update DB if it's a significant amount or on specific triggers
    pass

def sync_traffic_to_db(db: Session, link_id: str):
    redis_conn = redis_client.get_redis()
    bytes_used = redis_conn.get(f"traffic:{link_id}")
    if bytes_used:
        # Convert bytes to GB
        gb_used = int(bytes_used) / (1024**3)
        link = db.query(models.Link).filter(models.Link.id == link_id).first()
        if link:
            link.traffic_used += gb_used
            db.commit()
            # Optional: reset redis after sync or keep it
