import {Base} from "../../Infrastructure/Repository";
import {Store} from "../Store";

export namespace ConnectionCategory {
    export class Entity {
        constructor(
            public readonly id: number,
            public readonly text: string,
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
        if (!json.attributes){
            json.attributes = new Object();
        }
        return new Entity(parseInt(json.id), json.text, json.attributes);
    }

    export function constructAll(json: Array<object>): Array<Entity> {
        return json.map(construct);
    }
}