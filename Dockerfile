FROM python:3.8
LABEL maintainer="anonlarp@gmail.com"

WORKDIR /app/datingApp/
COPY . /app/datingApp/

RUN pip install --upgrade pip 
RUN pip install -r requirements.txt

VOLUME /app

EXPOSE 8003 8089
# ENTRYPOINT [ "/bin/bash", "docker-entrypoint.sh"]

# for test on local host
# CMD python manage.py runserver 0.0.0.0:8000
# CMD uwsgi --ini local_uwsgi.ini
# CMD daphne -b 0.0.0.0 -p 8089 datingApp.asgi:application

COPY ./supervisord.conf /etc/supervisord.conf
COPY ./supervisor_uwsgi.ini /etc/supervisor.d/supervisor_uwsgi.ini
COPY ./supervisor_daphne.ini /etc/supervisor.d/supervisor_daphne.ini

CMD supervisord -c /etc/supervisord.conf
