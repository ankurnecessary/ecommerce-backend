ARG NODE_VERSION=22.16.0

FROM node:${NODE_VERSION}-alpine

ARG PNPM_VERSION=10.20.0

# Enable Corepack and pnpm
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

# Installing packages
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 5000