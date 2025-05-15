import logging

from fastapi import APIRouter, Depends, Response, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import json
from data.database import get_db_session
from api.services.file_service import extract_text
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from models.health_report import HealthReport
from pydantic import BaseModel


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/files", tags=["Files"], include_in_schema=False)

base_url = "http://127.0.0.1:1234/v1"
api_key = "lm-studio"
llm_model = "phi-4"

llm = ChatOpenAI(
    base_url=base_url,
    api_key=api_key,
    temperature=0.1,
    model=llm_model
)

class HealthReportResponse(BaseModel):
    id: str
    user_id: str
    report_text: str

    class Config:
        from_attributes = True

@router.get("/get_user_files")
def get_user_report(user_id : str, db_session=Depends(get_db_session)):
    logger.info(f"Getting User {user_id} health report")

    report = db_session.query(HealthReport).filter(HealthReport.user_id == user_id).first()

    if report is None:
        logger.exception(f"Health report for user_id {user_id} not found")
        raise HTTPException(status_code=404, detail="Health report not found")
    
    report_json = json.dumps({
        "id": report.id,
        "user_id": report.user_id,
        "report_text": report.report_text,
    })
    logger.info(f"Health report {report.id} returned successfully")
    return JSONResponse(content=report_json)


@router.post("/process_file")
def work_file(response: Response, user_id: str, uploaded_file: UploadFile, db_session=Depends(get_db_session)):
    logger.info(uploaded_file.headers["content-type"])

    text = extract_text(uploaded_file, uploaded_file.headers["content-type"])


    PROMPT = """
    You are a helpful assistant specialized in medical tasks. You will be given a health report of any type and should summary it extensively keeping attention to health problems and unhealthy levels.
    The summary should be medical focused and must contain less than 512 words!
    Report:
    """ + text + """
    Please respond only in valid text format with no special characters and no additional words other than the report:
    """


    response = llm.invoke([HumanMessage(content=PROMPT)])
    health_report_text = response.content

    new_health_report = HealthReport(user_id, health_report_text)

    db_session.add(new_health_report)

    db_session.commit()

    return "Health report generated SUCCESSFULLY!"