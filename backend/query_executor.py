def run_query(db, sql: str) -> list:
    try:
        result = db.execute(sql).fetchdf()
        # Limit to 500 rows so frontend doesn't explode
        result = result.head(500)
        # Convert to JSON-safe format
        return result.to_dict(orient="records")
    except Exception as e:
        raise Exception(f"SQL Error: {str(e)}")