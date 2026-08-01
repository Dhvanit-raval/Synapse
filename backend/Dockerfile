# Use an official Node.js image as the base for the backend container.
# The "alpine" variant is smaller than the normal Node image, so the final image is lighter.
FROM node:22-alpine

# Set the working folder inside the container.
# Every command after this runs from /app.
WORKDIR /app

# Copy only dependency files first.
# Docker can cache this layer, so dependencies are not reinstalled every time only source code changes.
COPY package*.json ./

# Install exact dependency versions from package-lock.json.
# --omit=dev skips dev-only packages like nodemon in the production image.
RUN npm ci --omit=dev

# Copy the backend source code into the container.
COPY . .

# Tell Node libraries that this is a production environment.
ENV NODE_ENV=production

# Document that the backend listens on port 3000 inside the container.
# The actual host port is mapped in docker-compose.yml.
EXPOSE 3000

# Start the backend using the package.json "start" script.
CMD ["npm", "start"]
