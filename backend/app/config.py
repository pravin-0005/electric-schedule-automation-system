import os
from dataclasses import dataclass

from psycopg.conninfo import make_conninfo


@dataclass(frozen=True)
class Settings:
    database_url: str | None

    @classmethod
    def from_env(cls):
        url = os.getenv("DATABASE_URL") or None
        if not url and os.getenv("PGHOST"):
            url = make_conninfo(
                host=os.environ["PGHOST"], port=os.getenv("PGPORT", "5432"),
                dbname=os.environ["PGDATABASE"], user=os.environ["PGUSER"],
                password=os.environ["PGPASSWORD"],
            )
        return cls(database_url=url)
