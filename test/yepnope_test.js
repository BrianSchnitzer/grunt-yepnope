/*jshint node:true*/

'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.yepnope = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  noTests: function (test) {
    test.expect(1);

    test.ok(!grunt.file.exists('test/tmp/polyfills1'), 'should not create any files/dirs');
    test.done();
  },
  basicTests: function (test) {
    test.expect(4);

    test.ok(grunt.file.exists('test/tmp/polyfills2/test1.js'), 'should create test1.js');
    test.ok(grunt.file.exists('test/tmp/polyfills2/test3.js'), 'should create test3.js');
    test.ok(grunt.file.exists('test/tmp/polyfills2/test1-test3.js'), 'should create test1-test3.js');

    var actual = grunt.file.read('test/tmp/polyfills2/test1-test3.js');
    var expected = grunt.file.read('test/expected/basicTests-test1-test3.js');
    test.equal(actual, expected, 'should concat test1 and test3');

    test.done();
  },
  basicModernizer: function (test) {
    test.expect(2);

    test.ok(grunt.file.exists('test/tmp/polyfills3/test1.js'), 'should create test1.js');
    test.ok(!grunt.file.exists('test/tmp/polyfills3/test2.js'), 'should not create test2.js');

    test.done();
  },
  twoTestsTwoDests: function (test) {
    test.expect(4);

    test.ok(grunt.file.exists('test/tmp/polyfills4a/test1.js'), 'should create test1.js in this dest');
    test.ok(!grunt.file.exists('test/tmp/polyfills4a/test3.js'), 'should not create test3.js in this dest');

    test.ok(!grunt.file.exists('test/tmp/polyfills4b/test1.js'), 'should not create test1.js in this dest');
    test.ok(grunt.file.exists('test/tmp/polyfills4b/test3.js'), 'should create test3.js in this dest');

    test.done();
  },
  noPolyfillTestPairs: function (test) {
    test.expect(1);

    test.ok(!grunt.file.exists('test/tmp/polyfills5'), 'should not create any files/dirs');
    test.done();
  }
};
