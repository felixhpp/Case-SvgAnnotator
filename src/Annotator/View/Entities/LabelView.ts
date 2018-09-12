import {TopContext} from "./TopContext";
import * as SVG from "svg.js";
import {LabelCategory} from "../../Store/Entities/LabelCategory";
import {View} from "../View";
import {Base} from "../../Infrastructure/Repository";
import {Label} from "../../Store/Entities/Label";
import {fromEvent} from "rxjs";
import {TopContextUser} from "./TopContextUser";
import {ConnectionView} from "./ConnectionView";

export namespace LabelView {
    const TEXT_CONTAINER_PADDING = 3;
    const TEXT_SIZE = 12;

    export class Entity extends TopContextUser {
        layer: number;
        svgElement: SVG.G = null;
        annotationElement: SVG.G;
        highLightElement: SVG.Rect;
        textElement: SVG.Text = null;

        constructor(public readonly id: number,
                    public readonly store: Label.Entity,
                    public readonly context: TopContext) {
            super();
            this.layer = 1;
        }

        get x() {
            return Math.min(this.highlightElementBox.x, this.annotationElementBox.container.x);
        }

        get width() {
            return Math.max(this.highlightElementBox.width, this.annotationElementBox.container.width);
        }

        private _highlightElementBox: {
            x: number,
            y: number,
            width: number,
            height: number
        } = null;

        get highlightElementBox() {
            if (this._highlightElementBox === null) {
                const startIndexInLine = this.store.startIndex - this.context.attachTo.store.startIndex;
                const endIndexInLine = this.store.endIndex - this.context.attachTo.store.startIndex;
                const parent = this.context.attachTo;
                try {
                    const firstCharX = parent.xCoordinateOfChar[startIndexInLine];
                    if (isNaN(firstCharX) || isNaN(parent.xCoordinateOfChar[endIndexInLine])) {
                        throw Error
                    }
                    this._highlightElementBox = {
                        x: firstCharX,
                        y: parent.y0,
                        width: parent.xCoordinateOfChar[endIndexInLine] - firstCharX,
                        height: 20.8
                    }
                } catch (e) {
                    const parentNode = this.context.attachTo.svgElement.node as any as SVGTSpanElement;
                    const firstCharBox = parentNode.getExtentOfChar(startIndexInLine);
                    const lastCharBox = parentNode.getExtentOfChar(endIndexInLine - 1);
                    this._highlightElementBox = {
                        x: firstCharBox.x,
                        y: firstCharBox.y,
                        width: lastCharBox.x - firstCharBox.x + lastCharBox.width,
                        height: firstCharBox.height
                    }
                }
            }
            return this._highlightElementBox;
        }

        private _annotationElementBox: {
            text: {
                x: number,
                width: number
            },
            container: {
                x: number,
                y: number,
                width: number
            }
        } = null;

        get annotationElementBox() {
            if (this._annotationElementBox === null) {
                let highlightElementBox = this.highlightElementBox;
                let middleX = highlightElementBox.x + highlightElementBox.width / 2;
                if (this.textElement === null) {
                    this.preRender(this.context.attachTo.root.svgDoc);
                }
                // 使用document.getElementById().getBoundingClientRect().width 避免在谷歌浏览器下width获取不包含padding
                // let textWidth = (this.textElement as any).width;
                let textWidth = document.getElementById(this.textElement.id()).getBoundingClientRect().width;

                let containerWidth = textWidth + 2 * TEXT_CONTAINER_PADDING;
                let textX = middleX - textWidth / 2;
                let containerX = textX - TEXT_CONTAINER_PADDING;
                this._annotationElementBox = {
                    text: {
                        x: textX,
                        width: textWidth
                    },
                    container: {
                        x: containerX,
                        y: highlightElementBox.y,
                        width: containerWidth
                    }
                }
            }
            return this._annotationElementBox;
        }

        private get category(): LabelCategory.Entity {
            return this.store.category;
        }

        get rendered(): boolean {
            return this.svgElement !== null;
        }

        render() {
            try {
                this.svgElement = this.context.svgElement.group();
                this.renderHighlight();
                this.renderAnnotation();
                this.context.attachTo.root.labelViewRepo.rendered(this.id);
            } catch (e) {
                console.log(this.id);
            }
        }

        preRender(context: SVG.Doc) {
            this.textElement = context.text(this.category.text).font({size: TEXT_SIZE});           
            (this.textElement as any).width = this.textElement.node.clientWidth;
        }

        removeElement() {
            this.svgElement.remove();
            this.svgElement = null;
            this._annotationElementBox = null;
            this.annotationElement = null;
            this._highlightElementBox = null;
            this.highLightElement = null;
            this.textElement = null;
        }

