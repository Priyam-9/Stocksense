from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import duckdb
import pandas as pd
import io

from pipeline import generate_sql_and_chart
from query_executor import run_query

app = FastAPI()

import os

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    os.environ.get("FRONTEND_URL", "")  # Vercel URL from .env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = duckdb.connect()
uploaded_columns = []


@app.get("/")
def read_root():
    return {"message": "StockSense API is running!"}


@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    global uploaded_columns

    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    df.columns = df.columns.str.strip().str.replace(" ", "_")

    db.register("stock_data", df)
    uploaded_columns = list(df.columns)
    preview = df.head(5).to_dict(orient="records")

    return {
        "columns": uploaded_columns,
        "total_rows": len(df),
        "preview": preview
    }


# ✅ New query endpoint
class QueryRequest(BaseModel):
    question: str

@app.post("/query")
async def query(request: QueryRequest):
    if not uploaded_columns:
        raise HTTPException(status_code=400, detail="No CSV uploaded yet!")

    try:
        # Step 1: AI generates SQL + chart config
        ai_result = generate_sql_and_chart(request.question, uploaded_columns)

        # Step 2: Run the SQL on DuckDB
        data = run_query(db, ai_result["sql"])

        return {
            "sql": ai_result["sql"],
            "chart_type": ai_result.get("chart_type", "line"),
            "x_axis": ai_result.get("x_axis"),
            "y_axis": ai_result.get("y_axis"),
            "title": ai_result.get("title", "Chart"),
            "data": data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))