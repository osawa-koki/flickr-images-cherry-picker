import pytest

from .const import request_context


@pytest.fixture()
def apigw_event():
    """Generates API GW Event"""

    return {
        "headers": {},
        "queryStringParameters": {},
        "pathParameters": {},
        "stageVariables": {},
        "resource": "/{proxy+}",
        "requestContext": request_context,
    }
