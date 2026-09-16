import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from psycopg_pool import ConnectionPool

from .config import Settings
from .contracts import CONTRACT, FoundationContract, IntakeMetadata, SystemStatus
from .database import read_status

logger = logging.getLogger(__name__)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings.from_env()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        pool = None
        if settings.database_url:
            pool = ConnectionPool(
                conninfo=settings.database_url, open=False, min_size=0, max_size=2,
                timeout=3, max_waiting=16,
                kwargs={"connect_timeout": 3, "options": "-c statement_timeout=3000 -c default_transaction_read_only=on"},
            )
            pool.open(wait=False)
        app.state.pool = pool
        try:
            yield
        finally:
            if pool:
                pool.close()

    app = FastAPI(title="Electric Schedule Foundation", version="1.0.0", lifespan=lifespan)

    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception):
        logger.error("Foundation request failed (%s)", type(exc).__name__)
        return JSONResponse(status_code=500, content={"detail": "Service check failed"}, headers={"Cache-Control": "no-store"})

    @app.get("/health/live")
    def live():
        return {"status": "ok", "phase": 1, "processingEnabled": False}

    @app.get("/health/ready", response_model=SystemStatus, responses={503: {"model": SystemStatus}})
    def ready(request: Request, response: Response):
        status = read_status(request.app.state.pool)
        if status.schema != "ready":
            response.status_code = 503
        return status

    @app.get("/api/v1/foundation", response_model=FoundationContract)
    def foundation():
        return {**CONTRACT, "intakeSchema": IntakeMetadata.model_json_schema()}

    return app


app = create_app()
