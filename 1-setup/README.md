# SNAPP Stack Blog

This project contains a blog built up incrementally in the SNAPP (Scala Ngnix AngularJS Play PostgreSQL) stack.

## Part 1 - Set Up

* Download Play from http://www.playframework.com/download
* Put `play` in your path
* Navigate to where you want the application and run:
```bash
play new snappy-blog
```
* Set up PostgreSQL and create a database called `blog`
* Update `conf/application.conf`:
```scala
db.default.user=pguser
db.default.password=pgpassword
db.default.url="jdbc:postgresql://localhost:5432/blog"
db.default.driver=org.postgresql.Driver
```
* Install `node`, `npm`, `bower` and `grunt-cli`
* Add `.bowerrc` in the project route:
```json
{
  "directory" : "public/components"
}
```
* Run:
```bash
bower init
bower install angular angular-route foundation --save
```
* Create `Dependencies.scala`:
```scala
import sbt._

object Version {
  val scala         = "2.10.3"
  val postgresql    = "9.1-901.jdbc4"
}

object Library {
  val postgresql    = "postgresql"    % "postgresql"    % Version.postgresql
}

object Dependencies {
  import Library._

  val app = List(
    postgresql
  )
}
```
* Add the following to `build.sbt`:
```sbt
libraryDependencies ++= Dependencies.app
```