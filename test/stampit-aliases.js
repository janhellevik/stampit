'use strict';
var stampit = require('../stampit'),
  test = require('tape');

// extend, mixIn, mixin, assign

test('stampit.mixin aliases', function (t) {
  t.ok(stampit.mixin);
  t.equal(stampit.mixin, stampit.mixIn, 'stampit.mixin == stampit.mixIn');
  t.equal(stampit.mixin, stampit.extend, 'stampit.mixin == stampit.extend');
  t.equal(stampit.mixin, stampit.assign, 'stampit.mixin == stampit.assign');

  t.end();
});
