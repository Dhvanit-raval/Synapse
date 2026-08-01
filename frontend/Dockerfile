# First stage: build the React app with Node.
# This stage creates static files in /app/dist.
FROM node:22-alpine AS build

# Set the working folder inside the build container.
WORKDIR /app

# Copy dependency files first so Docker can cache npm install.
COPY package*.json ./

# Install dependencies exactly from package-lock.json.
RUN npm ci

# Copy the frontend source code into the build container.
COPY . .

# Build-time variable for the backend URL.
# Leave it empty when Nginx proxies /api to the backend container.
ARG VITE_API_BASE_URL=

# Vite reads env variables during build, so we expose the build arg as an env var.
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Create the production frontend bundle in /app/dist.
RUN npm run build

# Second stage: serve the built static files with Nginx.
# The final image does not need Node or source files, only Nginx and dist output.
FROM nginx:1.27-alpine

# Replace the default Nginx config with our app config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the built frontend files from the build stage.
COPY --from=build /app/dist /usr/share/nginx/html

# Document that Nginx listens on port 80 inside the container.
EXPOSE 80
