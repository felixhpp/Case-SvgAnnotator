import {Connection} from "../../Store/Entities/Connection";
import {TopContext} from "./TopContext";
import * as SVG from "svg.js";
import {View} from "../View";
import {filter, first} from "rxjs/operators";
import {Base} from "../../Infrastructure/Repository";
import {TopContextUser} from "./TopContextUser";
import {Observable, of, Subscription} from "rxjs";
import {assert} from "../../Infrastructure/Assert";

export namespace ConnectionView {
    export class Entity extends TopContextUser {
        svgElement: SVG.G = null;
        textElement: SVG.Text = null;
        lineElement: SVG.Path = null;
        layer: number;
        rerenderLinesSubscription: Subscription = null;

        constructor(
            public readonly id: number,
            public readonly store: Connection.Entity,
            public readonly root: View
        ) {
            super();
            let readyToRender: Observable<any>;
            if (!this.priorRendered && !this.posteriorRendered) {
                readyToRender = this.root.labelViewRepo.rendered$.pipe(
                    filter(it => it === this.store.mayNotSameLineLabel.id),
                )
            } else if (this.priorRendered && !this.posteriorRendered) {
                readyToRender = this.root.labelViewRepo.rendered$.pipe(
                    filter(it => it === this.store.mayNotSameLineLabel.id),
                )
            } else if (!this.priorRendered && this.posteriorRendered) {
                readyToRender = this.root.labelViewRepo.rendered$.pipe(
                    filter(it => it === this.store.sameLineLabel.id),
                )
            } else {
                readyToRender = of(1);
            }
            readyToRender.pipe(first()).subscribe(() => {
                if (this.inline) {
                    this.layer = Math.max(this.prior.layer, this.posterior.layer) + 1;
                } else {
                    this.layer = this.prior.layer + 1;
                }
                this.context.attachTo.addChild(this);
            });
        }

        get context(): TopContext {
            return this.root.labelViewRepo.get(this.store.sameLineLabel.id).context;
        }

        get from() {
            return this.root.labelViewRepo.get(this.store.from.id);
        }

        get fromRendered(): boolean {
            return this.root.labelViewRepo.has(this.store.from.id) && this.from.rendered
        }

        get to() {
            return this.root.labelViewRepo.get(this.store.to.id);
        }

        get toRendered(): boolean {
            return this.root.labelViewRepo.has(this.store.to.id) && this.to.rendered
        }

        get prior() {
            return this.root.labelViewRepo.get(this.store.sameLineLabel.id);
        }

        get priorRendered(): boolean {
            return this.root.labelViewRepo.has(this.store.sameLineLabel.id) && this.prior.rendered;
        }

        get posterior() {
            return this.root.labelViewRepo.get(this.store.mayNotSameLineLabel.id);
        }

        get posteriorRendered(): boolean {
            return this.root.labelViewRepo.has(this.store.mayNotSameLineLabel.id) && this.posterior.rendered;
        }

        get category() {
            return this.store.category;
        }

        get width(): number {
            if (this.textElement === null) {
                this.textElement = this.root.svgDoc.text(this.category.text).font({size: 12});
            }
            return this.textElement.bbox().width;
        }

        get x(): number {
            return (this.from.x + this.to.x + this.to.width - this.width) / 2;
        }

        get globalY(): number {
            return this.textElement.node.getBoundingClientRect().top - (this.textElement.doc() as SVG.Doc).node.getBoundingClientRect().top;
        }

        get inline() {
            return this.posterior.context === this.prior.context;
        }

        render() {
            assert(this.svgElement === null, 'render ConnectionView twice');
            this.svgElement = this.context.svgElement.group();
            this.svgElement.rect(this.width, 12).y(5).fill('white');
            if (this.textElement === null) {
                this.textElement = this.svgElement.text(this.category.text).font({size: 12});
            } else {
                this.svgElement.add(this.textElement);
            }
            this.textElement.style({
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            });
            this.svgElement.on('contextmenu', (e) => {
                this.context.attachTo.root.root.emit('connectionRightClicked', this.id, e.clientX, e.clientY);
                e.preventDefault();
            });
            this.svgElement.x(this.x);
            this.svgElement.y(this.y);
            this.svgElement.addClass('connection-view');
            this.renderLines();
        }

        rerenderLines() {
            assert(this.lineElement !== null);
            this.lineElement.remove();
            this.lineElement = null;
            this.renderLines();
        }

