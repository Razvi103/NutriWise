from sqlalchemy import Column, Integer, String, ForeignKey, Float
from data.database import Base
from sqlalchemy.orm import relationship
from .meal_plan import MealPlan


class MealPlanItem(Base):
    __tablename__ = 'meal_plan_items'
    id = Column(Integer, primary_key=True, autoincrement=True)
    meal_slot = Column(String(20)) # monday, tuesday ...
    breakfast = Column(String(255))
    lunch = Column(String(255))
    dinner = Column(String(255))
    snack = Column(String(255))
    macros = Column(String(255))
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id", ondelete='CASCADE'), nullable=False)
    meal_plan = relationship(MealPlan)

    def __init__(self, breakfast, lunch, dinner, snack, meal_slot, macros, meal_plan_id) -> None:
        self.meal_plan_id = meal_plan_id
        self.meal_slot = meal_slot
        self.breakfast = breakfast
        self.lunch = lunch
        self.dinner = dinner
        self.snack = snack
        self.macros = macros

    def __repr__(self) -> str:
        return f'<MealPlanItem:\n \
                id: {self.id}\n \
                name: {self.name} \
                meal_slot: {self.meal_slot} \
                calories: {self.calories} \
                meal_plan_id: {self.meal_plan_id}>'
