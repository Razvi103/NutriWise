import logging
import os

from data.database import get_db_session
from starlette.middleware.cors import CORSMiddleware
from fastapi import Depends
from models.user import User
from pydantic import BaseModel



root = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)


def make_app():
    from fastapi import FastAPI

    _app = FastAPI()

    origins = [
        "http://localhost",
        "http://localhost:3001",
        # "https://hacktech-deploy-296479925771.europe-west4.run.app"
    ]

    from api.routes import users
    # from routes import auth
    # from routes import context
    # from routes import file
    # from routes import final_prompt
    # from routes import get_file
    # from routes import google_fit
    # from routes import health_report
    # from routes import medication






    _app.include_router(users.router)
    # _app.include_router(prompt.router)
    # _app.include_router(auth.router)
    # _app.include_router(file.router)
    # _app.include_router(context.router)
    # _app.include_router(final_prompt.router)
    # _app.include_router(get_file.router)
    # _app.include_router(google_fit.router)
    # _app.include_router(health_report.router)
    # _app.include_router(medication.router)




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