        private renderLines() {
            if (!this.posteriorRendered || !this.priorRendered) {
                return;
            }
            if (this.lineElement !== null) {
                this.rerenderLines();
                return;
            }
            let thisY = 0;
            let fromY = 0;
            let toY = 0;
            let context: SVG.Container = null;
            if (this.inline) {
                fromY = this.from.y - 6;
                thisY = this.y + 20.8 - 11;
                toY = this.to.y - 6;
                context = this.context.svgElement;
            } else {
                fromY = this.from.globalY;
                thisY = this.globalY + 6;
                toY = this.to.globalY;
                context = (this.svgElement.doc() as SVG.Doc);
            }
            if (this.from.annotationElementBox.container.x < this.to.annotationElementBox.container.x) {
                this.lineElement = context.path(
                    `
                M ${this.from.annotationElementBox.container.x}                    ${fromY}
                C ${this.from.annotationElementBox.container.x - 10}               ${thisY},
                  ${this.from.annotationElementBox.container.x - 10}               ${thisY},
                  ${this.from.annotationElementBox.container.x}                    ${thisY}
                L ${this.x}                         ${thisY}
                M ${this.x + this.width}            ${thisY}
                L ${this.to.annotationElementBox.container.x + this.to.annotationElementBox.container.width}      ${thisY}
                C ${this.to.annotationElementBox.container.x + this.to.annotationElementBox.container.width + 10} ${thisY},
                  ${this.to.annotationElementBox.container.x + this.to.annotationElementBox.container.width + 10} ${thisY},
                  ${this.to.annotationElementBox.container.x + this.to.annotationElementBox.container.width}      ${toY}
                `).stroke('black').fill('transparent');
            } else {
                this.lineElement = context.path(
                    `
                M ${this.from.annotationElementBox.container.x + this.from.annotationElementBox.container.width}      ${fromY}
                C ${this.from.annotationElementBox.container.x + this.from.annotationElementBox.container.width + 10} ${thisY},
                  ${this.from.annotationElementBox.container.x + this.from.annotationElementBox.container.width + 10} ${thisY},
                  ${this.from.annotationElementBox.container.x + this.from.annotationElementBox.container.width}      ${thisY}
                L ${this.x + this.width}                ${thisY}
                M ${this.x}                             ${thisY}
                L ${this.to.annotationElementBox.container.x}                          ${thisY}
                C ${this.to.annotationElementBox.container.x - 10}                     ${thisY},
                  ${this.to.annotationElementBox.container.x - 10}                     ${thisY},
                  ${this.to.annotationElementBox.container.x}                          ${toY}
                `).stroke('black').fill('transparent');
            }
            this.lineElement.marker('end', 5, 5, function (add) {
                add.polyline('0,0 5,2.5 0,5 0.2,2.5');
            });
            this.lineElement.back();
            if (this.rerenderLinesSubscription !== null) {
                this.rerenderLinesSubscription.unsubscribe();
            }
            this.lineElement.on('mouseover', () => {
                this.lineElement.stroke({width: 2, color: 'red'});
            });
            this.svgElement.on('mouseover', () => {
                this.lineElement.stroke({width: 2, color: 'red'});
            });
            this.lineElement.on('mouseout', () => {
                this.lineElement.stroke({width: 1, color: 'black'});
            });
            this.svgElement.on('mouseout', () => {
                this.lineElement.stroke({width: 1, color: 'black'});
            });
            this.rerenderLinesSubscription = this.posterior.context.positionChanged$.subscribe(() => this.rerenderLines());
        }

        removeElement() {
            this.rerenderLinesSubscription.unsubscribe();
            this.svgElement.remove();
            if (this.lineElement)
                this.lineElement.remove();
            this.lineElement = null;
            this.textElement = null;
            this.svgElement = null;
        }
    }

    export class Repository extends Base.Repository<Entity> {
        root: View;

        constructor(root: View) {
            super(root);
        }

        delete(key: number | Entity): boolean {
            if (typeof key !== "number") {
                key = key.id;
            }
            if (this.has(key)) {
                try {
                    this.get(key).context.attachTo.removeChild(this.get(key));
                } catch (e) {
                }
                this.get(key).removeElement();
            }
            return super.delete(key);
        }
    }

    export function constructAll(root: View): Array<Entity> {
        let result = [];
        for (let [id, entity] of root.store.connectionRepo) {
            result.push(new Entity(id, entity, root));
        }
        return result;
    }
}