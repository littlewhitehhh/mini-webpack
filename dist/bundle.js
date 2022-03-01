(function(map) { function require(id) { const [fn, mapping] = map[id]; const module = { exports: {} }; function localRequire(filePath) { const id = mapping[filePath]; return require(id); } fn(localRequire, module, module.exports); return module.exports;
} require(0); })({




    0:[function(require, module, exports){
        "use strict";

var _foo = require("./foo.js");

var _foo2 = _interopRequireDefault(_foo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _foo2.default)();
console.log("main.js");
            },
            {"./foo.js":1}],
                


    1:[function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = foo;

var _bar = require("./bar.js");

var _bar2 = _interopRequireDefault(_bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {
  console.log("foo.js");
}
            },
            {"./bar.js":2}],
                


    2:[function(require, module, exports){
        "use strict";

console.log("bar.js");
            },
            {}],
                
                    });