# SNAPP Stack Blog

This project contains a blog built up incrementally in the SNAPP (Scala Ngnix AngularJS Play PostgreSQL) stack.

## Part 2 - Posts

* The following assumes that you're starting with `1-setup`
* In `conf/` create `evolutions/default/1.sql`:

```sql
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
```

* In `app` add `models/Post.scala`:

```scala

```

* Update `conf/routes`:

```
# Routes
# This file defines all application routes (Higher priority routes first)
# ~~~~

# Angular Routes
GET     /                           controllers.Application.index
GET     /about                      controllers.Application.index
GET     /posts/:id                  controllers.Application.post(id: String)

# Posts API
GET     /api/posts                  controllers.Posts.list
GET     /api/posts/drafts           controllers.Posts.drafts
GET     /api/posts/:id              controllers.Posts.single(id: String)
POST    /api/posts                  controllers.Posts.add
PUT     /api/posts                  controllers.Posts.update
DELETE  /api/posts/:id              controllers.Posts.delete(id: String)

# Map static resources from the /public folder to the /assets URL path
GET     /assets/*file               controllers.Assets.at(path="/public", file)
```

* Update `controllers/Application.scala`:

```scala
package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def post(id: String) = Action {
    Ok(views.html.index(id))
  }

}
```

* Create `controllers/Posts.scala`:

```scala

```

* In the project root, run the following to generate the JavaScript and CSS files:

```bash
grunt
```

* Separately, also in the project root, run the application. You should see a warning
`Database 'default' needs evolution!` because the `posts` table needs to be created. Click
`Apply this script now` and then the application should start:

```bash
play run
```