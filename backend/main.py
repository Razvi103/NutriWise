import logging
import os

from data.database import get_db_session
from starlette.middleware.cors import CORSMiddleware
from fastapi import Depends
from models.user import User
from pydantic import BaseModel
from api.routes import users, uploaded_files, meal_plans


root = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)


def make_app():
    from fastapi import FastAPI

    _app = FastAPI()

    origins = [
        "http://localhost",
        "http://localhost:3001",
    ]


    _app.include_router(users.router)
    _app.include_router(uploaded_files.router)
    _app.include_router(meal_plans.router)


    _app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = make_app()
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}

