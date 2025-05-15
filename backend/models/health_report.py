from sqlalchemy import Column, Integer, String, ForeignKey
from data.database import Base
from sqlalchemy.orm import relationship
from .user import User


class HealthReport(Base):
    __tablename__ = 'health_report'
    id = Column(Integer, primary_key=True, autoincrement=True)
    report_text = Column(String(512), nullable=True)
    file_path = Column(String(255), nullable=False)

    user_id = Column(String(255), ForeignKey("users.id"), nullable=False)
    user = relationship(User)

    def __init__(self, text, user_id, file_name, file_path) -> None:
        self.text = text
        self.user_id = user_id
        self.file_name = file_name
        self.file_path = file_path

    def __repr__(self) -> str:
        return f'<HealthReport:\n \
                id: {self.id}\n \
                text: {self.text} \
                file_name:{self.file_name} \
                file_path: {self.file_path} \
                user_id: {self.user_id}>'
