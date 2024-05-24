FROM node:18-bullseye

ENV container=docker NODE_ENV=production
WORKDIR /app

RUN apt update && \
  apt install tini && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/bin/tini", "--"]

COPY package.json package-lock.json ./
RUN npm ci --prod

COPY wait-for-it.sh index.js cli.js ./
RUN chmod +x wait-for-it.sh

CMD ./wait-for-it.sh $PGHOST:$PGPORT -- node cli.js
