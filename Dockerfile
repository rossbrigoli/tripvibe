FROM nginx:1.19-alpine as build

USER root
# Install nvm with node and npm
RUN apk add --no-cache --repository http://nl.alpinelinux.org/alpine/edge/main libuv \
    && apk add --no-cache --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main nodejs=12.18.0-r2 nodejs-npm=12.18.0-r2 \
    && echo "NodeJS Version:" "$(node -v)" \
    && echo "NPM Version:" "$(npm -v)"

RUN npm install -g @angular/cli

RUN mkdir /build
COPY . /build
WORKDIR /build

RUN npm install
RUN ng build

FROM nginxinc/nginx-unprivileged

COPY  --from=build /build/dist/tripvibe /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]