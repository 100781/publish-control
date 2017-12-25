'use strict';
/**
 * PostCSS task-specific processors.
 */
var processors_bundle = [
    require('cssnano')
];
var processors_main = [
    require('pixrem')(),
    require('autoprefixer')({browsers: 'last 2 versions'}),
    require('cssnano')()
];

/**
 * Grunt configuration.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n'+
        'last processsed: <%= grunt.template.today("yyyy-mm-dd @ h:MM:ss TT") %>\n' +
        'copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.url %> \n' +
        '*/',
        watch: {
            style: {
                files: ['style/sass/**/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['scripts/*.js'],
                tasks: ['concat:scripts_main']
            }
        },
        bowercopy: {
            options: {
                clean: true,
                runBower: true
            },
            style : {
                options: {
                    destPrefix: 'style/lib/'
                },
                files: {
                    'icono.min.css' : 'icono/dist/icono.min.css'
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            my_target: {
                files: {
                    'scripts/lib/jquery.f81.msgbox.min.js': ['scripts/lib/jquery.f81.msgbox.js']
                }
            }
        },
        postcss : {
            main: {
                options:{
                    inline: false,
                    annotation: 'style/maps',
                    processors: processors_main
                },
                src: 'style/publish-control.css',
                dest: 'style/publish-control.css'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'style/sass',
                    src: ['*.scss'],
                    dest: 'style',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            css: {
                expand: true,
                cwd: 'style',
                src: ['*.css', '!*.min.css'],
                dest: 'style',
                ext: '.min.css'
            }
        },
        buildnumber: {
            options: {
                field: 'build'
            },
            files: ['package.json', 'bower.json']
        },
        version: {
            app_major: {
                options: {
                    release: 'major'
                },
                src: ['package.json', 'bower.json']
            },
            app_minor: {
                options: {
                    release: 'minor'
                },
                src: ['package.json', 'bower.json']
            },
            app_patch: {
                options: {
                    release: 'patch'
                },
                src: ['package.json', 'bower.json']
            },
            app_prerelease: {
                options: {
                    release: 'prerelease'
                },
                src: ['package.json', 'bower.json']
            }
        }
    });

    // Plugins.
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-build-number');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-version');

    // Tasks.
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('plugin-build', ['sass', 'postcss', 'cssmin', 'uglify', 'buildnumber']);
};
