from contextlib import asynccontextmanager
from datetime import timedelta
from fastapi import Depends,FastAPI, HTTPException, status
from typing import Annotated

from sqlmodel import Session
from backend.app.database import create_db_and_tables,get_session
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from backend.app import auth, security
from backend.app.models import User_Create

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Focus Me API", lifespan=lifespan)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
def login_for_access_token(
    
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session,Depends(get_session)],
) -> security.Token:
    user_auth = auth.UserAuth(session)
    user = user_auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={str(user.id): user.username}, expires_delta=access_token_expires
    )
    return security.Token(access_token=access_token, token_type="bearer")

@app.post("/signup")
def create_user(user:User_Create,session: Annotated[Session,Depends(get_session)])->dict: 
    user_auth = auth.UserAuth(session)
    res = user_auth.add_user(user.username,user.password)
    if not res:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "Username exists"
        )
    return {"user":"user was created"}





@app.get("/health")
def health():
    return {"status": "ok"}
