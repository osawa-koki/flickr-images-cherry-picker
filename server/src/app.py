from fastapi import FastAPI
from initializer import initializer
from mangum import Mangum
from routers import ping, setting

initializer()

app = FastAPI()
app.include_router(ping.router)
app.include_router(setting.router)

lambda_handler = Mangum(app)
