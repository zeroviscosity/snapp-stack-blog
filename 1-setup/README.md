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
db.default.password=pgpassword
db.default.url="jdbc:postgresql://localhost:5432/blog"
db.default.driver=org.postgresql.Driver
```

* In `public` rename `images` to `img`, `javascripts` to `js` and `stylesheets` to `css`
* Add `.bowerrc` in the project route:

```json
{
  "directory" : "public/components"
}
```

* Run:

```bash
bower init
bower install angular angular-route angular-sanitize foundation --save
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

// Import normalize and foundation to keep from needing multiple CSS files
@import "normalize",
        "foundation";
```

* In `src/js` create `controllers`, `directives`, `filters`, and `services` directories
* In `src/js` add `app.js`:

```javascript
'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/list'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);
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
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    @content

    <script src="@routes.Assets.at("components/jquery/jquery.min.js")"></script>
    <script src="@routes.Assets.at("components/foundation/js/foundation.min.js")"></script>
    <script src="@routes.Assets.at("components/angular/angular.min.js")"></script>
    <script src="@routes.Assets.at("components/angular-route/angular-route.min.js")"></script>
    <script src="@routes.Assets.at("components/angular-sanitize/angular-sanitize.min.js")"></script>
    <script src="@routes.Assets.at("js/app.js")"></script>
    <script>
       (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
       (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
       m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');
    </script>
  </body>
</html>

```

* Update `app/views/index.scala.html`:

```html
@(message: String)

@main("Posts") {

    <div data-ng-view></div>

}

```

* In the project root, run the following to generate the JavaScript and CSS files:

```bash
grunt
```

* Separately, also in the project root, run the application:

```bash
play run
```