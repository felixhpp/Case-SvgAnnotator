import {Base} from "../../Infrastructure/Repository";
import {Store} from "../Store";
import {shadeColor} from "../../Infrastructure/ShadeColor";

export namespace LabelCategory {

    export class Entity {
        constructor(
            public readonly id: number,
            public readonly text: string,
            public readonly color: string,
            public readonly borderColor: string,
            public readonly attributes: object
        ) {
        }
    }

    export class Repository extends Base.Repository<Entity> {
        readonly root: Store;

        constructor(root: Store) {
            super(root);
        }
    }

    export function construct(json: any): Entity {
        if (!(json.borderColor) && json["border-color"]) {
            json.borderColor = json["border-color"];
        }
        if (!(json.color)) {
            json.color = "#ff9d61";
        }
        if (!(json.borderColor)) {
            //json.borderColor = shadeColor(json.color, 30);
            json.borderColor = "#000080";
        }
        if (!json.attributes){
            json.attributes = new Object();
        }
        return new Entity(parseInt(json.id), json.text, 
        json.color, json.borderColor, json.attributes);
    }

    export function constructAll(json: Array<object>): Array<Entity> {
        return json.map(construct);
    }
}