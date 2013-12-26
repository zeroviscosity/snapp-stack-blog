# --- !Ups
CREATE TYPE post_status AS ENUM ('Draft', 'Published', 'Removed');

CREATE TABLE posts (
id varchar(255) not null primary key,
title varchar(255) not null,
content text not null,
status post_status not null,
created timestamp not null,
updated timestamp not null);

# --- !Downs
DROP TABLE IF EXISTS posts;

DROP TYPE IF EXISTS post_status;
