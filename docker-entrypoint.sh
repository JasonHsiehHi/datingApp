# docker-entrypoint.sh
#!/bin/bash

echo "set up daphne"
daphne datingApp.asgi:application -b 0.0.0.0 -p 8009

echo "set up uwsgi"
exec "$@"