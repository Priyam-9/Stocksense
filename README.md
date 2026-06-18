# StockSense AI

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)](https://python.org)
[![Groq](https://img.shields.io/badge/LLM-Groq_LLaMA_3.3_70B-f55036?style=flat)](https://groq.com)
[![DuckDB](https://img.shields.io/badge/DuckDB-in--memory_SQL-FFF000?style=flat)](https://duckdb.org)
[![MySQL](https://img.shields.io/badge/MySQL-audit_store-4479A1?style=flat&logo=mysql)](https://mysql.com)
[![Deployed on Render](https://img.shields.io/badge/API-Render-46E3B7?style=flat)](https://stocksense-backend-qlyv.onrender.com)
[![Frontend on Vercel](https://img.shields.io/badge/UI-Vercel-000000?style=flat&logo=vercel)](https://stocksense-rho-umber.vercel.app)

> Upload any stock CSV → ask questions in plain English → 
> LLaMA 3.3 generates SQL → DuckDB executes it → 
> Recharts renders the result. Every upload triggers a 
> production ETL pipeline with 7-point data validation.

---

> ⚠️ **Project Status: Active Development**
>
> StockSense AI is currently a work in progress. While the core database querying and basic ETL workflows are operational, this project is still in its early stages. Many features, robust error handling, and performance optimizations have not yet been fully developed or integrated. You may encounter bugs or incomplete UI states as development continues.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://stocksense-rho-umber.vercel.app |
| API Docs (Swagger) | https://stocksense-backend-qlyv.onrender.com/docs |
| API Health | https://stocksense-backend-qlyv.onrender.com/health |

**Try it:** Upload any NSE/BSE/Yahoo Finance CSV 
and ask *"Show closing price over time"*

---

## Architecture


### Request flow

```
User uploads CSV
  → POST /upload-csv
  → DuckDB loads table in-memory
  → Columns + preview returned

User asks "Show me volume spikes in October"
  → POST /query
  → Groq LLaMA 3.3-70B generates DuckDB SQL
  → DuckDB executes SQL on in-memory table
  → Chart config + data + AI insight returned
  → React renders Recharts visualization

Every upload also triggers:
  → ETL pipeline (validate → transform → load)
  → 7 data quality checks (nulls, dupes, price logic)
  → Batch insert to MySQL with ON DUPLICATE KEY
  → Run metrics logged to pipeline_runs audit table
```

---

## API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/upload-csv` | Upload CSV, load into DuckDB, return schema | — |
| `POST` | `/query` | NL question → LLM SQL → chart data + AI summary | — |
| `GET` | `/pipeline-runs` | Paginated ETL audit trail from MySQL | — |
| `GET` | `/health` | Service health check | — |

### Example: Query endpoint

**Request**
```json
POST /query
{
  "question": "Show me the highest volume days in the last 30 rows"
}
```

**Response**
```json
{
  "sql": "SELECT Date, Volume FROM stock_data ORDER BY Volume DESC LIMIT 10",
  "chart_type": "bar",
  "data": [...],
  "summary": "The highest trading volume occurred on 2024-03-15 with 2.3M shares..."
}
```

---

## Data Pipeline

```
CSV Input
  ↓
validate.py    — 7 checks: null%, duplicate dates,
                 price logic, type coercion,
                 column presence, value ranges, format
  ↓
pipeline.py    — Extract + transform (clean commas,
                 parse dates, normalize columns)
  ↓
storage.py     — MySQL batch insert (ON DUPLICATE KEY UPDATE)
                 + pipeline_runs audit log
  ↓
scheduler.py   — Folder watcher: auto-processes new CSVs
                 dropped into /watched_dir
```

**Benchmark:** 123 rows processed in 0.38 seconds

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| API Framework | FastAPI | Async-native, auto Swagger, Pydantic validation |
| LLM | Groq LLaMA 3.3-70B | Fastest inference, free tier, SQL generation |
| Query Engine | DuckDB | In-memory columnar SQL, zero infra for analytics |
| Audit Store | MySQL | Persistent pipeline run history |
| Pipeline | Pandas + mysql-connector | Reliable ETL with batch writes |
| Frontend | React 18 + Vite | Fast HMR, lightweight |
| Charts | Recharts | Composable, React-native |
| Deploy | Render + Vercel | Free tier, git-push deploy |

---

## Project Structure

```
stocksense/
├── backend/          # FastAPI backend (deployed on Render)
│   ├── main.py          # App entry, routes, CORS
│   ├── pipeline.py      # Groq AI + SQL generation
│   ├── query_executor.py # DuckDB query runner
│   ├── validate.py      # Data quality checks
│   ├── storage.py       # MySQL connection + writes
│   ├── logger.py        # Structured logging
│   ├── config.py        # Environment settings
│   └── requirements.txt
├── data_pipeline/       # Standalone ETL pipeline
│   ├── pipeline.py      # Full ETL orchestration
│   ├── validate.py      # 7-point validation
│   ├── storage.py       # Batch MySQL insert
│   ├── scheduler.py     # File watcher
│   ├── logger.py
│   ├── config.py
│   └── requirements.txt
├── client/              # React frontend (deployed on Vercel)
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── UploadZone.jsx
│           ├── ChatBar.jsx
│           ├── StockChart.jsx
│           ├── AISummary.jsx
│           ├── DashboardGrid.jsx
│           └── PipelineRuns.jsx
└── render.yaml          # Render deployment config
```

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/Priyam-9/Stocksense
cd Stocksense

# 2. Backend
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Fill in: GROQ_API_KEY, MYSQL_URL, FRONTEND_URL

uvicorn main:app --reload
# API at http://localhost:8000/docs

# 3. Frontend (separate terminal)
cd ../client
npm install
npm run dev
# UI at http://localhost:5173
```

---



## Author

**Priyam Patel** — Final year B.Tech CSE, Gautam Buddha University (CGPA 8.8)  

Targeting: Data Engineering and Analyst Roles.
[GitHub](https://github.com/Priyam-9) · [LinkedIn](YOUR_LINKEDIN_URL)
