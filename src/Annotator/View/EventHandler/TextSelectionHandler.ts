import { Annotator } from "../../Annotator";
import { LineView } from "../Entities/LineView";
import { identity } from "../../../../node_modules/rxjs";

export class TextSelectionHandler {
    selectLengthLimit = 80;

    constructor(public root: Annotator) {

    }

    getSelectionInfo() {
        const selection = window.getSelection();
        let startElement = null;
        let endElement = null;
        try {
            startElement = selection.anchorNode.parentNode;
            endElement = selection.focusNode.parentNode;
        } catch (e) {
            return null;
        }
        let startLineView: LineView.Entity;
        let endLineView: LineView.Entity;
        let startIndex: number;
        let endIndex: number;
        try {
            startLineView = (startElement as any).instance.AnnotatorElement as LineView.Entity;
            endLineView = (endElement as any).instance.AnnotatorElement as LineView.Entity;
            if (startLineView.root.root !== this.root || endLineView.root.root !== this.root) {
                return null;
            }
            startIndex = startLineView.store.startIndex + selection.anchorOffset;
            endIndex = endLineView.store.startIndex + selection.focusOffset;
        } catch (e) {
            return null;
        }
        if (startIndex > endIndex) {
            [startIndex, endIndex] = [endIndex, startIndex];
        }
        if (endIndex - startIndex >= this.root.store.config.maxLineWidth) {
            return null;
        }
        while (startLineView.store.allContent[startIndex] === ' ' || startLineView.store.allContent[startIndex] === '\n') {
            ++startIndex;
        }
        while (startLineView.store.allContent[endIndex - 1] === ' ' || startLineView.store.allContent[endIndex - 1] === '\n') {
            --endIndex;
        }
        if (startIndex >= endIndex) {
            return null;
        }

        //get highlightElementBox
        // const startIndexInLine = selection.anchorOffset;
        // const endIndexInLine = selection.focusOffset;
        // const parent = startLineView; //=>
        // const firstCharX = parent.xCoordinateOfChar[startIndexInLine];
        // const endCharX = parent.xCoordinateOfChar[endIndexInLine];
        // var highlightElementBox = {
        //         x: firstCharX,
        //         y: parent.y,
        //         width: endCharX - firstCharX,
        //         height: 20
        //     }
        // let box = highlightElementBox;
        // var highLightElement = startLineView.topContext.svgElement.rect(box.width, box.height);
        // highLightElement.fill({
        //     color: "red",
        //     opacity: 0.5
        // }).dx(box.x);

        return {
            startIndex: startIndex,
            endIndex: endIndex
        }
    }

    textSelected() {
        let selectionInfo = this.getSelectionInfo();
        if (selectionInfo) {
            this.root.emit('textSelected', selectionInfo.startIndex, selectionInfo.endIndex);
        }
        window.getSelection().removeAllRanges();
    }
}
