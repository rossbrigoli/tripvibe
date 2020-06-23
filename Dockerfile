FROM node:lts-alpine AS build

ARG NG_BUILD_ARG

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

RUN ng build ${NG_BUILD_ARG}

### STAGE 2: Run ###
FROM nginxinc/nginx-unprivileged

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]