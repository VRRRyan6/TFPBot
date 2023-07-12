FROM    node:18-alpine as build-stage

WORKDIR /build
COPY    . .

RUN     npm install
RUN     npm run build

FROM    node:18-alpine as production-stage

RUN     apt update \
        && apt -y install ca-certificates  \
        && useradd -m -d /home/container container

COPY    --from=build-stage /build/dist /home/container

USER    container
ENV     USER=container HOME=/home/container
WORKDIR /home/container

CMD     [ "node", "index.js" ]