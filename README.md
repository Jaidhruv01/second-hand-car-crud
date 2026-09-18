# CarMart — Second-Hand Car Selling CRUD

A simple full-stack CRUD marketplace for second-hand cars.

## Stack
- React + Vite
- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker Compose
- Nginx

## CRUD
- Create a car listing
- Read all/single car listings
- Update a listing
- Delete a listing
- Search listings

## Run with Docker
Make sure Docker Desktop is running.

```bash
docker compose up --build -d
```

Open:
- Website: http://localhost
- API docs: http://localhost/api/docs

Stop:
```bash
docker compose down
```

Delete containers + database volume:
```bash
docker compose down -v
```

## API routes
GET /cars
GET /cars/{id}
POST /cars
PUT /cars/{id}
DELETE /cars/{id}
