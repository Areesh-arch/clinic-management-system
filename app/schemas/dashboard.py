from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class DashboardStats(BaseModel):
    today_revenue: Decimal
    patients: int
    appointments: int
    inventory: int


class RevenuePoint(BaseModel):
    month: str
    revenue: Decimal


class AppointmentPoint(BaseModel):
    day: str
    appointments: int


class RecentPatient(BaseModel):
    name: str
    treatment: str
    status: str


class LowStockItem(BaseModel):
    name: str
    stock: int


class DashboardResponse(BaseModel):
    stats: DashboardStats
    revenue: list[RevenuePoint]
    weekly_appointments: list[AppointmentPoint]
    recent_patients: list[RecentPatient]
    low_stock: list[LowStockItem]