FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

EXPOSE 5174

# Run Vite dev server bound to all network interfaces inside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]