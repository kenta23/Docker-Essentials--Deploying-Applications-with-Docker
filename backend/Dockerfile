#1. base image installation
#2. set work directory
#3. copy package files and install 
#4. install dependencies
#5. copy the rest of the application
#6. expose the port 
#7. cmd to run the application

FROM oven/bun:latest  

WORKDIR /app 

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["bun", "--watch", "run", "index.ts"]



