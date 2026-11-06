from sqlmodel import Field, SQLModel, create_engine


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    password: str
    age: int | None = None

class FocusSession(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int
    date: str
    time: int

