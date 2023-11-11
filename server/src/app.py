import os

from fastapi import FastAPI
from mangum import Mangum

from initializer import initializer

app = FastAPI()
initializer()


@app.get("/api/envs", status_code=200)
async def envs_get():
    return os.environ


@app.get("/api/ping", status_code=200)
async def ping_get():
    return {"message": "Hello GET."}


@app.post("/api/ping", status_code=200)
async def ping_post():
    return {"message": "Hello POST."}


@app.put("/api/ping", status_code=200)
async def ping_put():
    return {"message": "Hello PUT."}


@app.delete("/api/ping", status_code=200)
async def ping_delete():
    return {"message": "Hello DELETE."}

lambda_handler = Mangum(app)
