# test2021
start from 2021/03

# version
macOS 11.4
anaconda 4.9.2
python 3.8.8
django 3.2
channel 3.0.3
channel-redis 3.2.0
jquery 3.6.0
bootstrap 5.0.2
postgreSQL 13.5 
uwsgi 2.0.20
daphne 3.0.2 
supervisor 4.2.4
nginx 1.20.2
docker 20.10.7

# supervisord
local_supervisor_daphne.ini和local_supervisor_uwsgi.ini(local_uwsgi.ini)都是直接用本地端電腦操作supervisord (本地端的supervisord.conf已修改)

而supervisor_daphne.ini和supervisor_uwsgi.ini(uwsgi.ini)則用containerized來操作supervisord (需要複製supervisord.conf到/etc/supervisord.conf)
