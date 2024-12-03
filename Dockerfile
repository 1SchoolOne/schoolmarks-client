FROM node:20-alpine

WORKDIR /app

# Enable and prepare yarn
RUN corepack enable && corepack prepare yarn@4.5.1 --activate

# Copy all files
COPY . .

# Env variables
ARG GITHUB_PAT
ENV GITHUB_PAT=$GITHUB_PAT

ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

ARG VITE_CLIENT_HOST
ENV VITE_CLIENT_HOST=$VITE_CLIENT_HOST

# Install dependencies
RUN yarn install --immutable

# Expose the default Vite development port
EXPOSE 8080

# Start the development server
CMD ["yarn", "dev"]