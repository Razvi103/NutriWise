from sqlalchemy import Column, Integer, String, ForeignKey, Date
from data.database import Base
from sqlalchemy.orm import relationship
from .user import User


class MealPlan(Base):
    __tablename__ = 'meal_plans'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    description = Column(String(512))
    date_created = Column(Date)
    user_id = Column(String(255), ForeignKey("users.id"), nullable=False)
    user = relationship(User)

    def __init__(self, user_id, name, description, date_created) -> None:
        self.user_id = user_id
        self.name = name
        self.description = description
        self.date_created = date_created

    def __repr__(self) -> str:
        return f'<MealPlan:\n \
                id: {self.id}\n \
                name: {self.name} \
                description: {self.description} \
                date_created: {self.date_created} \
                user_id: {self.user_id}>'
