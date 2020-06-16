run-dev:
	REACT_APP_POST_175_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_POST_175_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	npm start

run-build:
	REACT_APP_POST_175_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_POST_175_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	npm run build

build-docker-image:
	docker build -t c2dhunilu/post-175 \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) .