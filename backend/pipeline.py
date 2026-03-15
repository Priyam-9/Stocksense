from groq import Groq

import os
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

    # Clean up in case AI adds markdown backticks
    raw = raw.replace("```json", "").replace("```", "").strip()

    import json
    result = json.loads(raw)
    return result