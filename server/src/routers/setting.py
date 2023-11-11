import os

from fastapi import APIRouter

router = APIRouter()


@router.get("/api/envs", status_code=200)
async def envs_get():
    return os.environ
