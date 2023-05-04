FROM postgres:15.2
ENV POSTGRES_USER dbuser
ENV POSTGRES_PASSWORD user
ENV POSTGRES_DB auth
COPY init.sql /docker-entrypoint-initdb.d/
