FROM node:22-alpine

WORKDIR /app

COPY package*.json .
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_EMAIL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "start"]