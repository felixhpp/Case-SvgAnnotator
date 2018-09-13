import {SvgAnnotatorOptions,SvgAnnotatorDefaultOptions} from '../SvgAnnotator/SvgAnnotatorOptions';
import {Annotator} from '../Annotator/Annotator'
import {Action} from '../Annotator/Action/Action'

let _annotator:Annotator = null;
//typescript:类 class
export class SvgAnnotator {
    public annotator1;
    public options: SvgAnnotatorDefaultOptions;
    public jsonData: object;
    //构造函数（方法）
    constructor(htmlElement: HTMLElement, data: string | object, options? :SvgAnnotatorOptions) {
        let defaults = new SvgAnnotatorDefaultOptions();
        this.options = $.extend({}, defaults, options);
  
        let config = {
            maxLineWidth:this.options.maxLineWidth
        };
        _annotator = new Annotator(data, htmlElement, config);
        this.annotator1 = _annotator;
        this.options.originString = _annotator.store.content;
        _annotator.on('textSelected', (startIndex: number, endIndex: number) => {
            if(typeof this.options.textSelected === "function"){
                this.options.startIndex = startIndex;
                this.options.endIndex = endIndex;
                this.options.selectedText = this.options.originString.slice(startIndex, endIndex)
                this.options.textSelected(startIndex, endIndex);
            }
        });
        _annotator.on('labelClicked', (id: number) => {
            if(typeof this.options.labelClicked === "function"){
                this.options.labelClicked(id);
            }
        });
      
        _annotator.on('labelRightClicked', (id: number,x: number,y: number) => {
            if(typeof this.options.labelRightClicked === "function"){
                this.options.labelRightClicked(id,x,y);
            }
        });
      
        _annotator.on('twoLabelsClicked', (first: number, second: number) => {
            if(typeof this.options.twoLabelsClicked === "function"){
              this.options.first = first;
              this.options.second =second;
              this.options.twoLabelsClicked(first,second);
            }
        });
      
        _annotator.on('connectionRightClicked', (id: number,x: number,y: number) => {
            if(typeof this.options.connectionRightClicked === "function"){
                this.options.connectionRightClicked(id,x,y);
            }
        });
    }

    private _applyAction(action: Action.IAction){
        _annotator.applyAction(action);
        this.jsonData = _annotator.store.json;
    };

    /**
     * 创建标注(Label)
     * @param categoryId 
     * @param startIndex 
     * @param endIndex 
     */
    public createLabel (categoryId: number, startIndex: number, endIndex: number) {
        this._applyAction(Action.Label.Create(categoryId, startIndex, endIndex));
    };

    /**
     * 删除标注(Label)
     * @param categoryId 
     */
    public deleteLabel (categoryId: number) {
        this._applyAction(Action.Label.Delete(categoryId));
    };
    /**
     * 修改标注(Label)
     * @param labelId 
     * @param categoryId 
     */
    public updateLabel (labelId: number, categoryId: number) {
        this._applyAction(Action.Label.Update(labelId, categoryId));
    };

    /**
     * 创建连接(Connection)
     * @param categoryId 
     * @param startIndex 
     * @param endIndex 
     */
    public createConnection (categoryId: number, fromId: number, toId: number) {
        this._applyAction(Action.Connection.Create(categoryId, fromId, toId));
    };
    /**
     * 删除连接(Connection)
     * @param categoryId 
     */
    public deleteConnection (categoryId: number) {
        this._applyAction(Action.Connection.Delete(categoryId));
    };
    /**
     * 更新连接(Connection)
     * @param labelId 
     * @param categoryId 
     */
    public updateConnection (connectionId: number, categoryId: number) {
        this._applyAction(Action.Connection.Update(connectionId, categoryId));
    };
  
    public getJsonStr(){
        if (_annotator === null) {
            return '';
        }
        let str = JSON.stringify(_annotator.store.json, null, 2);

        return str;
    };

    public download(){
        let eleLink = document.createElement('a');
        eleLink.download = 'data.json';
        eleLink.style.display = 'none';
        let blob = new Blob([JSON.stringify(_annotator.store.json)]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };

    public getLabelRepoById(id:number){
        let curLabelViewRepo = _annotator.view.labelViewRepo;
        let labelViewRepoEntity = null;
        if(curLabelViewRepo != null){
             curLabelViewRepo.entities.forEach(item =>{
                 if(item.id === id){
                    let curStore = item.context.attachTo.store;
                    let startIndexInLine = item.store.startIndex - curStore.startIndex;
                    let endIndexInLine = item.store.endIndex - curStore.startIndex;
                    labelViewRepoEntity = {
                        curLineText: curStore.text,
                        startIndexInLine: startIndexInLine,
                        endIndexInLine: endIndexInLine
                    }

                 }
             });
        }

        return labelViewRepoEntity;
    };

    public getConnectionRepoById(id:number){
        
    };
}
