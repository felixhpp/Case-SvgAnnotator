import { SvgAnnotatorOptions, SvgAnnotatorDefaultOptions } from '../SvgAnnotator/SvgAnnotatorOptions';
import { Annotator } from '../Annotator/Annotator'
import { Action } from '../Annotator/Action/Action'
import { cusAssert } from "../SvgAnnotator/CusAssert";
import { LabelView } from '../Annotator/View/Entities/LabelView';
import { ConnectionView } from '../Annotator/View/Entities/ConnectionView';
import { _Number } from '../../node_modules/svg.js';

let _annotator: Annotator = null;
//typescript:类 class
export class SvgAnnotator {
    public annotator1;
    public options: SvgAnnotatorDefaultOptions;
    public jsonData: object;
    //构造函数（方法）
    constructor(htmlElement: HTMLElement, data: string | object, options?: SvgAnnotatorOptions) {
        let defaults = new SvgAnnotatorDefaultOptions();
        this.options = $.extend({}, defaults, options);

        let config = {
            maxLineWidth: this.options.maxLineWidth,
            allowMultipleLabel: this.options.allowMultipleLabel
        };
        _annotator = new Annotator(data, htmlElement, config);
        this.jsonData = _annotator.store.json;
        this.annotator1 = _annotator;
        this.options.originString = _annotator.store.content;

        //#region 事件绑定

        _annotator.on('textSelected', (startIndex: number, endIndex: number) => {
            cusAssert(typeof this.options.textSelected === "function",
                'options "textSelected" must is function type');

            this.options.startIndex = startIndex;
            this.options.endIndex = endIndex;
            this.options.selectedText = this.options.originString.slice(startIndex, endIndex)
            this.options.textSelected(startIndex, endIndex);
        });
        _annotator.on('labelClicked', (id: number) => {
            cusAssert(typeof this.options.labelClicked === "function",
                'options "labelClicked" must is function type');

            this.options.labelClicked(id);
        });

        _annotator.on('labelRightClicked', (id: number, x: number, y: number) => {
            cusAssert(typeof this.options.labelRightClicked === "function",
                'options "labelRightClicked" must is function type');

            this.options.labelRightClicked(id, x, y);
        });

        _annotator.on('labelDblClicked', (id: number) => {
            cusAssert(typeof this.options.labelDblClicked === "function",
                'options "labelDblClicked" must is function type');

            this.options.labelDblClicked(id);
        });


        _annotator.on('twoLabelsClicked', (first: number, second: number) => {
            cusAssert(typeof this.options.twoLabelsClicked === "function",
                'options "twoLabelsClicked" must is function type');

            this.options.first = first;
            this.options.second = second;
            this.options.twoLabelsClicked(first, second);
        });

        _annotator.on('connectionRightClicked', (id: number, x: number, y: number) => {
            cusAssert(typeof this.options.connectionRightClicked === "function",
                'options "connectionRightClicked" must is function type');

            this.options.connectionRightClicked(id, x, y);
        });

        _annotator.on('connectionDblClicked', (id: number, x: number, y: number) => {
            cusAssert(typeof this.options.connectionDblClicked === "function",
                'options "connectionDblClicked" must is function type');

            this.options.connectionDblClicked(id, x, y);
        });
        //#endregion 
    }

    private _applyAction(action: Action.IAction) {
        _annotator.applyAction(action);
        _annotator.view.resize();
        this.jsonData = _annotator.store.json;
    };

    public remove() {
        _annotator.remove();
    };

    //#region 事件方法

    /**
     * 创建标注(Label)
     * @param categoryId 
     * @param startIndex 
     * @param endIndex 
     */
    public createLabel(categoryId: number, startIndex: number, endIndex: number, attributes?: object) {
        let isOvetlap: boolean = false;
        let labels = ('labels' in this.jsonData) ? this.jsonData['labels'] : [];
        labels.forEach(item => {
            if (item.categoryId === categoryId
                && item.startIndex === startIndex
                && item.endIndex === endIndex) {
                //cusAssert(false, "label not allow overlap.");
                isOvetlap = true;
                return false;
            }
        });

        if (!isOvetlap) {
            this._applyAction(Action.Label.Create(categoryId, startIndex, endIndex, attributes));
        }
    };

