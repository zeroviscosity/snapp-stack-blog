# SNAPP Stack Blog

This project contains a blog built up incrementally in the SNAPP (Scala Ngnix AngularJS Play PostgreSQL) stack.

## Part 1 - Set Up

* Set up PostgreSQL and create a database called `blog`
* Install `ruby`, `node`, `npm`, `bower` and `grunt-cli`
* Download Play from http://www.playframework.com/download and put `play` in your path
* Navigate to where you want the application and run:

```bash
play new snappy-blog
```

* Update `conf/application.conf`:

```scala
db.default.user=pguser
db.default.password=pgpassword
db.default.url="jdbc:postgresql://localhost:5432/blog"
db.default.driver=org.postgresql.Driver
```

* Run:

```bash
gem install compass zurb-foundation
```

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
                    'src/javascripts/app.js',
                    'src/javascripts/services/*.js',
                    'src/javascripts/controllers/*.js',
                    'src/javascripts/directives/*.js',
                    'src/javascripts/filters/*.js'
                ],
                dest: 'public/javascripts/app.js'
            }
        },
        compass: {
            dist: {
                options: {
                    require: ['compass', 'zurb-foundation'],
                    sassDir: 'src/sass',
                    cssDir: 'public/stylesheets'
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                files: {
                    'public/javascripts/app.min.js': [
                        'public/javascripts/app.js'
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
                    'src/javascripts/*.js',
                    'src/javascripts/**/*.js'
                ],
                tasks: ['concat']
            },
            compass: {
                files: ['src/sass/*.scss', 'src/sass/**/*.scss'],
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

* Create a `src` directory and add `sass` and `javascripts` directories to it
* In `src/javascripts` create `controllers`, `directives`, `filters`, and `services` directories
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
