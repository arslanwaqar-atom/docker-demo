# Docker Compose Complete Commands Guide

## Table of Contents
1. [Basic Commands](#basic-commands)
2. [Build Commands](#build-commands)
3. [Service Management](#service-management)
4. [Logs & Monitoring](#logs--monitoring)
5. [Network & Volume Management](#network--volume-management)
6. [Container Interaction](#container-interaction)
7. [Multiple Compose Files](#multiple-compose-files)
8. [Production & Environment](#production--environment)
9. [Troubleshooting Commands](#troubleshooting-commands)

---

## Basic Commands

### `docker-compose up`
Start all services in the compose file
```bash
# Start in foreground (shows logs)
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Force recreate containers
docker-compose up --force-recreate

# Build images before starting
docker-compose up --build
```

### `docker-compose down`
Stop and remove containers, networks, volumes
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: Deletes data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Remove orphan containers
docker-compose down --remove-orphans
```

### `docker-compose ps`
List running containers
```bash
# List running containers
docker-compose ps

# List all containers (including stopped)
docker-compose ps -a

# Show container IDs only
docker-compose ps -q
```

---

## Build Commands

### `docker-compose build`
Build or rebuild services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache

# Build with parallel builds
docker-compose build --parallel

# Force rebuild even if image exists
docker-compose build --pull
```

### `docker-compose pull`
Pull service images
```bash
# Pull all images
docker-compose pull

# Pull specific service image
docker-compose pull db

# Pull quietly (no progress)
docker-compose pull -q
```

---

## Service Management

### `docker-compose start`
Start stopped services
```bash
# Start all services
docker-compose start

# Start specific service
docker-compose start backend
```

### `docker-compose stop`
Stop running services
```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop db

# Stop with timeout (seconds)
docker-compose stop -t 30
```

### `docker-compose restart`
Restart services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Restart with timeout
docker-compose restart -t 10
```

### `docker-compose kill`
Force stop services
```bash
# Kill all services
docker-compose kill

# Kill specific service
docker-compose kill backend

# Send specific signal
docker-compose kill -s SIGTERM backend
```

### `docker-compose pause/unpause`
Pause and unpause services
```bash
# Pause all services
docker-compose pause

# Unpause all services
docker-compose unpause

# Pause specific service
docker-compose pause backend
```

---

## Logs & Monitoring

### `docker-compose logs`
View service logs
```bash
# Show logs for all services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# Show logs with timestamps
docker-compose logs -t

# Show last N lines
docker-compose logs --tail=50

# Show logs for specific service
docker-compose logs backend

# Follow specific service logs
docker-compose logs -f backend

# Show logs since specific time
docker-compose logs --since="2023-01-01T00:00:00"

# Combine multiple options
docker-compose logs -f --tail=100 -t backend
```

### Logs with Grep and Filtering
```bash
# Grep specific pattern in logs
docker-compose logs backend | grep "ERROR"

# Grep with case insensitive
docker-compose logs backend | grep -i "error"

# Grep multiple patterns
docker-compose logs backend | grep -E "(ERROR|WARN|Exception)"

# Grep with context lines
docker-compose logs backend | grep -C 3 "database"

# Grep real-time logs
docker-compose logs -f backend | grep "Connection"

# Grep specific time range
docker-compose logs --since="2023-01-01T00:00:00" backend | grep "ERROR"

# Grep and save to file
docker-compose logs backend | grep "ERROR" > errors.log

# Grep with line numbers
docker-compose logs backend | grep -n "ERROR"

# Grep and count occurrences
docker-compose logs backend | grep -c "ERROR"

# Grep multiple services
docker-compose logs | grep -E "(backend|frontend)"

# Grep with inverted match (show everything except)
docker-compose logs backend | grep -v "DEBUG"

# Grep with regular expression for IP addresses
docker-compose logs backend | grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}"

# Grep HTTP status codes
docker-compose logs backend | grep -E "(200|404|500)"

# Grep database queries
docker-compose logs backend | grep -E "(SELECT|INSERT|UPDATE|DELETE)"

# Grep with color highlighting
docker-compose logs backend | grep --color=always "ERROR"

# Grep and follow with tail
docker-compose logs -f --tail=100 backend | grep "Connection"
```

### `docker-compose top`
Display running processes
```bash
# Show processes for all services
docker-compose top

# Show processes for specific service
docker-compose top backend
```

---

## Container Interaction

### `docker-compose exec`
Execute commands in running container
```bash
# Enter bash shell of service
docker-compose exec backend bash

# Enter with interactive terminal (equivalent to -it)
docker-compose exec backend bash
docker-compose exec backend sh
docker-compose exec backend /bin/bash

# Execute single command
docker-compose exec backend ls -la

# Execute as different user
docker-compose exec --user root backend bash

# Execute with environment variables
docker-compose exec -e DEBUG=1 backend python script.py

# Run without TTY (non-interactive)
docker-compose exec -T backend python script.py

# Execute with working directory
docker-compose exec --workdir /app backend ls

# Execute with specific container index
docker-compose exec backend bash

# Interactive commands with input
docker-compose exec backend python manage.py shell
docker-compose exec backend mysql -u root -p

# Run multiple commands
docker-compose exec backend bash -c "cd /app && ls && pwd"

# Execute with custom shell
docker-compose exec backend /bin/sh
docker-compose exec backend /bin/zsh

# Check container environment
docker-compose exec backend env
docker-compose exec backend printenv

# Install packages interactively
docker-compose exec backend pip install requests
docker-compose exec backend apt-get update

# Database operations
docker-compose exec db mysql -u root -proot -e "SHOW DATABASES;"
docker-compose exec db mysql -u root -proot demodb

# File operations
docker-compose exec backend cat /app/requirements.txt
docker-compose exec backend nano app.py
docker-compose exec backend vim config.yml

# Process management
docker-compose exec backend ps aux
docker-compose exec backend top
docker-compose exec backend htop

# Network testing
docker-compose exec backend ping db
docker-compose exec backend curl -I http://localhost:8000
docker-compose exec backend netstat -tlnp

# System information
docker-compose exec backend uname -a
docker-compose exec backend df -h
docker-compose exec backend free -m
```

### `docker-compose run`
Run one-off commands
```bash
# Run command in new container
docker-compose run backend python manage.py migrate

# Run in detached mode
docker-compose run -d backend python worker.py

# Run with environment variable
docker-compose run -e DEBUG=1 backend python script.py

# Run without starting dependencies
docker-compose run --no-deps backend python script.py

# Run with specific service name
docker-compose run --rm backend bash
```

### `docker-compose cp`
Copy files between host and container
```bash
# Copy from host to container
docker-compose cp ./local_file backend:/app/remote_file

# Copy from container to host
docker-compose cp backend:/app/remote_file ./local_file

# Copy entire directory
docker-compose cp ./local_dir/ backend:/app/remote_dir/
```

---

## Network & Volume Management

### `docker-compose config`
Validate and view compose file
```bash
# Show resolved configuration
docker-compose config

# Show configuration for specific service
docker-compose config backend

# Validate only (no output)
docker-compose config -q

# Show services only
docker-compose config --services

# Show volumes only
docker-compose config --volumes
```

### Network Commands
```bash
# List networks
docker network ls

# Inspect network
docker network inspect docker-demo-network

# Create external network (for external: true)
docker network create docker-demo-network

# Remove network
docker network rm docker-demo-network
```

### Volume Commands
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect mysql_data

# Create external volume (for external: true)
docker volume create mysql_data

# Remove volume
docker volume rm mysql_data

# Remove all unused volumes
docker volume prune
```

---

## Multiple Compose Files

### Using Multiple Files
```bash
# Override configuration with additional file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Use specific compose file
docker-compose -f docker-compose.dev.yml up

# Use multiple files with down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Environment-based Files
```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Testing
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

---

## Production & Environment

### Environment Variables
```bash
# Set environment variable
docker-compose up -e NODE_ENV=production

# Use .env file
docker-compose --env-file .env.prod up

# Pass multiple environment variables
docker-compose up -e VAR1=value1 -e VAR2=value2
```

### Scale Services
```bash
# Scale specific service
docker-compose up --scale backend=3

# Scale multiple services
docker-compose up --scale backend=2 --scale worker=4
```

### Resource Limits
```bash
# Set memory limit (in compose file)
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

---

## Troubleshooting Commands

### Health Check Commands
```bash
# Check service health
docker-compose ps

# Wait for service to be healthy
docker-compose run --rm backend wait-for-it db:3306

# Check health status specifically
docker-compose exec backend curl -f http://localhost:8000/health
```

### Debug Commands
```bash
# Show detailed container information
docker inspect docker-demo_backend_1

# Check resource usage
docker stats

# Show system events
docker events

# Check disk usage
docker system df

# Clean up unused resources
docker system prune
```

### Network Debugging
```bash
# Test connectivity between containers
docker-compose exec backend ping db

# Check DNS resolution
docker-compose exec backend nslookup db

# Check port connectivity
docker-compose exec backend nc -zv db 3306
```

---

## Advanced Commands

### Service Dependencies
```bash
# Start specific service and dependencies
docker-compose up backend

# Start without dependencies
docker-compose up --no-deps backend

# Force start order
docker-compose up --force-recreate --always-recreate-deps
```

### Image Management
```bash
# Remove all images created by compose
docker-compose down --rmi local

# Remove all images (including base images)
docker-compose down --rmi all

# Prune unused images
docker image prune
```

### Backup & Restore
```bash
# Backup database
docker-compose exec db mysqldump -u root -proot demodb > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -proot demodb < backup.sql

# Backup volume
docker run --rm -v mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .
```

---

## Quick Reference Cheat Sheet

```bash
# Full lifecycle
docker-compose up -d --build
docker-compose logs -f
docker-compose exec backend bash
docker-compose down

# Development workflow
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker-compose logs -f backend
docker-compose exec backend python manage.py migrate
docker-compose restart backend

# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker-compose logs -f
docker-compose exec backend python manage.py collectstatic --noinput
docker-compose exec db mysqldump -u root -p demodb > backup.sql
```

---

## Common Scenarios

### Scenario 1: Database Connection Issues
```bash
# Check if database is ready
docker-compose logs db
docker-compose exec db mysqladmin ping -h localhost

# Test connection from backend
docker-compose exec backend python -c "import pymysql; pymysql.connect('db', 'root', 'root', 'demodb')"

# Restart backend after database is ready
docker-compose restart backend
```

### Scenario 2: Code Changes Not Reflecting
```bash
# Rebuild and restart
docker-compose up --build -d backend

# Force rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Scenario 3: Cleaning Up Everything
```bash
# Complete cleanup
docker-compose down -v --rmi all --remove-orphans
docker system prune -f
docker volume prune -f
```

---

## Pro Tips

1. **Always use `-d` for production** to run in background
2. **Use `--build` when code changes** to rebuild images
3. **Check logs with `-f` for real-time monitoring**
4. **Use `exec` for debugging running containers**
5. **Always backup volumes before `docker-compose down -v`**
6. **Use health checks for service dependencies**
7. **Version control your docker-compose files**
8. **Use `.env` files for environment variables**

---

This guide covers 95% of Docker Compose commands you'll need for your demo. Each command includes practical examples for real-world usage.
