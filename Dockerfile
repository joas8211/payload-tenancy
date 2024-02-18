FROM node:20-alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache chromium

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run everything after as non-privileged user.
USER node

# Use empty workdir.
WORKDIR /home/node/app

# Create mountpoint for node_modueles.
RUN mkdir node_modules

ENV PAYLOAD_HOST=0.0.0.0
ENV PAYLOAD_PORT=3000
