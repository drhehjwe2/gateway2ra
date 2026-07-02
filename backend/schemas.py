from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LinkBase(BaseModel):
    name: Optional[str] = None
    traffic_limit: Optional[float] = None
    expires_at: Optional[datetime] = None

class LinkCreate(LinkBase):
    pass

class LinkUpdate(BaseModel):
    name: Optional[str] = None
    traffic_limit: Optional[float] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None

class LinkOut(LinkBase):
    id: str
    uuid: str
    path: str
    traffic_used: float
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime]
    class Config:
        from_attributes = True

class TrafficStats(BaseModel):
    total_traffic: float
    active_connections: int
    total_links: int
    active_links: int
