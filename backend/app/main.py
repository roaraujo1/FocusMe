from fastapi import FastAPI

app = FastAPI(title="Focus Me API")


@app.get("/health")
def health():
    return {"status": "ok"}
