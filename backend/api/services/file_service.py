import io
from PyPDF2 import PdfReader
from dotenv import load_dotenv

import os
import requests

load_dotenv()

ocr_key = os.getenv('OCR_API_KEY')

def extract_text(uploaded_file, type):
    data = ""
    extracted_bytes = ""
    if type == "application/pdf":
        extracted_bytes = uploaded_file.file.read()
        with io.BytesIO(extracted_bytes) as opened_pdf_file:
            reader = PdfReader(opened_pdf_file)
            for page in reader.pages:
                data += page.extract_text()
    if type == "text/plain":
        extracted_bytes = uploaded_file.file.read()
        data = extracted_bytes.decode("utf-8")
    if type == "image/png":
       payload = {'isOverlayRequired': False,
           'apikey': str(ocr_key),
           'language': "eng",
        }
       res = requests.post('https://api.ocr.space/parse/image',
                          files={uploaded_file.filename: uploaded_file.file},
                          data=payload,
                          )
       results = res.json()["ParsedResults"]
       extracted_bytes = uploaded_file.file.read()
       for result in results:
           data += result["ParsedText"]
    return data
