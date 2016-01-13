# grunt-yepnope

> Integrate yepnope-available polyfill creation into a grunt task.

This plugin is used to dynamically create all potential combinations of required polyfills based on a dynamic set of feature tests.
It is designed to provide any and all of the files yepnope may require when ran on a given client.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-yepnope --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-yepnope');
```

## The "yepnope" task

### Overview
In your project's Gruntfile, add a section named `yepnope` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  yepnope: {
    options: {
      tests: ['some', 'explicit', 'tests'],
      modernizer: 'path/to/modernizr-build.js'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.tests
Type: `Array`
Default value: `[]`

An array of test names that you would like to explicitly generate polyfill files for.

#### options.modernizr
Type: `String`
Default value: ``

A string value describing the path to your modernizr build.  grunt-yepnope will crawl your modernizr file
and attempt to match dicovered tests with polyfill files.

### Usage Examples

#### Explicit Tests
In this example, test1 and test2 are explicitly declared, and a pairing polyfill will be searched for.  The task will then produce a
set of all potential combinations of the files: test1.js, test2.js, and test1-test2.js.

```js
grunt.initConfig({
  yepnope: {
    options: {
      tests: ['test1', 'test2']
    },
    files: {
      'dest/polyfills': ['src/polyfills'],
    },
  },
})
```

#### Modernizr
In this example, the plugin will crawl through the modernizr file and discover any available feature tests.  It will then search for
polyfills for those feature tests and create a set of all potential combinations.

```js
grunt.initConfig({
  yepnope: {
    options: {
      modernizr: 'modernizr/modernizr-build.js'
    },
    files: {
      'dest/polyfills': ['src/polyfills'],
    },
  },
})
```

#### Both Tests and Modernizr
This example simply uses both explicit tests and your modernizr build to determine the set of tests to find polyfills for.

```js
grunt.initConfig({
  yepnope: {
    options: {
      tests: ['test2', 'test3'],
      modernizr: 'modernizr/modernizr-build.js'
    },
    files: {
      'dest/polyfills': ['src/polyfills'],
    },
  },
})
```