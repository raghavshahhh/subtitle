from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.api.auth import get_current_user
from app.config import settings
import razorpay
import hmac
import hashlib

router = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@router.post("/create-order")
async def create_payment_order(
    plan: str,  # pro, team
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Plan pricing
    plan_prices = {
        "pro": 29900,  # ₹299 in paise
        "team": 99900  # ₹999 in paise
    }
    
    if plan not in plan_prices:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    try:
        # Create Razorpay order
        order_data = {
            "amount": plan_prices[plan],
            "currency": "INR",
            "receipt": f"order_{current_user.id}_{plan}",
            "notes": {
                "user_id": current_user.id,
                "plan": plan
            }
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": settings.RAZORPAY_KEY_ID
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment order creation failed: {str(e)}")

@router.post("/verify-payment")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Verify signature
        body = razorpay_order_id + "|" + razorpay_payment_id
        expected_signature = hmac.new(
            key=settings.RAZORPAY_KEY_SECRET.encode(),
            msg=body.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Get order details
        order = razorpay_client.order.fetch(razorpay_order_id)
        plan = order["notes"]["plan"]
        
        # Update user subscription
        if plan == "pro":
            current_user.plan = "pro"
            current_user.credits = 500
        elif plan == "team":
            current_user.plan = "team"
            current_user.credits = 9999  # Unlimited
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Successfully upgraded to {plan} plan",
            "plan": current_user.plan,
            "credits": current_user.credits
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@router.get("/plans")
async def get_plans():
    return {
        "plans": [
            {
                "name": "Free",
                "price": 0,
                "credits": 60,
                "features": ["60 mins/month", "720p quality", "Basic styles", "SRT/VTT export"]
            },
            {
                "name": "Pro",
                "price": 299,
                "credits": 500,
                "features": ["500 mins/month", "4K quality", "All styles", "Priority processing", "API access"]
            },
            {
                "name": "Team",
                "price": 999,
                "credits": 9999,
                "features": ["Unlimited minutes", "4K quality", "White-label", "Team collaboration", "API access"]
            }
        ]
    }