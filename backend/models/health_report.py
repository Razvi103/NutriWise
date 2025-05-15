from sqlalchemy import Column, Integer, String, ForeignKey
from data.database import Base
from sqlalchemy.orm import relationship
from .user import User


class HealthReport(Base):
    __tablename__ = 'health_reports'
    id = Column(Integer, primary_key=True, autoincrement=True)
    report_text = Column(String(512), nullable=False)
    user_id = Column(String(255), ForeignKey("users.id"), nullable=False)
    user = relationship(User)

    def __init__(self, user_id, text) -> None:
        self.report_text = text
        self.user_id = user_id

    def __repr__(self) -> str:
        return f'<HealthReport:\n \
                id: {self.id}\n \
                text: {self.text} \
                user_id: {self.user_id}>'
