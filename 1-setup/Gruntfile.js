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