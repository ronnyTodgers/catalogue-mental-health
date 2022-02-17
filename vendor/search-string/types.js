(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function contains(arr, v) {
  return arr.some(function (w) {
    return v === w;
  });
}

var types = {
  Value: {
    reduce: function reduce() {
      return this.value.reduce();
    },
    stringify: function stringify(value) {
      var _value = _slicedToArray(value, 1);

      var type = _value[0];

      return types[type].stringify(value);
    },
    simplify: function simplify(parsed, opts) {
      var _opts$disallow = opts.disallow;
      var disallow = _opts$disallow === undefined ? [] : _opts$disallow;

      var _parsed = _slicedToArray(parsed, 1);

      var type = _parsed[0];

      if (contains(disallow, type)) {
        return ['Text', types.Value.stringify(parsed)];
      }
      if (typeof types[type].simplify === 'function') {
        return [type, types[type].simplify(parsed, opts)];
      }
      return parsed;
    }
  },
  Text: {
    reduce: function reduce() {
      return ['Text', this.text];
    },
    stringify: function stringify(_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var v = _ref2[1];

      return v;
    }
  },
  Values: {
    reduce: function reduce() {
      return this.elements.map(function (elem) {
        return types.Value.reduce.call(elem);
      });
    },
    stringify: function stringify(values) {
      return values.map(function (value) {
        return types.Value.stringify(value);
      }).join(' ');
    },
    simplify: function simplify(values, opts) {
      return values.map(function (value) {
        return types.Value.simplify(value, opts);
      });
    }
  },
  Pair: {
    reduce: function reduce() {
      return ['Pair', this.k.text.toLowerCase(), this.v.text];
    },
    stringify: function stringify(_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3);

      var k = _ref4[1];
      var v = _ref4[2];

      return k + ':' + v;
    }
  },
  Group: {
    reduce: function reduce() {
      return ['Group', this.root.reduce()];
    },
    stringify: function stringify(_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2);

      var v = _ref6[1];

      return '(' + types.Value.stringify(v) + ')';
    }
  },
  And: {
    reduce: function reduce() {
      return ['And', types.Values.reduce.call(this)];
    },
    stringify: function stringify(_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2);

      var values = _ref8[1];

      return types.Values.stringify(values);
    },
    simplify: function simplify(_ref9, opts) {
      var _ref10 = _slicedToArray(_ref9, 2);

      var values = _ref10[1];

      return types.Values.simplify(values, opts);
    }
  },
  Or: {
    reduce: function reduce() {
      return ['Or', [this.value.reduce()].concat(this.or_groups.reduce())];
    },
    stringify: function stringify(_ref11) {
      var _ref12 = _slicedToArray(_ref11, 2);

      var values = _ref12[1];

      return values.map(function (value) {
        return types.Value.stringify(value);
      }).join(' OR ');
    },
    simplify: function simplify(_ref13, opts) {
      var _ref14 = _slicedToArray(_ref13, 2);

      var values = _ref14[1];

      return types.Values.simplify(values, opts);
    }
  },
  Exactly: {
    reduce: function reduce() {
      return ['Exactly', this.value.text];
    },
    stringify: function stringify(_ref15) {
      var _ref16 = _slicedToArray(_ref15, 2);

      var value = _ref16[1];

      return '"' + value + '"';
    }
  },
  Including: {
    reduce: function reduce() {
      return ['Including', this.value.reduce()];
    },
    stringify: function stringify(_ref17) {
      var _ref18 = _slicedToArray(_ref17, 2);

      var v = _ref18[1];

      return types.Value.stringify(v);
    },
    simplify: function simplify(_ref19, opts) {
      var _ref20 = _slicedToArray(_ref19, 2);

      var v = _ref20[1];

      return types.Value.simplify(v, opts);
    }
  },
  Excluding: {
    reduce: function reduce() {
      return ['Excluding', this.value.reduce()];
    },
    stringify: function stringify(_ref21) {
      var _ref22 = _slicedToArray(_ref21, 2);

      var v = _ref22[1];

      return '-' + types.Value.stringify(v);
    },
    simplify: function simplify(_ref23, opts) {
      var _ref24 = _slicedToArray(_ref23, 2);

      var v = _ref24[1];

      return types.Value.simplify(v, opts);
    }
  },
  List: {
    reduce: function reduce() {
      return ['List', this.list_name.screen_name.text, this.list_name.list_slug.text];
    },
    stringify: function stringify(_ref25) {
      var _ref26 = _slicedToArray(_ref25, 3);

      var screenName = _ref26[1];
      var slug = _ref26[2];

      return 'list:' + screenName + '/' + slug;
    }
  }
};

exports.default = types;
},{}]},{},[1]);
