from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel, ConfigDict
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/carsdb")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    kilometers = Column(Integer, nullable=False)
    fuel = Column(String, nullable=False)
    transmission = Column(String, nullable=False)
    location = Column(String, nullable=False)
    image_url = Column(String, default="")

Base.metadata.create_all(bind=engine)

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    kilometers: int
    fuel: str
    transmission: str
    location: str
    image_url: str = ""

class CarOut(CarCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

app = FastAPI(title="Second Hand Car Marketplace API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Second Hand Car CRUD API is running"}

@app.get("/cars", response_model=list[CarOut])
def get_cars(db: Session = Depends(db_session)):
    return db.query(Car).order_by(Car.id.desc()).all()

@app.get("/cars/{car_id}", response_model=CarOut)
def get_car(car_id: int, db: Session = Depends(db_session)):
    car = db.get(Car, car_id)
    if not car:
        raise HTTPException(404, "Car not found")
    return car

@app.post("/cars", response_model=CarOut, status_code=201)
def create_car(payload: CarCreate, db: Session = Depends(db_session)):
    car = Car(**payload.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car

@app.put("/cars/{car_id}", response_model=CarOut)
def update_car(car_id: int, payload: CarCreate, db: Session = Depends(db_session)):
    car = db.get(Car, car_id)
    if not car:
        raise HTTPException(404, "Car not found")
    for key, value in payload.model_dump().items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

@app.delete("/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(db_session)):
    car = db.get(Car, car_id)
    if not car:
        raise HTTPException(404, "Car not found")
    db.delete(car)
    db.commit()
    return {"message": "Car deleted successfully"}
