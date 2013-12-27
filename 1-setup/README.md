# SNAPP Stack Blog

This project contains a blog built up incrementally in the SNAPP (Scala Ngnix AngularJS Play PostgreSQL) stack.

## Part 1 - Set Up

* Set up PostgreSQL and create a database called `blog`
* Install `ruby`, `node`, `npm`, `bower` and `grunt-cli`
* Add `compass` and `foundation` gems
* Download Play from http://www.playframework.com/download and put `play` in your path
* Navigate to where you want the application and run:

```bash
play new snappy-blog
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

* Update `conf/application.conf`:

```scala
db.default.user=pguser
db.default.user=${?PG_USER}
db.default.password=pgpassword
db.default.password=${?PG_PASSWORD}
db.default.url="jdbc:postgresql://localhost:5432/blog"
db.default.url=${?PG_URL}
db.default.driver=org.postgresql.Driver
```

* In `public` rename `images` to `img`, `javascripts` to `js` and `stylesheets` to `css`
* In `public` add a `templates` directory
* Add `.bowerrc` in the project route:

```json
{
  "directory" : "public/components"
}
```

* Run:

```bash
bower init
bower install angular angular-route angular-sanitize foundation highlightjs showdown --save
```

* Add `package.json`:

```json
{
    "name": "snapp-stack-blog",
    "version": "0.0.0",
    "description": "Scala Ngnix AngularJS Play PostgreSQL",
    "devDependencies": {
        "grunt": "latest",
        "grunt-contrib-compass": "latest",
        "grunt-contrib-concat": "latest",
        "grunt-contrib-uglify": "latest",
        "grunt-contrib-watch": "latest",
        "grunt-karma": "latest",
        "karma": "latest",
        "karma-jasmine": "*",
        "karma-chrome-launcher": "*"
    }
}
```

* Add `Gruntfile.js`:

```javascript
'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: '\n;'
            },
            app: {
                src: [
                    'src/js/app.js',
                    'src/js/services/*.js',
                    'src/js/controllers/*.js',
                    'src/js/directives/*.js',
                    'src/js/filters/*.js'
                ],
                dest: 'public/js/app.js'
            }
        },
        compass: {
            dist: {
                options: {
                    require: ['compass'],
                    importPath: 'public/components/foundation/scss',
                    sassDir: 'src/scss',
                    cssDir: 'public/css'
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                files: {
                    'public/js/app.min.js': [
                        'public/js/app.js'
                    ]
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            concat: {
                files: [
                    'src/js/*.js',
                    'src/js/**/*.js'
                ],
                tasks: ['concat']
            },
            compass: {
                files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
                tasks: ['compass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'concat',
        'compass',
        //'uglify',
        'watch'
    ]);
};
```

* Create a `src` directory and add `scss` and `js` directories to it
* Add `main.scss` to `src/scss`:

```scss
// Make sure the charset is set appropriately
@charset "UTF-8";

// Set some colors
$primary-color: #88D21E;
$secondary-color: #727272;
$tertiary-color: #575757;
$off-white: #efefef;

// Import normalize and foundation to keep from needing multiple CSS files
@import "compass/css3",
        "normalize",
        "foundation",
        "nav";

html, body {
  background-color: $off-white;
  height: 100%;
  overflow-y: auto;
}

footer {
  font-size: rem-calc(12);
  margin: rem-calc(60) 0 rem-calc(10) 0;
}

.panel.browsehappy {
  margin: 0;
}

blockquote {
  @extend .panel;
}

.container {
  height: 100%;
  overflow-y: auto;
  > div {
    min-height: 640px;
    padding: 0 10px 5px 10px;
  }
}

@media #{$medium-up} {
  .container {
    > div {
      padding: 0 20px 10px 20px;
    }
  }
}

@media #{$large-up} {
  .container {
    > div {
      padding: 0 40px 20px 40px;
    }
  }
}
```

* Add `_nav.scss` to `src/scss`:

```scss
nav {
  background-color: $secondary-color;
  height: 35px;
  .zv-nav {
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      float: left;
      a {
        @include transition-property(all);
        @include transition-duration(0.3s);
        @include transition-timing-function(linear);
        color: $off-white;
        display: block;
        margin: 0 rem-calc(5);
        padding: rem-calc(5 8 5 8);
        &:hover {
          background-color: $tertiary-color;
          color: $primary-color;
        }
      }
    }
  }
}

@media #{$medium-up} {
  nav {
    float: left;
    height: 100%;
    overflow-y: auto;
    width: 120px;
    .zv-nav {
      border-top: rem-calc(1) solid $tertiary-color;
      li {
        float: none;
        a {
          background-color: $secondary-color;
          border-bottom: rem-calc(1) solid $tertiary-color;
          margin: 0;
        }
      }
    }
  }
}

@media #{$large-up} {
  nav {
    width: 240px;
  }
}
```

* In `src/js` create `controllers`, `directives`, `filters`, and `services` directories
* In `src/js` add `app.js`:

```javascript
'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        redirectTo: '/about'
    }).when('/about', {
        templateUrl: '/assets/templates/about.html'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);
```

* Update `conf/routes`:

```
# Routes
# This file defines all application routes (Higher priority routes first)
# ~~~~

# Home page
GET     /                           controllers.Application.index
GET     /about                      controllers.Application.index

# Map static resources from the /public folder to the /assets URL path
GET     /assets/*file               controllers.Assets.at(path="/public", file)
```

* Update `app/controllers/Application.scala`:

```scala
package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

}
```

* Update `app/views/main.scala.html`:

```html
@(title: String)(content: Html)
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js oldie lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js oldie lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js oldie lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Kent English: @title</title>

    <link rel="stylesheet" href="@routes.Assets.at("css/main.css")">
    <link rel="shortcut icon" type="image/png" href="@routes.Assets.at("img/favicon.png")">

    <script src="@routes.Assets.at("components/modernizr/modernizr.js")"></script>
  </head>
  <body data-ng-app="app">
    <!--[if lt IE 9]>
      <div class="panel browsehappy">
        You are using an <strong>outdated</strong> browser.
        Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience.
      </div>
    <![endif]-->

    <nav>
      <div class="zv-logo-top">
        <div class="zv-logo"></div>
      </div>
      <div class="zv-logo-bottom"></div>
      <ul class="zv-nav">
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>

    <div class="container">
      @content
      <footer class="text-center">
        &copy;2013 Kent English
      </footer>
    </div>

    <script src="@routes.Assets.at("components/jquery/jquery.min.js")"></script>
    <script src="@routes.Assets.at("components/foundation/js/foundation.min.js")"></script>
    <script src="@routes.Assets.at("components/highlightjs/highlight.pack.js")"></script>
    <script src="@routes.Assets.at("components/showdown/compressed/showdown.js")"></script>
    <script src="@routes.Assets.at("components/angular/angular.min.js")"></script>
    <script src="@routes.Assets.at("components/angular-route/angular-route.min.js")"></script>
    <script src="@routes.Assets.at("components/angular-sanitize/angular-sanitize.min.js")"></script>
    <script src="@routes.Assets.at("js/app.js")"></script>
  </body>
</html>

```

* Update `app/views/index.scala.html`:

```html
@main("Posts") {

    <div data-ng-view></div>

}

```

* In `public/templates` add `about.html`:

```html
<h1>About</h1>
<p>This is a blog written in the SNAPP (Scala Ngnix AngularJS Play PostgreSQL) stack.</p>
```

* In the project root, run the following to generate the JavaScript and CSS files:

```bash
grunt
```

* Separately, also in the project root, run the application:

```bash
play run
```