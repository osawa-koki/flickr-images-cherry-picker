from fastapi import APIRouter

router = APIRouter()


@router.get("/api/ping", status_code=200)
async def ping_get():
    return {"message": "Hello GET."}


@router.post("/api/ping", status_code=200)
async def ping_post():
    return {"message": "Hello POST."}


@router.put("/api/ping", status_code=200)
async def pint_put():
    return {"message": "Hello PUT."}


@router.delete("/api/ping", status_code=200)
async def ping_delete():
    return {"message": "Hello DELETE."}
