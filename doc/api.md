# Reference API 

## HTML

### Root Element

Case-SvgAnnotator可以绑定到任何一个空HTML元素上。

我们推荐绑定到`div`元素上。

#### Example

```html
<div id="example"></div>
```

## JS

### 创建

为了使用Case-SvgAnnotator插件，我们需要在html中引用jQuery.js和jquery.annotator.js：

```HTML
 <script src="jquery-1.11.1.js"></script>
 <script src="jquery.annotator.js"></script>
 <script>
    var svgAnnotator = $.SvgAnnotator(document.getElementById("div"), data, options);
 </script>
```

#### data

在data为JSON时，格式如下：

![JSON格式](http://www.pic68.com/uploads/2018/08/1(7).png)

在data为纯文本时，相当于`content`为文本内容，其他为`[]`的JSON。

构造后，对应元素内应该就会显示出对应的SVG图片。

#### options

`options`是一个`object`对象，其中可配置的值如下：

| 配置项       | 说明                                             | 默认值 |
| ------------ | ------------------------------------------------ | ------ |
| maxLineWidth | 最大行宽，在一行中的字符数超过此数值后会进行折行 | 80     |
| textSelected() | 文本选中后的回调函数方法 |      |


