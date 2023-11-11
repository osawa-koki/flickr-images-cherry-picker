import json

from src import app

# flake8: noqa: E501
from .fixture import apigw_event


def test_ping_get(apigw_event):
    apigw_event["httpMethod"] = "GET"
    apigw_event["path"] = "/api/ping"
    apigw_event["body"] = {}

    ret = app.lambda_handler(apigw_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert "GET" in data["message"]


def test_ping_post(apigw_event):
    apigw_event["httpMethod"] = "POST"
    apigw_event["path"] = "/api/ping"
    apigw_event["body"] = {}

    ret = app.lambda_handler(apigw_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert "POST" in data["message"]


def test_ping_put(apigw_event):
    apigw_event["httpMethod"] = "PUT"
    apigw_event["path"] = "/api/ping"
    apigw_event["body"] = {}

    ret = app.lambda_handler(apigw_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert "PUT" in data["message"]


def test_ping_delete(apigw_event):
    apigw_event["httpMethod"] = "DELETE"
    apigw_event["path"] = "/api/ping"
    apigw_event["body"] = {}

    ret = app.lambda_handler(apigw_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert "DELETE" in data["message"]
