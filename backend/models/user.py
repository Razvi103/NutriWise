from sqlalchemy import Column, String, Integer, Float
from data.database import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(String(255), primary_key=True)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    age = Column(Integer, nullable=True)
    sex = Column(String(30), nullable=True)
    fitness_goal = Column(String(255), nullable=True)
    dietary_preferences = Column(String(512), nullable=True)
    activity_level = Column(String(100), nullable=True)
    medical_conditions = Column(String(512), nullable=True)

    bmi = Column(Float, nullable=True)


    def __init__(self, id: str, height: int = None, weight: int = None, age: int = None, sex: str = None, fitness_goal: str = None,
                 dietary_prefereces: str = None, activity_level: str = None, medical_conditions: str = None) -> None:
        self.id = id
        self.height = height
        self.weight = weight
        self.age = age
        self.sex = sex
        self.fitness_goal = fitness_goal
        self.bmi = None
        if height and weight:
            self.bmi = weight / ((height/100) ** 2)
        self.dietary_preferences = dietary_prefereces
        self.activity_level = activity_level
        self.medical_conditions = medical_conditions

    def update_profile_data(self, weight: int, height: int, age: int, sex: str, fitness_goal: str, dietary_preferences: str,
                            activity_level: str) -> None:
        self.height = height
        self.weight = weight
        self.age = age
        self.sex = sex
        self.fitness_goal = fitness_goal
        self.bmi = weight / ((height/100) ** 2)
        self.dietary_preferences = dietary_preferences
        self.activity_level = activity_level

    def update_medical_conditions(self, medical_conditions: str) -> None:
        self.medical_conditions = medical_conditions

    def __repr__(self) -> str:
        return f"User(id={self.id}, weight={self.weight}, height={self.height}, age={self.age},sex={self.sex},\n fitness_goal={self.fitness_goal}, bmi={self.bmi}, dietary_pref={self.dietary_preferences}, activity_level={self.activity_level}, medical_cond={self.medical_conditions})"