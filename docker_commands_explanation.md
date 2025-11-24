# Docker Commands Explanation

This document details the sequence of Docker commands used to set up the Docker Demo application, explaining the purpose of each command and its flags.

## 1. Network Creation

First, we created a custom bridge network to allow our containers to communicate with each other by name.

```bash
docker network create docker-demo-network
```

*   `docker network create`: The command to create a new network.
*   `docker-demo-network`: The name we assigned to the network.

## 2. Database Container (MySQL)

We started the MySQL database container. Since we didn't manually pull the image first, Docker implicitly pulls `mysql:8.0` from Docker Hub if it's not found locally.

```bash
docker run -d --name mysql-db \
  --network docker-demo-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=demodb \
  mysql:8.0
```

*   `docker run`: Creates and starts a container.
*   `-d`: Detached mode. Runs the container in the background.
*   `--name mysql-db`: Assigns the name `mysql-db` to the container. This name is used by other containers to connect to it (DNS resolution).
*   `--network docker-demo-network`: Connects the container to our custom network.
*   `-e MYSQL_ROOT_PASSWORD=root`: Sets the environment variable for the root password.
*   `-e MYSQL_DATABASE=demodb`: Sets the environment variable to create a default database named `demodb` on startup.
*   `mysql:8.0`: The image to use (MySQL version 8.0).

## 3. Backend Container (FastAPI)

### Build
First, we built the Docker image for the backend from the `./backend` directory.

```bash
docker build -t fastapi-backend ./backend
```

*   `docker build`: Builds an image from a Dockerfile.
*   `-t fastapi-backend`: Tags (names) the resulting image `fastapi-backend`.
*   `./backend`: The build context (directory containing the Dockerfile).

### Run
Then, we ran the backend container using the image we just built.

```bash
docker run -d --name fastapi-backend \
  --network docker-demo-network \
  -p 8000:8000 \
  -e DATABASE_URL="mysql+pymysql://root:root@mysql-db/demodb" \
  fastapi-backend
```

*   `-p 8000:8000`: Maps port 8000 on the host machine to port 8000 inside the container. This allows you to access the API at `localhost:8000`.
*   `-e DATABASE_URL="..."`: Sets the connection string. Note that it uses `mysql-db` (the container name from step 2) as the hostname.
*   `fastapi-backend`: The name of the image we built.

## 4. Frontend Container (React)

### Build
We built the frontend image from the `./frontend` directory.

```bash
docker build -t react-frontend ./frontend
```

*   This uses a multi-stage Dockerfile: it first builds the React app using Node.js, then copies the static files to an Nginx image.

### Run
Finally, we ran the frontend container.

```bash
docker run -d --name react-frontend \
  --network docker-demo-network \
  -p 3000:80 \
  react-frontend
```

*   `-p 3000:80`: Maps port 3000 on the host to port 80 in the container (where Nginx is listening). This allows you to access the UI at `localhost:3000`.
*   `react-frontend`: The image we built.

## Network Architecture Diagram

The following diagram visualizes how the containers communicate with each other and the host machine.

![Network Diagram](/Users/mrmacbook/Documents/projects/Docker-Demo/docker_network_diagram.png)

## Summary of Flow
1.  **Network** created.
2.  **MySQL** starts -> joins network.
3.  **Backend** starts -> joins network -> connects to MySQL using hostname `mysql-db`.
4.  **Frontend** starts -> joins network -> is accessed by user at `localhost:3000` -> browser makes calls to `localhost:8000` (Backend).

> **Note**: The frontend runs in the browser, so it connects to the backend via `localhost:8000` (exposed port), not via the Docker network name. The Docker network is primarily for Backend <-> Database communication in this specific setup.
