
export interface SvgAnnotatorOptions{
    maxLineWidth?: number;
    // 是否允许同一块文本被不同的Label标记
    allowMultipleLabel?: boolean;
    textSelected?;
    labelClicked?;
    labelRightClicked?;
    twoLabelsClicked?;
    connectionRightClicked?;
}


export class SvgAnnotatorDefaultOptions implements SvgAnnotatorOptions {
    originString : string = "";
    selectedText: string = "";
    selectedLabelCategory: number = -1;
    selectedConnectionCategory:number = -1;
    startIndex:number = -1;
    endIndex:number = -1;
    first:number = -1;
    second:number = -1;
    maxLineWidth: number= 80;
    allowMultipleLabel: boolean = true;

    /**
     * 选取了一段文本后，会触发textSelected事件
     * @param startIndex 选取部分的开始坐标
     * @param endIndex 选取部分的结束坐标
     */
    textSelected (startIndex: number, endIndex: number) {};

    /**
     * 用户左键点击了一个Label后会触发这个事
     * @param id 被点击的标注的id
     */
    labelClicked (id: number) {};
      /**
     * 在用户右键点击了一个Label后会触发这个事件。
     * @param id 被点击的标注的id
     * @param x 被点击时鼠标的X值
     * @param y 被点击时鼠标的Y值
     */
    labelRightClicked(id: number,x: number,y: number){};

    /**
     * 在用户先后左键点击了两个Label后会触发这个事件。。
     * @param first 第一个点击的标注的id
     * @param second 第二个点击的标注的id
     */
    twoLabelsClicked (first:number, second: number) {};

    /**
     * 在用户右键点击了一个连接的文字部分后会触发这个事件。
     * @param id 被点击的连接的id
     * @param x 被点击时鼠标的X值
     * @param y 被点击时鼠标的Y值
     */
    connectionRightClicked (id: number,x: number,y: number) {};
}


