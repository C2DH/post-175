FROM node:12-alpine as post-175-builder

WORKDIR /post-175

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY public ./public
COPY src ./src

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

RUN free -m
RUN npm run build

FROM busybox
WORKDIR /post-175
COPY --from=post-175-builder /post-175/build ./
