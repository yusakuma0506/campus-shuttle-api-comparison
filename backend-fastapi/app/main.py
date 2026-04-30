from fastapi import FastAPI

app = FastAPI(title="Campus Shuttle FastAPI")


@app.get("/health")
def health_check():
    return {"status": "ok"}
