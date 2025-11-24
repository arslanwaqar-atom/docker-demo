# Docker Demo Project

A demonstration of a multi-container application using Docker, featuring a React frontend, FastAPI backend, and MySQL database, all communicating over a custom Docker network.

![Network Diagram](./docker_network_diagram.png)

## Prerequisites

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Quick Start

Follow these steps to get the application running.

### 1. Create the Network

Create a custom bridge network for the containers to communicate.

```bash
docker network create docker-demo-network
```

### 2. Start the Database

Run the MySQL container.

```bash
docker run -d --name mysql-db \
  --network docker-demo-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=demodb \
  mysql:8.0
```

### 3. Build and Run the Backend

Build the FastAPI backend image and run the container.

```bash
# Build
docker build -t fastapi-backend ./backend

# Run
docker run -d --name fastapi-backend \
  --network docker-demo-network \
  -p 8000:8000 \
  -e DATABASE_URL="mysql+pymysql://root:root@mysql-db/demodb" \
  fastapi-backend
```

### 4. Build and Run the Frontend

Build the React frontend image and run the container.

```bash
# Build
docker build -t react-frontend ./frontend

# Run
docker run -d --name react-frontend \
  --network docker-demo-network \
  -p 3000:80 \
  react-frontend
```

## Accessing the Application

*   **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
*   **Backend API Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs).

## Cleanup

To stop and remove all containers and the network:

```bash
docker stop react-frontend fastapi-backend mysql-db
docker rm react-frontend fastapi-backend mysql-db
docker network rm docker-demo-network
```

## Documentation

For a detailed explanation of the Docker commands used, see [docker_commands_explanation.md](./docker_commands_explanation.md).
