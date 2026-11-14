from sqlmodel import Field, SQLModel
from datetime import date

class Users(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    password: str

class User_Create(SQLModel):
    username:str
    password:str
    

class FocusSession(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int
    session_date: date
    time: int

