FROM node:12-alpine as post-175-builder

ARG GIT_TAG
ARG GIT_BRANCH
ARG GIT_REVISION

WORKDIR /post-175

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY public ./public
COPY src ./src
COPY .env .

ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096

ENV REACT_APP_GIT_TAG=${GIT_TAG}
ENV REACT_APP_GIT_BRANCH=${GIT_BRANCH}
ENV REACT_APP_GIT_REVISION=${GIT_REVISION}

RUN npm run build

FROM busybox
WORKDIR /post-175
COPY --from=post-175-builder /post-175/build ./
