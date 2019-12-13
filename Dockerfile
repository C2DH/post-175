FROM node:12-alpine as post-175-builder

WORKDIR /post-175

RUN apk add --no-cache git build-base python

COPY package.json yarn.lock ./

RUN yarn install

COPY public ./public
COPY src ./src

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

RUN yarn run build

FROM busybox
WORKDIR /post-175
COPY --from=post-175-builder /post-175/build ./
