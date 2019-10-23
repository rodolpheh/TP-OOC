init:
	docker-compose pull
	make install

install:
	docker-compose run --rm node npm install

start up:
	docker-compose up -d

stop:
	docker-compose stop

restart:
	make stop
	make start

log:
	docker logs -f starter-ts-express_server


down:
	docker-compose down
