import bcrypt
from datetime import datetime,timedelta
from sqlmodel import Session, select
from backend.app.models import Users

#hash password
def hash_pwd(password:str)->str:
    pwd = bcrypt.hashpw(password.encode(),bcrypt.gensalt(rounds=12))
    return pwd.decode()

#checking pass
def check_pwd(password:str, hashed:str)->bool:
    return bcrypt.checkpw(password.encode(),hashed.encode())

class UserAuth:
    def __init__(self,session):
        self.session = session 
    
    def check_if_user_exists(self,username:str)->bool:
        if self.get_user_by_username(username):
            return True
        return False
        
        
    def get_user_by_username(self,username:str)-> Users | None:
            query = select(Users).where(Users.username == username)
            res = self.session.exec(query)
            return res.first() 
    
    def add_user(self,username:str,password:str)->bool:
        if self.check_if_user_exists(username):
            return False
        user = Users(username=username,password=hash_pwd(password))
        self.session.add(user)
        self.session.commit()
        return True
        
    
    def authenticate_user(self,username: str, password: str)-> Users | bool:
        user = self.get_user_by_username(username)
        if not user:
            return False
        if not check_pwd(password, user.password):
            return False
        return user
    

