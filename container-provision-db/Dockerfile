FROM mhart/alpine-node:12

ENV container=docker NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache tini bash \
    && addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node
ENTRYPOINT ["/sbin/tini", "--"]

COPY package.json package-lock.json ./
RUN npm ci --prod

COPY wait-for-it.sh index.js ./
RUN chmod +x wait-for-it.sh

USER node

CMD ./wait-for-it.sh $PGHOST:$PGPORT -- node index.js
