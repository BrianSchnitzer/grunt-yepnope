/*jshint node:true*/

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    jscs: {
      src: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        config: '.jscsrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/tmp']
    },

    // Configuration to be run (and then tested).
    yepnope: {
      noTests: {
        options: {
          tests: [],
          modernizr: 'missing'
        },
        files: [
          { src: 'test/polyfills/*.js', dest: 'test/tmp/polyfills1' }
        ]
      },
      basicTests: {
        options: {
          tests: ['test1', 'test3']
        },
        files: [
          { src: 'test/polyfills/*.js', dest: 'test/tmp/polyfills2' }
        ]
      },
      basicModernizr: {
        options: {
          modernizr: 'test/modernizr/modernizr.js'
        },
        files: [
          { src: 'test/polyfills/*.js', dest: 'test/tmp/polyfills3' }
        ]
      },
      twoTestsTwoDests: {
        options: {
          modernizr: 'test/modernizr/modernizr.js',
          tests: ['test3']
        },
        files: [
          { src: 'test/polyfills/test{1,2}.js', dest: 'test/tmp/polyfills4a' },
          { src: 'test/polyfills/test3.js', dest: 'test/tmp/polyfills4b' }
        ]
      },
      noPolyfillTestPairs: {
        options: {
          tests: ['test4']
        },
        files: [
          { src: 'test/polyfills/*.js', dest: 'test/tmp/polyfills5' }
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'yepnope', 'nodeunit']);

  grunt.registerTask('validate', ['jshint', 'jscs']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['validate', 'test']);

};
