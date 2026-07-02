from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Link(Base):
    __tablename__ = "links"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=True)
    uuid = Column(String, unique=True, index=True, nullable=False)
    path = Column(String, nullable=False)
    traffic_limit = Column(Float, nullable=True) # in GB
    traffic_used = Column(Float, default=0.0) # in GB
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

class TrafficLog(Base):
    __tablename__ = "traffic_logs"
    id = Column(Integer, primary_key=True, index=True)
    link_id = Column(String, ForeignKey("links.id"))
    bytes_used = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True, index=True)
    link_id = Column(String, ForeignKey("links.id"))
    user_ip = Column(String)
    connected_at = Column(DateTime(timezone=True), server_default=func.now())
    disconnected_at = Column(DateTime(timezone=True), nullable=True)
