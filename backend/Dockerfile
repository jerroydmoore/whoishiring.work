# This stage installs our modules
FROM node:18-bullseye

ENV container=docker NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prod

# Then we copy over the modules from above onto a `slim` image
# FROM node:18-alpine

COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
RUN apt update && \
  apt install tini && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/bin/tini", "--"]

# COPY --from=0 /app .
COPY ./src ./src/

CMD ./wait-for-it.sh $PGHOST:$PGPORT -- node ./src/server.js
