import fs from "fs";
import path from "path";
import parser from "@babel/parser"; //生成ast
import traverse from "@babel/traverse";
import ejs from "ejs"; //ejs 模板生成器

import { transformFromAst } from "babel-core";
// console.log(traverse);

import { jsonLoader } from "./jsonLoader.js";

let id = 0;

//相当于webpack.config.js
const webpackConfig = {
    module: {
        rules: [{
            test: /\.json$/,
            use: jsonLoader,
        }, ],
    },
};

function createAsset(filePath) {
    //1、获取文件的内容
    // ast  -->  抽象语法树

    let source = fs.readFileSync(filePath, {
        //"./example/main.js",
        encoding: "utf-8", //未加第二个参数之前打印buffer  加厚发音的是文件内容
    });
    // console.log(source); //buffer

    //2.loader转换   init loader
    const loaders = webpackConfig.module.rules;
    const loaderContext = {
        addDeps(dep) {
            console.log("addDeps", dep);
        },
    };

    loaders.forEach(({ test, use }) => {
        if (test.test(filePath)) {
            if (Array.isArray(use)) {
                use.forEach((fn) => {
                    source = fn.call(loaderContext, source);
                });
            } else {
                source = use.call(loaderContext, source);
            }
        }
        console.log(test, use);
    });

    //3、获取依赖关系
    const ast = parser.parse(source, {
        sourceType: "module",
    }); //生产ast 抽象语法树

    // console.log("ast--------------------");
    // console.log(ast);

    //2、获取依赖关系   ---> import

    const deps = [];
    traverse.default(ast, {
        //获取import 转化ast
        ImportDeclaration({ node }) {
            // console.log("DATA-------------");
            // console.log(data); //输出数据
            // console.log("NODE-------------");
            // console.log(data.node); //输出数据
            // console.log(node.source);
            deps.push(node.source.value);
        },
    });

    //esm转换成cjs
    const { code } = transformFromAst(ast, null, {
        presets: ["env"],
    });
    // console.log(code);
    return {
        filePath,
        // source, //文件内容
        code, // esm转为cjs后的文件内容
        deps, //依赖关系
        mapping: {},
        id: id++,
    };
}

// const asset = createAsset();
// console.log(asset);

//用得到的内容和依赖关系   绘制成图
function createGraph() {
    const mainAsset = createAsset("./example/main.js");
    //遍历图的方式
    const queue = [mainAsset];

    for (const asset of queue) {
        asset.deps.forEach((relativePath) => {
            // console.log(relativePath);
            // console.log(path.resolve("./example", relativePath));
            const childAsset = createAsset(path.resolve("./example", relativePath)); //递归查询其他
            // console.log(childAsset);
            asset.mapping[relativePath] = childAsset.id;
            queue.push(childAsset);
        });
    }

    return queue;
}

const graph = createGraph();

function build(graph) {
    const template = fs.readFileSync("./bundle.ejs", {
        encoding: "utf-8",
    });

    const data = graph.map((asset) => {
        return {
            id: asset.id,
            code: asset.code,
            mapping: asset.mapping,
        };
    });

    const code = ejs.render(template, { data }); //根据模板生成代码
    fs.writeFileSync("./dist/bundle.js", code); // 生成文件
    // console.log(code);
}

console.log(graph);
build(graph);