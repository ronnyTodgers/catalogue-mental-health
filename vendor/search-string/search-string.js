(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.stringSearch = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToTree = stringToTree;
exports.reduce = reduce;
exports.parse = parse;
exports.stringify = stringify;
exports.simplify = simplify;

var _query = require('../grammar/query');

var _query2 = _interopRequireDefault(_query);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToTree(query) {
  if (typeof query !== 'string') {
    throw new Error('Query must be a string');
  }
  return _query2.default.parse(query, { types: _types2.default });
}

function reduce(tree) {
  if (!tree || typeof tree.reduce !== 'function') {
    throw new Error('Tree must be a parsed AST');
  }
  return tree.reduce();
}

function parse(query) {
  if (typeof query !== 'string') {
    throw new Error('Query must be a string');
  }
  return reduce(stringToTree(query));
}

function stringify(parsed) {
  return _types2.default.Value.stringify(parsed);
}

function simplify(parsed) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return _types2.default.Value.simplify(parsed, opts);
}
},{"../grammar/query":3,"./types":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function() {
  'use strict';

  var extend = function (destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

  var formatError = function (input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }
    var message = 'Line ' + lineNo + ': expected ' + expected.join(', ') + '\n',
        line = lines[lineNo - 1];

    message += line + '\n';
    position -= line.length + 1;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  };

  var inherit = function (subclass, parent) {
    var chain = function() {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  };

  var TreeNode = function(text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements || [];
  };

  TreeNode.prototype.forEach = function(block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  var TreeNode1 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[1];
    this['query'] = elements[1];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[0];
    this['operator'] = elements[0];
  };
  inherit(TreeNode2, TreeNode);

  var TreeNode3 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[1];
    this['base'] = elements[1];
  };
  inherit(TreeNode3, TreeNode);

  var TreeNode4 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[1];
  };
  inherit(TreeNode4, TreeNode);

  var TreeNode5 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[0];
    this['orable'] = elements[0];
    this['or_groups'] = elements[1];
  };
  inherit(TreeNode5, TreeNode);

  var TreeNode6 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['or_sep'] = elements[0];
    this['value'] = elements[1];
    this['orable'] = elements[1];
  };
  inherit(TreeNode6, TreeNode);

  var TreeNode7 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[1];
    this['base'] = elements[1];
  };
  inherit(TreeNode7, TreeNode);

  var TreeNode8 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['root'] = elements[1];
  };
  inherit(TreeNode8, TreeNode);

  var TreeNode9 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['k'] = elements[0];
    this['slug'] = elements[0];
    this['sep'] = elements[1];
    this['v'] = elements[2];
    this['word'] = elements[2];
  };
  inherit(TreeNode9, TreeNode);

  var TreeNode10 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['sep'] = elements[1];
    this['list_name'] = elements[2];
  };
  inherit(TreeNode10, TreeNode);

  var TreeNode11 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['value'] = elements[1];
  };
  inherit(TreeNode11, TreeNode);

  var TreeNode12 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tag'] = elements[1];
  };
  inherit(TreeNode12, TreeNode);

  var TreeNode13 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['tag'] = elements[1];
  };
  inherit(TreeNode13, TreeNode);

  var TreeNode14 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['screen_name'] = elements[1];
  };
  inherit(TreeNode14, TreeNode);

  var TreeNode15 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['screen_name'] = elements[0];
    this['list_slug'] = elements[2];
  };
  inherit(TreeNode15, TreeNode);

  var TreeNode16 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['slug'] = elements[1];
  };
  inherit(TreeNode16, TreeNode);

  var TreeNode17 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['d'] = elements[9];
  };
  inherit(TreeNode17, TreeNode);

  var TreeNode18 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['d'] = elements[0];
  };
  inherit(TreeNode18, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_root: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._root = this._cache._root || {};
      var cached = this._cache._root[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var remaining0 = 0, index2 = this._offset, elements1 = [], address2 = true;
      while (address2 !== FAILURE) {
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements1.push(address2);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
        this._offset = this._offset;
      } else {
        address1 = FAILURE;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address3 = FAILURE;
        address3 = this._read_query();
        if (address3 !== FAILURE) {
          elements0[1] = address3;
          var address4 = FAILURE;
          var remaining1 = 0, index3 = this._offset, elements2 = [], address5 = true;
          while (address5 !== FAILURE) {
            address5 = this._read___();
            if (address5 !== FAILURE) {
              elements2.push(address5);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address4 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          } else {
            address4 = FAILURE;
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode1(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Value);
      this._cache._root[index0] = [address0, this._offset];
      return address0;
    },

    _read_query: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._query = this._cache._query || {};
      var cached = this._cache._query[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var index2 = this._offset, elements1 = new Array(2);
        var address2 = FAILURE;
        address2 = this._read_operator();
        if (address2 !== FAILURE) {
          elements1[0] = address2;
          var address3 = FAILURE;
          var remaining1 = 0, index3 = this._offset, elements2 = [], address4 = true;
          while (address4 !== FAILURE) {
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements2.push(address4);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address3 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements1[1] = address3;
          } else {
            elements1 = null;
            this._offset = index2;
          }
        } else {
          elements1 = null;
          this._offset = index2;
        }
        if (elements1 === null) {
          address1 = FAILURE;
        } else {
          address1 = new TreeNode2(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      extend(address0, this._types.And);
      this._cache._query[index0] = [address0, this._offset];
      return address0;
    },

    _read_operator: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._operator = this._cache._operator || {};
      var cached = this._cache._operator[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_excluding();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_including();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._operator[index0] = [address0, this._offset];
      return address0;
    },

    _read_excluding: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._excluding = this._cache._excluding || {};
      var cached = this._cache._excluding[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '-') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"-"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_base();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode3(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Excluding);
      this._cache._excluding[index0] = [address0, this._offset];
      return address0;
    },

    _read_including: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._including = this._cache._including || {};
      var cached = this._cache._including[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 0);
      }
      if (chunk0 === '') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 0), this._offset);
        this._offset = this._offset + 0;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('""');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index2 = this._offset;
        address2 = this._read_or();
        if (address2 === FAILURE) {
          this._offset = index2;
          address2 = this._read_base();
          if (address2 === FAILURE) {
            this._offset = index2;
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode4(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Including);
      this._cache._including[index0] = [address0, this._offset];
      return address0;
    },

    _read_or: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._or = this._cache._or || {};
      var cached = this._cache._or[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read_orable();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_or_groups();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode5(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Or);
      this._cache._or[index0] = [address0, this._offset];
      return address0;
    },

    _read_or_groups: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._or_groups = this._cache._or_groups || {};
      var cached = this._cache._or_groups[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var index2 = this._offset, elements1 = new Array(2);
        var address2 = FAILURE;
        address2 = this._read_or_sep();
        if (address2 !== FAILURE) {
          elements1[0] = address2;
          var address3 = FAILURE;
          address3 = this._read_orable();
          if (address3 !== FAILURE) {
            elements1[1] = address3;
          } else {
            elements1 = null;
            this._offset = index2;
          }
        } else {
          elements1 = null;
          this._offset = index2;
        }
        if (elements1 === null) {
          address1 = FAILURE;
        } else {
          address1 = new TreeNode6(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      extend(address0, this._types.Values);
      this._cache._or_groups[index0] = [address0, this._offset];
      return address0;
    },

    _read_orable: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._orable = this._cache._orable || {};
      var cached = this._cache._orable[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 0);
      }
      if (chunk0 === '') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 0), this._offset);
        this._offset = this._offset + 0;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('""');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_base();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode7(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Including);
      this._cache._orable[index0] = [address0, this._offset];
      return address0;
    },

    _read_base: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._base = this._cache._base || {};
      var cached = this._cache._base[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_group();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_list();
        if (address0 === FAILURE) {
          this._offset = index1;
          address0 = this._read_pair();
          if (address0 === FAILURE) {
            this._offset = index1;
            address0 = this._read_exact();
            if (address0 === FAILURE) {
              this._offset = index1;
              address0 = this._read_hashtag();
              if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_mention();
                if (address0 === FAILURE) {
                  this._offset = index1;
                  address0 = this._read_word();
                  if (address0 === FAILURE) {
                    this._offset = index1;
                  }
                }
              }
            }
          }
        }
      }
      this._cache._base[index0] = [address0, this._offset];
      return address0;
    },

    _read_group: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._group = this._cache._group || {};
      var cached = this._cache._group[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_root();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 === ')') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode8(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Group);
      this._cache._group[index0] = [address0, this._offset];
      return address0;
    },

    _read_pair: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._pair = this._cache._pair || {};
      var cached = this._cache._pair[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      address1 = this._read_slug();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_sep();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_word();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode9(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Pair);
      this._cache._pair[index0] = [address0, this._offset];
      return address0;
    },

    _read_list: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._list = this._cache._list || {};
      var cached = this._cache._list[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 === 'list') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"list"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_sep();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_list_name();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode10(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.List);
      this._cache._list[index0] = [address0, this._offset];
      return address0;
    },

    _read_exact: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._exact = this._cache._exact || {};
      var cached = this._cache._exact[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '"') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('\'"\'');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[^\"]/.test(chunk1)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[^\\"]');
            }
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === '"') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('\'"\'');
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode11(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Exactly);
      this._cache._exact[index0] = [address0, this._offset];
      return address0;
    },

    _read_hashtag: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._hashtag = this._cache._hashtag || {};
      var cached = this._cache._hashtag[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '#') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"#"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_tag();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode12(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Text);
      this._cache._hashtag[index0] = [address0, this._offset];
      return address0;
    },

    _read_cashtag: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._cashtag = this._cache._cashtag || {};
      var cached = this._cache._cashtag[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '$') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"$"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_tag();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode13(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Text);
      this._cache._cashtag[index0] = [address0, this._offset];
      return address0;
    },

    _read_mention: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._mention = this._cache._mention || {};
      var cached = this._cache._mention[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 0);
      }
      if (chunk0 === '') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 0), this._offset);
        this._offset = this._offset + 0;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('""');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_screen_name();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode14(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Text);
      this._cache._mention[index0] = [address0, this._offset];
      return address0;
    },

    _read_word: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._word = this._cache._word || {};
      var cached = this._cache._word[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var index2 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '+') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"+"');
        }
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 1, index3 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[^\s\)\(]/.test(chunk1)) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[^\\s\\)\\(]');
            }
          }
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index3, this._offset), index3, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      extend(address0, this._types.Text);
      this._cache._word[index0] = [address0, this._offset];
      return address0;
    },

    _read_or_sep: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._or_sep = this._cache._or_sep || {};
      var cached = this._cache._or_sep[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var remaining0 = 1, index2 = this._offset, elements1 = [], address2 = true;
      while (address2 !== FAILURE) {
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements1.push(address2);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
        this._offset = this._offset;
      } else {
        address1 = FAILURE;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address3 = FAILURE;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 2);
        }
        if (chunk0 === 'OR') {
          address3 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
          this._offset = this._offset + 2;
        } else {
          address3 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"OR"');
          }
        }
        if (address3 !== FAILURE) {
          elements0[1] = address3;
          var address4 = FAILURE;
          var remaining1 = 1, index3 = this._offset, elements2 = [], address5 = true;
          while (address5 !== FAILURE) {
            address5 = this._read___();
            if (address5 !== FAILURE) {
              elements2.push(address5);
              --remaining1;
            }
          }
          if (remaining1 <= 0) {
            address4 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
            this._offset = this._offset;
          } else {
            address4 = FAILURE;
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._or_sep[index0] = [address0, this._offset];
      return address0;
    },

    _read_list_name: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._list_name = this._cache._list_name || {};
      var cached = this._cache._list_name[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      address1 = this._read_screen_name();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 === '/') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"/"');
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_list_slug();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode15(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._list_name[index0] = [address0, this._offset];
      return address0;
    },

    _read_list_slug: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._list_slug = this._cache._list_slug || {};
      var cached = this._cache._list_slug[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 !== null && /^[a-z-]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[a-z-]');
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._list_slug[index0] = [address0, this._offset];
      return address0;
    },

    _read_screen_name: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._screen_name = this._cache._screen_name || {};
      var cached = this._cache._screen_name[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var index2 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '@') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"@"');
        }
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_slug();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode16(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._screen_name[index0] = [address0, this._offset];
      return address0;
    },

    _read_date: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._date = this._cache._date || {};
      var cached = this._cache._date[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(10);
      var address1 = FAILURE;
      address1 = this._read_d();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_d();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_d();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read_d();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var chunk0 = null;
              if (this._offset < this._inputSize) {
                chunk0 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk0 === '-') {
                address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
              } else {
                address5 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"-"');
                }
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address6 = FAILURE;
                address6 = this._read_d();
                if (address6 !== FAILURE) {
                  elements0[5] = address6;
                  var address7 = FAILURE;
                  address7 = this._read_d();
                  if (address7 !== FAILURE) {
                    elements0[6] = address7;
                    var address8 = FAILURE;
                    var chunk1 = null;
                    if (this._offset < this._inputSize) {
                      chunk1 = this._input.substring(this._offset, this._offset + 1);
                    }
                    if (chunk1 === '-') {
                      address8 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                      this._offset = this._offset + 1;
                    } else {
                      address8 = FAILURE;
                      if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                      }
                      if (this._offset === this._failure) {
                        this._expected.push('"-"');
                      }
                    }
                    if (address8 !== FAILURE) {
                      elements0[7] = address8;
                      var address9 = FAILURE;
                      address9 = this._read_d();
                      if (address9 !== FAILURE) {
                        elements0[8] = address9;
                        var address10 = FAILURE;
                        address10 = this._read_d();
                        if (address10 !== FAILURE) {
                          elements0[9] = address10;
                        } else {
                          elements0 = null;
                          this._offset = index1;
                        }
                      } else {
                        elements0 = null;
                        this._offset = index1;
                      }
                    } else {
                      elements0 = null;
                      this._offset = index1;
                    }
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode17(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._date[index0] = [address0, this._offset];
      return address0;
    },

    _read_tag: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._tag = this._cache._tag || {};
      var cached = this._cache._tag[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      address0 = this._read_slug();
      this._cache._tag[index0] = [address0, this._offset];
      return address0;
    },

    _read_slug: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._slug = this._cache._slug || {};
      var cached = this._cache._slug[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 !== null && /^[a-zA-Z0-9_]/.test(chunk0)) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('[a-zA-Z0-9_]');
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._slug[index0] = [address0, this._offset];
      return address0;
    },

    _read_sep: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._sep = this._cache._sep || {};
      var cached = this._cache._sep[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === ':') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('":"');
        }
      }
      this._cache._sep[index0] = [address0, this._offset];
      return address0;
    },

    _read_integer: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._integer = this._cache._integer || {};
      var cached = this._cache._integer[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read_d();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          address3 = this._read_d();
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode18(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._integer[index0] = [address0, this._offset];
      return address0;
    },

    _read_d: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._d = this._cache._d || {};
      var cached = this._cache._d[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[0-9]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[0-9]');
        }
      }
      this._cache._d[index0] = [address0, this._offset];
      return address0;
    },

    _read___: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache.___ = this._cache.___ || {};
      var cached = this._cache.___[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[\s]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[\\s]');
        }
      }
      this._cache.___[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_root();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push('<EOF>');
    }
    this.constructor.lastError = {offset: this._offset, expected: this._expected};
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  var parse = function(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  };
  extend(Parser.prototype, Grammar);

  var exported = {Grammar: Grammar, Parser: Parser, parse: parse};

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.Query = exported;
  }
})();

},{}]},{},[1])(1)
});
