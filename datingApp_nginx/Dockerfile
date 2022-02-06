FROM nginx:stable
LABEL maintainer="anonlarp@gmail.com"

COPY nginx.conf /etc/nginx/nginx.conf
COPY anonlarp_nginx.conf /etc/nginx/sites-available/
COPY static /etc/static/
COPY media /etc/media/

RUN mkdir -p /etc/nginx/sites-enabled/ && \
    ln -s /etc/nginx/sites-available/anonlarp_nginx.conf /etc/nginx/sites-enabled/
CMD nginx -g 'daemon off;'
