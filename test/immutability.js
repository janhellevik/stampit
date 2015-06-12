'use strict';
var stampit = require('../stampit'),
  test = require('tape');

// Immutability

test('Basic stamp immutability', function (t) {
  var methods = { f: function F1() {} };
  var refs = { s: { deep: 1 } };
  var props = { p: { deep: 1 } };
  var stamp1 = stampit({ methods: methods, refs: refs, props: props });

  methods.f = function F2() {};
  refs.s.deep = 2;
  props.p.deep = 2;
  var stamp2 = stampit({ methods: methods, refs: refs, props: props });

  t.notEqual(stamp1.fixed.methods, stamp2.fixed.methods, 'stamp.fixed.methods should be deep cloned');
  t.notEqual(stamp1.fixed.methods.f, stamp2.fixed.methods.f, 'stamp.fixed.methods should be deep cloned without modifying source object');
  t.notEqual(stamp1.fixed.refs, stamp2.fixed.refs, 'stamp.fixed.refs should not be assigned by reference (properties of it should be)');
  t.equal(stamp1.fixed.refs.s, stamp2.fixed.refs.s, 'properties of stamp.fixed.refs should be assigned by reference and merged recursively modifying source object');
  t.notEqual(stamp1.fixed.props, stamp2.fixed.props, 'stamp.fixed.props should be deep cloned');
  t.notEqual(stamp1.fixed.props.p, stamp2.fixed.props.p, 'stamp.fixed.props should be deep cloned recursively');
  t.notEqual(stamp1.fixed.props.p.deep, stamp2.fixed.props.p.deep, 'stamp.fixed.props should be deep cloned recursively');
  t.notEqual(stamp1.fixed.init, stamp2.fixed.init, 'stamp.fixed.init should be deep cloned');

  t.end();
});

test('Stamp immutability made of same source', function (t) {
  var methods = { f: function F1() {} };
  var refs = { s: { deep: 1 } };
  var props = { p: { deep: 1 } };
  var stamp1 = stampit({ methods: methods, refs: refs, props: props });
  var stamp2 = stampit({ methods: methods, refs: refs, props: props });

  var f1 = stamp1.fixed;
  var f2 = stamp2.fixed;

  t.notEqual(f1.methods, f2.methods, 'stamp.fixed.methods should be deep cloned');
  t.notEqual(f1.refs, f2.refs, 'stamp.fixed.refs should not be assigned by reference (properties of it should be)');
  t.equal(f1.refs.s, f2.refs.s, 'properties of stamp.fixed.refs should be assigned by reference and merged recursively');
  t.notEqual(f1.props, f2.props, 'stamp.fixed.props should be deep cloned');
  t.notEqual(f1.props.p, f2.props.p, 'stamp.fixed.props should be deep cloned recursively');
  t.notEqual(f1.init, f2.init, 'stamp.fixed.init should be deep cloned');

  t.end();
});

test('Basic object immutability', function (t) {
  var methods = { f: function F1() {} };
  var refs = { s: { deep: 1 } };
  var props = { p: { deep: 1 } };
  var o1 = stampit({ methods: methods, refs: refs, props: props })();

  methods.f = function F2() {};
  refs.s.deep = 2;
  props.p.deep = 2;
  var o2 = stampit({ methods: methods, refs: refs, props: props })();

  t.notEqual(o1, o2, 'instances created by stamps should be unique instances');
  t.notEqual(o1.f, o2.f, 'instance methods should be deep cloned');
  t.equal(o1.s, o2.s, 'instance refs should be assigned by reference');
  t.equal(o1.s.deep, o2.s.deep, 'refs of instance should be assigned by reference and merged recursively modifying source object');
  t.notEqual(o1.p, o2.p, 'instance props should be deep cloned');
  t.notEqual(o1.p.deep, o2.p.deep, 'instance props should be deep cloned recursively');

  t.end();
});

test('Stamp chaining functions immutability', function (t) {
  var stamp1 = stampit();
  var stamp2 = stamp1.methods({ f: function F1() {} });
  var stamp3 = stamp2.refs( { s: { deep: 1 } });
  var stamp4 = stamp3.init(function () { });
  var stamp5 = stamp2.props( { p: { deep: 1 } });
  var stamp6 = stamp4.compose(stampit());

  t.notEqual(stamp1, stamp2, 'stamp.methods() should return a new stamp');
  t.notEqual(stamp2, stamp3, 'stamp.refs() should return a new stamp');
  t.notEqual(stamp3, stamp4, 'stamp.init() should return a new stamp');
  t.notEqual(stamp4, stamp5, 'stamp.props() should return a new stamp');
  t.notEqual(stamp5, stamp6, 'stamp.compose() should return a new stamp');

  t.end();
});
