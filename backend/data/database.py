from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


engine = create_engine('sqlite:///data/database.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def create_session():
    session = SessionLocal()
    Base.metadata.create_all(bind=engine)
    return session


def get_db_session():
    db_session = create_session()
    try:
        yield db_session
    finally:
        db_session.close()
