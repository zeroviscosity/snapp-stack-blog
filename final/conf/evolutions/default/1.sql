# --- !Ups
CREATE TYPE format AS ENUM ('Page', 'Post');

CREATE TYPE status AS ENUM ('Draft', 'Published', 'Removed');

CREATE TABLE entries (
id varchar(255) not null primary key,
format format not null,
title varchar(255) not null,
md text not null,
html text not null,
status status not null,
created timestamp not null,
updated timestamp not null);

CREATE INDEX ON entries(format, status, created DESC);

# --- !Downs
DROP TABLE IF EXISTS entries;

DROP TYPE IF EXISTS status;

DROP TYPE IF EXISTS format;
