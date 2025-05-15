from pydantic import BaseModel
from fastapi import APIRouter, FastAPI, Depends
from models.user import User
from data.database import get_db_session
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
import json
import logging


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/users",
                   tags=["User options"], include_in_schema=False)


class UserResponse(BaseModel):
    id: str
    weight: int | None = None 
    height: int | None = None
    age: int | None = None
    sex: str | None = None
    fitness_goal: str | None = None
    bmi: float | None = None
    dietary_preferences: str | None = None
    activity_level: str | None = None
    medical_conditions: str | None = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    weight: int | None = None 
    height: int | None = None
    age: int | None = None
    sex: str | None = None
    fitness_goal: str | None = None
    dietary_preferences: str | None = None
    activity_level: str | None = None


@router.get("/get_user", response_model=UserResponse) 
def get_all_users(user_id: str, db = Depends(get_db_session)): 
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        logger.exception(f"User {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")
    
    user_json = json.dumps({
        "id": user.id,
        "weight": user.weight,
        "height": user.height,
        "age": user.age,
        "bmi": user.bmi,
        "sex": user.sex,
        "fitness_goal": user.fitness_goal,
        "activity_level": user.activity_level,
        "dietary_preferences": user.dietary_preferences,
        "medical_conditions": user.medical_conditions
    })
    logger.info(f"User {user_id} returned successfully")
    return JSONResponse(content=user_json)

@router.post("/create_user")
def create_user(user_id: str, db = Depends(get_db_session)):
    new_user = User(user_id)

    db.add(new_user)
    db.commit()

    logger.info(f"User {user_id} added successfully")

    return "User created successfully!"

@router.patch("/update_profile_data")
def update_user_details(user_id: str, weight: int, height: int, age: int, sex: str, fitness_goal: str, dietary_preferences: str, activity_level: str, db = Depends(get_db_session)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.exception(f"User {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")

    user.update_profile_data(weight, height, age, sex, fitness_goal, dietary_preferences, activity_level)

    db.add(user)
    db.commit() 
    db.refresh(user)

    logger.info(f"User profile for {user_id} updated successfully.")

    return "User profile updated successfully!"

@router.patch("/update_medical_conditions")
def update_medical_conditions(user_id: str, medical_conditions_text, db=Depends(get_db_session)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.exception(f"User {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")
    
    user.update_medical_conditions(medical_conditions_text)

    db.add(user)
    db.commit() 
    db.refresh(user)

    logger.info(f"User medical conditions for {user_id} updated successfully.")

    return "User medical conditions updated successfully"





