# Case-SvgAnnotator.js

结构化标注工具jQuery插件。

[![license](https://img.shields.io/github/license/felixhpp/Case-SvgAnnotator.svg)](https://github.com/felixhpp/Case-SvgAnnotator/blob/master/LICENSE)
[![version](https://img.shields.io/badge/npm%20version-1.2.1-brightgreen.svg)](https://www.npmjs.com/package/case-annotator)
[![GitHub release](https://img.shields.io/github/release/felixhpp/Case-SvgAnnotator.svg)](https://github.com/felixhpp/Case-SvgAnnotator/releases)

## 声明

本项目是作者学习之用，是对开源项目[poplar](https://github.com/synyi/poplar)的一个jQuery插件版本，方便在普通的js中调用，并优化了插件在谷歌浏览器的兼容性问题。如果您的开发环境为node，建议去看[poplar](https://github.com/synyi/poplar)。

在此特别感谢@[synyi](https://github.com/synyi)的开源项目[poplar](https://github.com/synyi/poplar)。

## 使用方法

### 直接下载js文件引用

直接从[dist](https://github.com/felixhpp/Case-SvgAnnotator/tree/master/dist)目录中获取js文件;

```
 <script src="jquery-1.11.1.js"></script>
 <script src="jquery.annotator.js"></script>
 <script>
    var svgAnnotator = $.SvgAnnotator(document.getElementById("div"), "这是一段文本或者一个对象", {});
 </script>
 
```

### 从源码编译本项目

```
npm install

gult

```

### API
请查看[API](https://github.com/felixhpp/Case-SvgAnnotator/blob/master/doc/api.md)

