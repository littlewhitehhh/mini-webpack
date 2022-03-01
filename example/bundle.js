//直接放在一个文件会出现命名冲突    -->函数解决

//esm 规范    import 语法写在最顶层   所以用cjs代替
//立即执行函数
(function(map) {
    //实现require
    function require(id) {
        // const map = {
        //     "./foo.js": foojs,
        //     "./main.js": mainjs,
        //     "./bar.js": barjs,
        // };

        const [fn, mapping] = map[id];

        const module = {
            exports: {},
        };

        function localRequire(filePath) {
            const id = mapping[filePath];
            return require(id);
        }
        fn(localRequire, module, module.exports);

        return module.exports;
    }

    require(1);
    //main.js
    // function mainjs(require, module, exports) {
    //     // import foo from "./foo.js";
    //     // esm ==> cjs
    //     const { foo } = require("./foo.js");
    //     foo();

    //     console.log("main.js");
    // }

    //foo.js

    // function foojs(require, module, exports) {
    //     // import bar from "./bar.js";
    //     const bar = require("./bar.js");
    //     // export default function foo() {
    //     function foo() {
    //         console.log("foo.js");
    //     }
    //     module.exports = {
    //         foo,
    //     };
    // }

    //bar.js

    // function barjs(require, module, exports) {
    //     console.log("bar.js");
    // }
})({
    2: [
        //foojs
        function(require, module, exports) {
            // import bar from "./bar.js";
            const bar = require("./bar.js");
            // export default function foo() {
            function foo() {
                console.log("foo.js");
            }
            module.exports = {
                foo,
            };
        },
        { "./bar.js": 3 },
    ],
    1: [
        //mianjs
        function(require, module, exports) {
            const { foo } = require("./foo.js");
            foo();

            console.log("main.js");
        },
        { "./foo.js": 2 },
    ],
    3: [
        // barjs
        function(require, module, exports) {
            console.log("bar.js");
        },
        {},
    ],
});

//map是变更数据