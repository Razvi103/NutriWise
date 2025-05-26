import logging
from pathlib import Path
from fastapi import APIRouter, Depends, Response, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from data.database import get_db_session
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from models.meal_plan import MealPlan
from models.meal_plan_item import MealPlanItem
from models.user import User
from models.health_report import HealthReport
from pydantic import BaseModel
from sqlalchemy import desc
from datetime import date
from ..services.recipe_embedding_service import load_vectordb, get_qa_chain, LocalServerEmbeddings
from ..services.meal_plan_formatter import strip_json_prefix, strip_json_suffix
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/meal_plans", tags=["MealPlans"], include_in_schema=False)
BASE_DIR = Path(__file__).resolve().parent.parent.parent    # -> backend/
CHROMA_DIR = BASE_DIR / "chroma_recipes"
base_url = "http://127.0.0.1:1234/v1"

embeddings = LocalServerEmbeddings(base_url=base_url)


recipes_db = load_vectordb(
    persist_directory=str(CHROMA_DIR),
    embedding=embeddings,
)
api_key = "lm-studio"
llm_model = "phi-4"

llm = ChatOpenAI(
    base_url=base_url,
    api_key=api_key,
    temperature=0.25,
    model=llm_model
)


class MealPlanResponse(BaseModel):
    id: int
    name: str
    description: str
    date_created: str
    user_id: str

    class Config:
        from_attributes = True


class MealItemResponse(BaseModel):
    week_slot: str
    id: int
    name: str
    calories: float
    meal_plan_id: int

    class Config:
        from_attributes = True


@router.get("/get_user_meal_plan")
def get_user_most_recent_meal_plan(user_id : str, db_session=Depends(get_db_session)):
    logger.info(f"Getting User {user_id} most recent meal plan")

    latest_plan = db_session.query(MealPlan).filter(MealPlan.user_id == user_id).first()

    if latest_plan is None:
        logger.exception(f"No meal plan for user_id {user_id} found")
        raise HTTPException(status_code=404, detail="Meal plan not found")

    items = (
        db_session.query(MealPlanItem)
        .filter(MealPlanItem.meal_plan_id == latest_plan.id)
        .all()
    )

    items_data = [
        {
            "id": item.id,
            "breakfast": item.breakfast,
            "lunch": item.lunch,
            "dinner": item.dinner,
            "snack": item.snack,
            "meal_slot": item.meal_slot,
            "macros": item.macros,
        }
        for item in items
    ]
    content = {
        "meal_plan_id": latest_plan.id,
        "name": latest_plan.name,
        "description": latest_plan.description,
        "date_created": str(latest_plan.date_created),
        "plan": items_data
    }

    return content


@router.post("/create_meal_plan")
def create_meal_plan(user_id: str, db_session = Depends(get_db_session)):
    user = db_session.query(User).filter(User.id == user_id).first()
    health_report = db_session.query(HealthReport).filter(HealthReport.user_id == user_id).first()
    health_report_text = None
    if health_report is None:
        health_report_text = "None"
    else:
        health_report_text = health_report.report_text

    PROMPT = """
    You are a helpful assistant specialized in nutrition.
Make a personalized meal plan for every day of the week that includes on each day breakfast, lunch, dinner and a snack
User Information:
Weight (in Kg): """ + str(user.weight) + """
Height (in cm): """ + str(user.height) + """
Age: """ + str(user.age) + """
BMI:""" + str(user.bmi) + """
Gender: """ + user.sex + """
Fitness Goal: """ + user.fitness_goal + """
Activity Level: """ + user.activity_level + """
Dietary Preferences: """ + user.dietary_preferences + """
Medical Conditions: """ + user.medical_conditions + """

Medical History (can be empty): """ + health_report_text + """
Response Format:
Provide a JSON that contains 3 objects, the last one being a list of JSON objects in the following format:
name: (string) The name of the weekly meal plan.
description: (string) A very short and concise description of the weekly plan.
plan: (dict) A JSON that contains the following objects:
    meal_slot: (string) The week day (e.g. Monday)
    breakfast: (string) The name of the meal for breakfast
    lunch: (string) The name of the meal for lunch
    dinner: (string) The name of the meal for dinner
    snack: (string) The name of the snack meal
    macros: (string) An estimate of the total macros (carbohydrates, protein, fats and calories) computed from all the meals of that day


Example:
User Information:
Weight: 90
Height: 180
BMI: 27.8
Gender: Male
Fitness Goal: Lose weight
Activity Level: sedentary
Dietary Preferences: vegan
Medical Conditions: diabetes
Medical History: previous diagnosis of mild anemia, recent MRI showing slight brain white matter changes
The response should have the following json format, and only respond like it. All responses should be in valid json format.
{
    "name": str
    "description": str
    "plan": [
    {
        "meal_slot": "str",
        "breakfast": "str",        
        "lunch": "str",
        "dinner": "str",
        "snack": "str",
        "macros": "str",
    },
    ]
}
Remember to respond always with a plan that has 7 items (one for each day of the week) in the order of the week days!
Remember to respond always with a valid JSON format!
    """
    rag_query = (
        f"You are a nutrition assistant. Based on the context, pick 7 suitable recipes "
        "(one per weekday) and assemble a daily meal plan with breakfast, lunch, dinner, and a snack. "
        "Provide macros estimates. Respond in JSON with keys: name, description, plan. "
        f"Instruction: {PROMPT}"
    )
    qa_chain = get_qa_chain(llm, recipes_db)
    response = qa_chain.invoke([HumanMessage(content=rag_query)])
    response_text = response.content
    print(response_text)
    response_text = strip_json_suffix(strip_json_prefix(response_text))
    json_response_text = json.loads(response_text)

    old_plan = db_session.query(MealPlan).filter(MealPlan.user_id == user_id).first()
    if old_plan:
        old_plan_id = old_plan.id
        all_meal_items = db_session.query(MealPlanItem).filter(MealPlanItem.meal_plan_id == old_plan_id).all()
        for meal_item in all_meal_items:
            db_session.delete(meal_item)
        db_session.delete(old_plan)

        db_session.commit()
        print("Old plan DELETED")


    plan_name = json_response_text["name"]
    plan_descr = json_response_text["description"]

    new_plan = MealPlan(user_id, plan_name, plan_descr, date.today())

    db_session.add(new_plan)
    db_session.flush() # needed to access the new_plan id before commiting

    plan_id = new_plan.id
    plan_list = json_response_text["plan"]
    for plan in plan_list:
        day = plan["meal_slot"]
        breakfast = plan["breakfast"]
        lunch = plan["lunch"]
        dinner = plan["dinner"]
        snack = plan["snack"]
        macros = plan["macros"]

        new_meal_item = MealPlanItem(breakfast, lunch, dinner, snack, day, macros, plan_id)
        db_session.add(new_meal_item)

    db_session.commit()

    return json_response_text
