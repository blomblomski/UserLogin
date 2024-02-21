from sqlalchemy import Column, Integer, String, Boolean

from api.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    full_name = Column(String(100))
    password = Column(String(100))
    active = Column(Boolean(), default=True)

    def __repr__(self):
        return f"User(id={self.id}, username='{self.username}', email='{self.email}')"