    /**
     * 删除标注(Label)
     * @param id 
     */
    public deleteLabel(id: number) {
        let labelViewRepoEntity = this.getLabelLineById(id)
        this._applyAction(Action.Label.Delete(id));
        if (labelViewRepoEntity != null) {
            _annotator.view.rerendered(labelViewRepoEntity.id);
        }
        
    };
    /**
     * 修改标注(Label)
     * @param labelId 
     * @param categoryId 
     */
    public updateLabel(labelId: number, categoryId: number, attributes?: object) {
        let labelViewRepoEntity = this.getLabelLineById(labelId)
        this._applyAction(Action.Label.Update(labelId, categoryId, attributes));
        if (labelViewRepoEntity != null) {
            _annotator.view.rerendered(labelViewRepoEntity.id);
        }
    };

    /**
     * 创建连接(Connection)
     * @param categoryId 
     * @param startIndex 
     * @param endIndex 
     */
    public createConnection(categoryId: number, fromId: number, toId: number) {
        let isOvetlap: boolean = false;
        let labels = ('connections' in this.jsonData) ? this.jsonData['connections'] : [];
        labels.forEach(item => {
            if (item.categoryId === categoryId
                && item.fromId === fromId
                && item.toId === toId) {
                isOvetlap = true;
                return false;
            }
        });

        if (!isOvetlap) {
            this._applyAction(Action.Connection.Create(categoryId, fromId, toId));
        }
    };
    /**
     * 删除连接(Connection)
     * @param categoryId 
     */
    public deleteConnection(categoryId: number) {
        this._applyAction(Action.Connection.Delete(categoryId));
    };
    /**
     * 更新连接(Connection)
     * @param labelId 
     * @param categoryId 
     */
    public updateConnection(connectionId: number, categoryId: number) {
        this._applyAction(Action.Connection.Update(connectionId, categoryId));
    };
    //#endregion

    //#region 辅助方法

    public getJsonStr() {
        if (_annotator === null) {
            return '';
        }
        let str = JSON.stringify(_annotator.store.json, null, 2);

        return str;
    };
    public getLabeCatelJsonById(id) {
        let curJsonData = this.jsonData;
        let json = new Object;
        if (!curJsonData["labelCategories"]
            && curJsonData["labelCategories"].length > 0) {
            json = curJsonData["labelCategories"].forEach(item => {
                if (item.id === id) {
                    json = item;
                    return false;
                }
            });
        }

        return json;
    };

    public getlabelElementById(labelId: number) {
        let curLabelViewRepo = _annotator.view.labelViewRepo;
        let labelElement: LabelView.Entity = null;
        if (curLabelViewRepo != null) {
            curLabelViewRepo.entities.forEach(item => {
                if (item.id === labelId) {
                    labelElement = item;
                    return false;
                }
            });
        }

        return labelElement;
    };

    public getConnectionElementById(id: number) {
        let connectionElement: ConnectionView.Entity = null;
        let curConnectionViewRepo = _annotator.view.connectionViewRepo;

        if (curConnectionViewRepo != null) {
            curConnectionViewRepo.entities.forEach(item => {
                if (item.id === id) {
                    connectionElement = item;
                    return false;
                }
            });
        }

        return connectionElement;
    };


    //#endregion


    /**
     * label高亮
     */
    public labelHighlighted(labelId: number) {
        let labelElement = this.getlabelElementById(labelId);
        if (labelElement !== null) {

            //item.highLightElement.stroke({width: 1.5, color: 'red'})
            let itemElement = labelElement.svgElement.node.getElementsByClassName("label-view");
            let rectElement = itemElement[0].getElementsByTagName("rect");
            let pathElement = itemElement[0].getElementsByTagName("path");
            rectElement[0].style.cssText = "stroke: red;stroke-width:2";
            pathElement[0].style.cssText = "stroke: red;stroke-width:2";

        }

    };

