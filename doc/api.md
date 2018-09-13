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

为了使用Case-SvgAnnotator插件，我们需要在html中引用jquery.js和jquery.annotator.js：

```HTML
 <script src="jquery-1.11.1.js"></script>
 <script src="jquery.annotator.js"></script>
 <script>
    var svgAnnotator = $.SvgAnnotator(document.getElementById("div"), data, options);
 </script>
```

### data

在data为JSON时，格式如下：

![JSON格式](http://www.pic68.com/uploads/2018/08/1(7).png)

在data为纯文本时，相当于`content`为文本内容，其他为`[]`的JSON。

构造后，对应元素内应该就会显示出对应的SVG图片。

### options

`options`是一个`object`对象，选项通常作为参数传递给init或attach动作。其中可配置的值如下：

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

提供了多个方法供用户调用

#### createLabel (labelId, startIndex, endIndex)
创建标注(label)

#### deleteLabel (labelId)
删除标注(label)

#### updateLabel (labelId, categoryId)
修改标注(label)

#### createConnection (categoryId, startIndex, endIndex)
创建连接(Connection)

#### deleteConnection (categoryId)
删除连接(Connection)

#### updateConnection (labelId, categoryId)
修改连接(Connection)

#### download()
下载json文件
