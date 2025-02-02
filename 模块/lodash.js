function baz() {
  return 88888;
}

function foo() {
  return 9999;
}

let re = require('jQuery.js');

exports.baz = baz();
exports.foo = foo();