    public cancelLabelHighlighted(labelId: number) {
        let labelElement = this.getlabelElementById(labelId);
        if (labelElement !== null) {
            let itemElement = labelElement.svgElement.node.getElementsByClassName("label-view");
            let rectElement = itemElement[0].getElementsByTagName("rect");
            let pathElement = itemElement[0].getElementsByTagName("path");

            let curColor = labelElement.category.borderColor;

            rectElement[0].style.cssText = "stroke: " + curColor + ";stroke-width:1";
            pathElement[0].style.cssText = "stroke: " + curColor + ";stroke-width:1";
        }
    };

    public connectionHighlighted(connectionId: number) {
        let connectionElement = this.getConnectionElementById(connectionId);
        if (connectionElement !== null) {
            let fromId = connectionElement.from.id;
            let endId = connectionElement.to.id;
            let lineElement = connectionElement.lineElement;
            this.labelHighlighted(fromId);
            this.labelHighlighted(endId);
            lineElement.stroke({ width: 2, color: 'red' });
        }
    };

    public cancelConnectionHighlighted(connectionId: number) {
        let connectionElement = this.getConnectionElementById(connectionId);
        if (connectionElement !== null) {
            let fromId = connectionElement.from.id;
            let endId = connectionElement.to.id;
            let lineElement = connectionElement.lineElement;
            this.cancelLabelHighlighted(fromId);
            this.cancelLabelHighlighted(endId);
            lineElement.stroke({ width: 1, color: 'black' });
        }
    };


    public download() {
        let eleLink = document.createElement('a');
        eleLink.download = 'data.json';
        eleLink.style.display = 'none';
        let blob = new Blob([JSON.stringify(_annotator.store.json)]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };

    /**
     * 获取label所在行文本信息
     * @param id label的id
     */
    public getLabelLineById(id: number) {
        let curLabelViewRepo = _annotator.view.labelViewRepo;
        let labelViewRepoEntity = null;
        if (curLabelViewRepo != null) {
            curLabelViewRepo.entities.forEach(item => {
                if (item.id === id) {
                    let curStore = item.context.attachTo.store;
                    let startIndexInLine = item.store.startIndex - curStore.startIndex;
                    let endIndexInLine = item.store.endIndex - curStore.startIndex;
                    labelViewRepoEntity = {
                        labelId: id,
                        curLineText: curStore.text,
                        startIndexInLine: startIndexInLine,
                        endIndexInLine: endIndexInLine,
                        startIndex: curStore.startIndex,
                        endIndex: curStore.endIndex
                    }

                    return false;
                }
            });
        }

        return labelViewRepoEntity;
    };

    /**
     * 获取连接线所在行文本信息，存在同一行和不在同一行的情况
     * @param id 连接线ID
     */
    public getConnectionLineById(id: number) {
        let connectionLineRepoEntity = null;
        let curConnectionViewRepo = _annotator.view.connectionViewRepo;

        if (curConnectionViewRepo != null) {
            curConnectionViewRepo.entities.forEach(item => {
                if (item.id === id) {
                    connectionLineRepoEntity = {
                        id: id,
                        inline: item.inline,
                        fromId: item.from.id,
                        toId: item.to.id
                    };
                    return false;
                }
            });
        }

        if (connectionLineRepoEntity != null) {
            let formLableLine = this.getLabelLineById(connectionLineRepoEntity.fromId);
            let toLabelLine = this.getLabelLineById(connectionLineRepoEntity.toId);

            if (formLableLine != null && toLabelLine != null) {
                let startIndex: number = formLableLine.startIndex;
                let endIndex: number = toLabelLine.endIndex;
                let lineText = this.options.originString.slice(startIndex, endIndex)
                connectionLineRepoEntity = {
                    connection: id,
                    fromId: connectionLineRepoEntity.fromId,
                    toId: connectionLineRepoEntity.toId,
                    curLineText: lineText,
                    startIndex: startIndex,
                    endIndex: endIndex
                };
            }
        }

        return connectionLineRepoEntity;
    };

}
