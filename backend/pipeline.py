import os
import json
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_sql_and_chart(user_question: str, columns: list) -> dict:
    prompt = f"""
You are an expert data analyst for stock market data.
The DuckDB table is called 'stock_data'.
Column names are: {columns}

The user asked: "{user_question}"

Reply ONLY with a valid JSON object in this exact format, nothing else:
{{
  "sql": "SELECT ... FROM stock_data ...",
  "chart_type": "line" or "bar" or "area",
  "x_axis": "column name for x axis",
  "y_axis": "column name for y axis",
  "title": "A short chart title"
}}

Rules:
- Use only DuckDB-compatible SQL
- Always use column names exactly as given
- For time/date columns use them as x_axis
- For price/volume columns use them as y_axis
- Return ONLY the JSON, no explanation, no markdown
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)


def generate_ai_summary(question: str, title: str, data: list, chart_type: str) -> str:
    # Send only first 20 rows to save tokens
    sample = data[:20]

    prompt = f"""
You are a friendly financial analyst helping a finance student understand their stock data.

The student asked: "{question}"
Chart title: "{title}"
Chart type: {chart_type}
Data sample (first 20 rows): {json.dumps(sample, default=str)}

Write exactly 3 sentences in plain simple English:
1. What the data shows overall (mention specific numbers)
2. The most interesting or surprising finding
3. One practical takeaway for a finance student

Rules:
- Use simple language a student can understand
- Mention specific numbers from the data
- Do NOT use bullet points
- Do NOT use markdown
- Keep each sentence under 30 words
- Sound like a helpful professor, not a robot
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=200
    )
    return response.choices[0].message.content.strip()