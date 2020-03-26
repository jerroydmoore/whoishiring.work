# Inspired by <https://medium.com/ultralight-io/getting-gatsby-to-run-on-docker-compose-6bf3b0d97efb>
# The original article uses multi-stage docker builds to run `npm ci`, copying and soft-linking it via:
# RUN mkdir ./node_modules
# COPY --from=0 /app/node_modules /saved/node_modules
# RUN ln -s /saved/node_modules/* ./node_modules/.
# However, this approach ran into errors:
#     /usr/lib/node_modules/gatsby-cli/node_modules/yoga-layout-prebuilt/yoga-layout/build/Release/nbind.js:53
#             throw ex;
#             ^

#     Error: EPERM: operation not permitted, scandir '/proc/1/map_files/56421eadf000-56421f155000'
#         at Object.readdirSync (fs.js:854:3)
#         at GlobSync._readdir (/saved/node_modules/glob/sync.js:288:41)
#         ...
# It appears a subprocess of gatsby is scanning the /proc/<PID>/map_files/ directory,
# which stores symlinks a process is using (See <https://lwn.net/Articles/525721/>)

FROM mhart/alpine-node:12

# NODE_ENV=production causes `gatsby develop` to complain
ENV container=docker

WORKDIR /app

RUN apk update && apk add --no-cache build-base autoconf automake libtool pkgconfig nasm python

RUN npm install --global gatsby-cli && gatsby telemetry --disable

COPY package.json package-lock.json ./

RUN npm ci

EXPOSE 8000

COPY ./ ./

RUN chmod +x ./start.sh
CMD ./start.sh