        /**
         * Thanks to Alex Hornbake (function for generate curly bracket path)
         * @see http://bl.ocks.org/alexhornbake/6005176
         */
        private bracket(x1, y1, x2, y2, width, q = 0.6) {
            //Calculate unit vector
            let dx = x1 - x2;
            let dy = y1 - y2;
            let len = Math.sqrt(dx * dx + dy * dy);
            dx = dx / len;
            dy = dy / len;

            //Calculate Control Points of path,
            let qx1 = x1 + q * width * dy;
            let qy1 = y1 - q * width * dx;
            let qx2 = (x1 - .25 * len * dx) + (1 - q) * width * dy;
            let qy2 = (y1 - .25 * len * dy) - (1 - q) * width * dx;
            let tx1 = (x1 - .5 * len * dx) + width * dy;
            let ty1 = (y1 - .5 * len * dy) - width * dx;
            let qx3 = x2 + q * width * dy;
            let qy3 = y2 - q * width * dx;
            let qx4 = (x1 - .75 * len * dx) + (1 - q) * width * dy;
            let qy4 = (y1 - .75 * len * dy) - (1 - q) * width * dx;
            return this.annotationElement.path(`M${x1},${y1}Q${qx1},${qy1},${qx2},${qy2}T${tx1},${ty1}M${x2},${y2}Q${qx3},${qy3},${qx4},${qy4}T${tx1},${ty1}`)
                .fill('none').stroke({
                    color: this.category.borderColor,
                    width: 1
                });
        }

        private renderHighlight() {
            let box = this.highlightElementBox;
            this.highLightElement = this.svgElement.rect(box.width, box.height).y(0);
            this.highLightElement.fill({
                color: this.category.color,
                opacity: 0.5
            }).dx(box.x);
        }

        private renderAnnotation() {
            let highLightBox = this.highlightElementBox;
            let annotationBox = this.annotationElementBox;
            this.annotationElement = this.svgElement.group().back();
            this.annotationElement.rect(annotationBox.container.width, TEXT_SIZE + TEXT_CONTAINER_PADDING * 2)
                .radius(3, 3)
                .fill({
                    color: this.category.color,
                })
                .stroke(this.category.borderColor)
                .x(annotationBox.container.x).y(-8);
            this.bracket(highLightBox.x + highLightBox.width, 20.8, highLightBox.x, 20.8, 8);
            this.annotationElement.put(this.textElement);
            this.textElement.x(annotationBox.text.x).y(-TEXT_SIZE - TEXT_CONTAINER_PADDING + 9.5);
            this.textElement.style({
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            });
            this.annotationElement.y(this.y);
            this.annotationElement.style({cursor: 'pointer'});
            this.annotationElement.addClass('label-view');
            this.annotationElement.on('click', (e) => {
                this.context.attachTo.root.root.emit('labelClicked', this.id);
                e.preventDefault();
            });
            this.annotationElement.on('contextmenu', (e) => {
                this.context.attachTo.root.root.emit('labelRightClicked', this.id, e.clientX, e.clientY);
                e.preventDefault();
            });
        }

        get globalY() {
            return this.annotationElement.node.getBoundingClientRect().top - (this.annotationElement.doc() as SVG.Doc).node.getBoundingClientRect().top;
        }

        get globalX() {
            return this.annotationElement.node.getBoundingClientRect().left - (this.annotationElement.doc() as SVG.Doc).node.getBoundingClientRect().left;
        }
    }

    export class Repository extends Base.Repository<Entity> {
        root: View;
        rendered$ = fromEvent(this.eventEmitter, 'rendered');

        constructor(root: View) {
            super(root);
        }

        rendered(id: number) {
            this.eventEmitter.emit('rendered', id);
        }

        delete(key: number | Entity): boolean {
            if (typeof key !== "number") {
                key = key.id;
            }
            if (this.has(key)) {
                try {
                    const theEntityToRemove = this.get(key as number);
                    theEntityToRemove.context.attachTo.removeChild(this.get(key));
                    theEntityToRemove.store.allConnections.forEach(it => {
                        if (this.root.connectionViewRepo.has(it.id)) {
                            let connectionView = this.root.connectionViewRepo.get(it.id);
                            if (!connectionView.inline && connectionView.prior !== theEntityToRemove) {
                                theEntityToRemove.removeElement();
                                super.delete(key);
                                this.root.connectionViewRepo.delete(connectionView);
                                this.root.connectionViewRepo.add(new ConnectionView.Entity(connectionView.id, connectionView.store, this.root));
                                return true;
                            }
                            this.root.connectionViewRepo.delete(connectionView);
                        }
                    });
                } catch (e) {
                }
                if (this.has(key))
                    this.get(key).removeElement();
            }
            return super.delete(key);
        }
    }
}