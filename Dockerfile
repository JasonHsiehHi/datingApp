FROM python:3.8
LABEL maintainer="anonlarp@gmail.com"

WORKDIR /app
COPY . /app/

RUN pip install --upgrade pip 
RUN pip install -r requirements.txt

VOLUME /app

EXPOSE 8003
ENTRYPOINT [ "/bin/bash", "docker-entrypoint.sh"]

# CMD python manage.py runserver 0.0.0.0:8000
CMD uwsgi --ini uwsgi.ini
