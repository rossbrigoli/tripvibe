FROM node:lts-alpine AS build

ARG NG_BUILD_ARG

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

RUN ng build ${NG_BUILD_ARG}

### STAGE 2: Run ###
FROM nginx:1.16

COPY ./nginx/nginx.conf /etc/opt/rh/rh-nginx114/nginx/nginx.conf

#COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/dist /opt/app-root

ENTRYPOINT ["nginx", "-g", "daemon off;"]