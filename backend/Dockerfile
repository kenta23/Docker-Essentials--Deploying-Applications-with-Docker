# Use Bun official image
FROM oven/bun:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the entire application
COPY . .

# Copy the entrypoint script and give it execute permissions
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the backend port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
CMD ["bun", "--watch", "run", "index.ts"]
