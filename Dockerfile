ARG NODE_VERSION=22.13.0
ARG PLATFORM=linux/arm64

# Create build stage
FROM node:${NODE_VERSION}-slim AS build

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY package.json pnpm-lock.yaml .npmrc /app/

## Install dependencies
RUN pnpm install --shamefully-hoist

# Copy the rest of the application files to the working directory
COPY . ./

# Build the application
RUN --mount=type=secret,id=nuxt-ui-pro-license,env=NUXT_UI_PRO_LICENSE pnpm run build

# Create a new stage for the production image
FROM --platform=${PLATFORM} node:${NODE_VERSION}-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the output from the build stage to the working directory
COPY --from=build /app/.output ./

# Define environment variables
ENV HOST=0.0.0.0 NODE_ENV=production
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 3000

# Start the application
ENTRYPOINT ["node","/app/server/index.mjs"]
