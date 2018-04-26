
mysql:
	docker rm -f tmall_crawler || true
	docker run -d --name tmall_crawler -p 3306:3306 -v `pwd`/db_data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=just4fun mysql

superset:
	docker rm -f tmall_crawler_superset || true
	docker run -d --name tmall_crawler_superset -p 8088:8088 -v `pwd`/super_set_data:/var/lib/superset amancevice/superset