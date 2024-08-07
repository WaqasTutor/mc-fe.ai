FROM node:alpine as compile-image

RUN apk update && apk add --no-cache make git

ARG ENV_TARGET
ARG APP=marketingcopy-frontend

# Note we must set ENV_TARGET as an environment variable within AWS CodeBuild environment settings
ENV APP ${APP}
RUN echo 'Building for ' ${ENV_TARGET} ' environment via angular.json'

WORKDIR /opt/ng
COPY . ./

ENV NODE_OPTIONS --openssl-legacy-provider

RUN npm install
RUN npm run build -- --configuration=${ENV_TARGET}

# Second stage for the Nginx container
FROM nginx

#!/bin/sh

RUN rm -rf /usr/share/nginx/html/*
COPY --from=compile-image /opt/ng/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=compile-image /opt/ng/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=compile-image /opt/ng/ssl/beta_marketingcopy_ai.crt /etc/ssl/certs/beta_marketingcopy_ai.crt
COPY --from=compile-image /opt/ng/ssl/private.key    /etc/ssl/private/private.key

COPY --from=compile-image /opt/ng/dist/enlink/ /usr/share/nginx/html/


EXPOSE 4200 80
EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
