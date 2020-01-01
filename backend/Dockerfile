# This stage installs our modules
FROM mhart/alpine-node:12

ENV container=docker NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prod

# Then we copy over the modules from above onto a `slim` image
FROM mhart/alpine-node:slim-12

COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
RUN apk add --no-cache tini bash \
    && addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node

ENTRYPOINT ["/sbin/tini", "--"]
USER node

COPY --from=0 /app .
COPY ./src ./src/

CMD ./wait-for-it.sh $PGHOST:$PGPORT -- node ./src/server.js