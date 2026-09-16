from psycopg import Error
from psycopg_pool import ConnectionPool, PoolTimeout

from .contracts import MIGRATION_VERSION, SystemStatus


def read_status(pool: ConnectionPool | None) -> SystemStatus:
    if pool is None:
        return SystemStatus(database="not_configured", schema="unknown")
    connected = False
    try:
        with pool.connection() as connection:
            connection.execute("SELECT 1")
            connected = True
            row = connection.execute(
                "SELECT version FROM public.es_schema_migrations WHERE version = %s",
                (MIGRATION_VERSION,),
            ).fetchone()
            return SystemStatus(database="connected", schema="ready" if row else "pending", version=row[0] if row else None)
    except (Error, PoolTimeout) as error:
        missing_table = getattr(error, "sqlstate", None) == "42P01"
        return SystemStatus(
            database="connected" if connected else "unavailable",
            schema="pending" if connected and missing_table else "unknown",
        )
