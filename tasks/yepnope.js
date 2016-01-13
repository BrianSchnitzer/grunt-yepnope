/*jshint node:true*/

'use strict';

var _ = require('lodash');

module.exports = function (grunt) {

  grunt.registerMultiTask('yepnope', 'Integrate yepnope into a grunt task.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      tests: [],
      modernizr: ''
    });

    if (_.isEmpty(options.tests) && !options.modernizr) {
      grunt.log.writeln('No tests or modernizr path was given... exiting.');
      return;
    }

    //If a modernizr build file was given, search it for tests
    if (options.modernizr) {
      if (grunt.file.exists(options.modernizr)) {
        //Search for all tests within the file, extract their names
        var modernizrTestRegex = /^(?!\*)\s*Modernizr\.addTest\('([\w\d]+)',/gm;
        var modernizrFile = grunt.file.read(options.modernizr);
        var matchedTests = [];
        var matchedDirtyTests = modernizrTestRegex.exec(modernizrFile);
        while (matchedDirtyTests) {
          matchedTests.push(matchedDirtyTests[1]);
          matchedDirtyTests = modernizrTestRegex.exec(modernizrFile);
        }
        options.tests = options.tests.concat(matchedTests);
      } else {
        grunt.log.writeln('No modernizer build found at: ' + options.modernizr);
        if (_.isEmpty(options.tests)) {
          grunt.log.writeln('No tests given... exiting.');
          return;
        }
      }
    }

    var permutationCount = 0;
    var allPermutations = [];
    var groupPermutations;

    //Loop through the files
    this.files.forEach(function (file) {
      //Groups of files will be maintained based on dest.
      //This allows for multiple yepnope asynchronous polyfills.
      var fileGroup = {files: []};
      fileGroup.dest = file.dest;

      //Loop through all src files within a file group.
      //Organize them so that they can be iterated over and a power set can be created.
      _.forEach(file.src, function (src) {
        var fileName = src.toString().match(/\/([^/]*)$/)[1];
        var fileParts = fileName.split('.');
        fileParts.pop();
        var testName = fileParts.join('.');

        //If the src file has a matching test, include it.
        if (options.tests.indexOf(testName) > -1) {
          fileGroup.files.push({name: testName, src: src});
        }
      });

      //Make sure this group of src files has at least one polyfill/test pair.
      //If so, begin permutation generation process.
      if (_.isEmpty(fileGroup.files)) {
        grunt.log.writeln('No polyfills found for given test(s) for dest: ' + fileGroup.dest);
      } else {
        groupPermutations = [];
        makePolyfills([], fileGroup.files.slice());
        allPermutations.push({permutations: groupPermutations, dest: fileGroup.dest});
      }
    });

    grunt.log.writeln('Total polyfill permutations generated: ' + permutationCount);

    //Loop through all of the final permutations, concatenate the necessary files, and write them
    //to their corresponding destination.
    _.forEach(allPermutations, function (permutationGroup) {
      var destDir = permutationGroup.dest;
      _.forEach(permutationGroup.permutations, function (permutation) {
        var concatenatedFile = _.map(permutation.srcArray, function (src) {
          return grunt.file.read(src);
        }).join(grunt.util.normalizelf(''));
        var destPath = destDir + '/' + permutation.compiledName;
        grunt.file.write(destPath, concatenatedFile);
      });

    });

    //This function recursively makes a power set (minus the empty set) of all of the
    //polyfill combinations required.  This will result in 2^n - 1 number of files, n being
    //the number of detected tests matched to available polyfills.  Example:
    //Polyfills: test1.polyfill.js, test2.polyfill.js, test3.polyfill.js
    //Detected feature tests: test1, test3
    //Resulting polyfill combinations: test1-polyfill.js, test3-polyfill.js, test1-test3-polyfill.js
    function makePolyfills(active, remaining) {
      if (remaining.length === 0) {
        if (!_.isEmpty(active)) {
          permutationCount++;
          groupPermutations.push(polyfillConcatInfo(active));
        }
      } else {
        var nextActive = remaining[0];
        remaining.splice(0, 1);
        makePolyfills(active.slice(), remaining.slice());
        active.push(nextActive);
        makePolyfills(active.slice(), remaining.slice());
      }
    }

    //This function compiles the information from the polyfill permutations
    //and organizes them into a state usable by grunt-contrib-concat
    function polyfillConcatInfo(polyfillGroup) {
      var permutationInfo = {};
      var sortedByName = _.sortBy(polyfillGroup, 'name');
      permutationInfo.compiledName = _.pluck(sortedByName, 'name').join('-') + '.js';
      permutationInfo.srcArray = _.map(sortedByName, function (permutation) {
        return permutation.src;
      });
      return permutationInfo;
    }

  });

};


