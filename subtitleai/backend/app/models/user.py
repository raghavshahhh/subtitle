from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    avatar_url = Column(String)
    
    # Subscription
    plan = Column(String, default="free")  # free, pro, team
    credits = Column(Integer, default=60)  # minutes
    credits_used = Column(Integer, default=0)
    
    # Billing
    razorpay_customer_id = Column(String)
    subscription_id = Column(String)
    subscription_status = Column(String)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())