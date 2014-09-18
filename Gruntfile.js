'use strict';

function getCLOption(grunt, options) {
    var optionValue = false;
    options.forEach(function(option) {
        optionValue = optionValue || grunt.option(option);
    });
    var value = optionValue || false;
    value = (value === true) || (value === 'on');

    return value;
}

module.exports = function(grunt) {
    var inspect = getCLOption(grunt, ['i', 'inspect']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: [
                'Gruntfile.js',
                'index.js',
                'lib/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        mochacli: {
            options: {
                require: ['should'],
                reporter: 'dot',
                'debug-brk': inspect
            },
            all: [
                'test/**/test-*.js'
            ]
        },
        watch: {
            scripts: {
                files: [
                    'Gruntfile.js',
                    'index.js',
                    'lib/**/*.js',
                    'test/*.js'
                ],
                tasks: ['jshint', 'mochacli'],
                options: {
                    spawn: false,
                },
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'mochacli']);

    grunt.registerTask('dev', ['jshint', 'mochacli', 'watch']);
    grunt.registerTask('test', ['jshint', 'mochacli']);
};
