import json
from datetime import datetime, timezone
from enum import StrEnum
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

CONTRACT = json.loads((Path(__file__).resolve().parents[2] / "contracts/foundation.json").read_text())
MIGRATION_VERSION = CONTRACT["migrationVersion"]
ProcessingStage = StrEnum("ProcessingStage", {stage: stage for stage in CONTRACT["processingStages"]})


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class SystemStatus(StrictModel):
    checkedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    database: Literal["connected", "unavailable", "not_configured"]
    schema: Literal["ready", "pending", "unknown"]
    version: str | None = None
    phase: Literal[1] = 1
    processingEnabled: Literal[False] = False

    @model_validator(mode="after")
    def consistent_readiness(self):
        if self.schema == "ready" and (self.database != "connected" or self.version != MIGRATION_VERSION):
            raise ValueError("Ready requires a connected database and the required migration")
        if self.schema != "ready" and self.version is not None:
            raise ValueError("Only ready schemas report a migration version")
        if self.database != "connected" and self.schema != "unknown":
            raise ValueError("Unavailable databases have unknown schemas")
        return self


class FileMetadata(StrictModel):
    kind: Literal["drawing", "template"]
    name: str = Field(min_length=1, max_length=255)
    size: int = Field(gt=0)
    sha256: str = Field(pattern=r"^[a-f0-9]{64}$")

    @model_validator(mode="after")
    def supported_file(self):
        extension = ".pdf" if self.kind == "drawing" else ".xlsx"
        if not self.name.lower().endswith(extension) or any(c in self.name for c in ("/", "\\", "\x00")):
            raise ValueError("Expected a supported filename, not a path")
        if self.size > CONTRACT["fileLimits"][self.kind]:
            raise ValueError("File exceeds the intake size limit")
        return self


class IntakeMetadata(StrictModel):
    projectName: str = Field(min_length=1, max_length=160)
    drawing: FileMetadata
    template: FileMetadata

    @field_validator("projectName")
    @classmethod
    def project_name(cls, value):
        if not value.strip():
            raise ValueError("Project name must not be blank")
        return value.strip()

    @model_validator(mode="after")
    def correct_slots(self):
        if self.drawing.kind != "drawing" or self.template.kind != "template":
            raise ValueError("File kinds must match their intake slots")
        return self


class FoundationContract(StrictModel):
    contractVersion: Literal["1.0.0"]
    phase: Literal[1]
    processingEnabled: Literal[False]
    migrationVersion: Literal["001_foundation"]
    fileLimits: dict[str, int]
    processingStages: list[str]
    intakeSchema: dict
