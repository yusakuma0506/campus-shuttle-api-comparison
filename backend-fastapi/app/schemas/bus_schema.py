"""Bus schemas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

class BusCreate(BaseModel):
    bus_number: str = Field(..., min_length =1, max_length=50)
    name: str = Field(..., min_length=1, max_length=100)
    status: str = Field(default="active")
    route_id: Optional[int] = None


class BusResponse(BaseModel):
    id: int
    bus_number: str
    name: str
    status: str
    route_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)