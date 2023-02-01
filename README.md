# moneytracker-api
Express application

## How to create a MySQL Docker container
docker run -d -p 3306:3306 --name moneytracker-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=moneytracker -e MYSQL_USER=moneytracker -e MYSQL_PASSWORD=moneytracker mysql:8.0
