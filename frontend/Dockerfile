# syntax=docker/dockerfile:1

# 1️⃣ Base image for Bun
FROM oven/bun:latest

WORKDIR /app

# Install dependencies & build the Vite project
COPY package.json bun.lock ./

# Build the Vite project
RUN bun install

COPY . .

EXPOSE 5173

# 2️⃣ Run Vite Dev Server in Development Mode
CMD ["bun", "run", "dev", "--host"]
