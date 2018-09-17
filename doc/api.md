# Reference API 

## HTML

### Root Element

Case-SvgAnnotator可以绑定到任何一个空HTML元素上。

我们推荐绑定到`div`元素上。

#### Example

```html
<div id="example"></div>
```

## JavaScript

### 创建

为了使用Case-SvgAnnotator插件，我们需要在html中引用jquery.js和Case-SvgAnnotator.js：

```HTML
 <script src="jquery-1.11.1.js"></script>
 <script src="Case-SvgAnnotator.js"></script>
 <script>
    var svgAnnotator = $.SvgAnnotator(document.getElementById("example"), data, options);
 </script>
```

### data

在data为JSON时，格式如下：

![JSON格式](https://github.com/felixhpp/Case-SvgAnnotator/blob/master/doc/images/json-style.png)

在data为纯文本时，相当于`content`为文本内容，其他为`[]`的JSON。
注意`content`中的全角空格`\u3000`和多个连续空格都会被替换为单个空格。
 `Label`等的坐标系统按照替换后的计算。

构造后，对应元素内应该就会显示出对应的SVG图片。

### options

`options`是一个`object`对象，选项通常作为参数传递给init或attach动作。

```
var options = {
            maxLineWidth: 80,
            textSelected: function (startIndex, endIndex) {

            },
            labelClicked: function (id) {

            },
            twoLabelsClicked: function (first, second) {

            },
            labelRightClicked: function (id, x, y) {
		
            },
            connectionRightClicked: function (id, x, y) {
	
            }
        }


```

#### maxLineWidth
最大行宽，在一行中的字符数超过此数值后会进行折行。
默认值为：80

#### textSelected(startIndex,endIndex)
文本选中后的回调函数

| 参数       | 意义               |
| ---------- | ------------------ |
| startIndex | 选取部分的开始坐标 |
| endIndex   | 选取部分的结束坐标 |

#### labelClicked(id)
左键点击了一个Label后会触发事件回调函数

| 参数 | 意义             |
| ---- | ---------------- |
| id   | 被点击的标注的id |

#### twoLabelsClicked(first, second)
用户先后左键点击了两个Label后事件回调函数

| 参数   | 意义                 |
| ------ | -------------------- |
| first  | 第一个点击的标注的id |
| second | 第二个点击的标注的id |

#### labelRightClicked(id, x, y)
用户右键点击了一个Label后回调函数

| 参数 | 意义              |
| ---- | ----------------- |
| id   | 被点击的标注的id  |
| x    | 被点击时鼠标的X值 |
| y    | 被点击时鼠标的Y值 |

#### connectionRightClicked(id, x, y)
用户右键点击了一个连接的文字部分后事件回调函数

| 参数 | 意义              |
| ---- | ----------------- |
| id   | 被点击的连接的id  |
| x    | 被点击时鼠标的X值 |
| y    | 被点击时鼠标的Y值 |

### Methods

插件对原始方法进行了封装，方便在js中调用，调用方式：`svgAnnotator.MethodName(参数)`

#### createLabel (categoryId, startIndex, endIndex)
创建标注(label)

| 参数 | 意义              |
| ---- | ----------------- |
| categoryId   | 被创建的labelCategories的id  |
| startIndex    | 被创建的label的起始位置 |
| endIndex    | 被创建的label的结束位置 |

#### deleteLabel (labelId)
删除标注(label)

| 参数 | 意义              |
| ---- | ----------------- |
| labelId   | 要删除的label的id  |

#### updateLabel (labelId, categoryId)
修改标注(label)

| 参数 | 意义              |
| ---- | ----------------- |
| labelId   | 要修改的label的id  |
| categoryId   | 要修改的labelCategories的id  |

#### createConnection (categoryId, fromId, toId)
创建连接(Connection)

| 参数 | 意义              |
| ---- | ----------------- |
| categoryId   | 被创建的ConnectionCategories的id  |
| fromId    | 起始位置label的id |
| toId    | 结束位置label的id |

#### deleteConnection (categoryId)
删除连接(Connection)

| 参数 | 意义              |
| ---- | ----------------- |
| categoryId   | 要删除的ConnectionCategories的id  |

#### updateConnection (connectionId, categoryId)
修改连接(Connection)

| 参数 | 意义              |
| ---- | ----------------- |
| connectionId   | 要修改的Connection的id  |
| categoryId   | 要修改的ConnectionCategories的id  |

#### download()
下载对应的[JSON格式](https://github.com/felixhpp/Case-SvgAnnotator/blob/master/doc/images/json-style.png)数据文件
