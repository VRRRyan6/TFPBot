FROM    node:18-alpine as build-stage

WORKDIR /app
COPY    . .

RUN     npm install
RUN     npm run build

FROM    node:18-bullseye-slim as production-stage

RUN     apt update \
        && apt -y install iproute2 ca-certificates  \
        && useradd -m -d /home/container container

COPY    --from=build-stage /app/dist /home/container

USER    container
ENV     USER=container HOME=/home/container
WORKDIR /home/container

COPY    ./../entrypoint.sh /entrypoint.sh
CMD     [ "/bin/bash", "/entrypoint.sh" ]