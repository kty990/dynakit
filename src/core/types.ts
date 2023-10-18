import { CustomEventEmitter } from './event';
import { RouteDetector } from './routes';

class Style {
    attr: { [key: string]: any };
    constructor(styleAttr: { [key: string]: any }) {
        this.attr = styleAttr;
    }
}

class cElement extends CustomEventEmitter {
    classList: Array<string>;
    id: string;
    children: Array<cElement>;
    type: string;
    style: Style = new Style({});
    element: HTMLElement;

    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super();
        this.classList = classList;
        this.id = id;
        this.children = children;
        this.type = (<any>this).constructor.name;
    }

    generate(): void {
        this.element = document.createElement(this.type.toLowerCase());
        this.classList.forEach((v: string, i: number, arr: Array<string>) => {
            this.element.classList.add(v);
        })
        this.element.id = this.id;

        for (let x of this.getSupportedEvents(this.type)) {
            this.element.addEventListener(x, (eventData) => {
                this.emit(x, eventData);
            })
        }
    }

    getSupportedEvents(elementType: string): Array<string> {
        const eventTypes: Array<string> = [];
        const testElement = document.createElement(elementType);

        for (const key in window) {
            if (key.substring(0, 2) === 'on') {
                const eventType = key.substring(2);
                testElement.addEventListener(eventType, () => { }, false);
                if (typeof testElement['on' + eventType] !== 'function') {
                    eventTypes.push(eventType);
                }
            }
        }

        return eventTypes;
    }

    getAttributes(): { [key: string]: string } {
        const attributes = {};
        const elementAttributes = this.element.attributes;

        for (let i = 0; i < elementAttributes.length; i++) {
            const attribute = elementAttributes[i];
            attributes[attribute.name] = attribute.value;
        }

        return attributes;
    }
}

export class Root extends CustomEventEmitter {
    _root: HTMLElement;
    _compiled: Array<cElement> = [];
    _routeDetector: RouteDetector;

    constructor(rootId: string) {
        super();
        const GenerateRandomName = (size: number): string => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;

            for (let i = 0; i < size; i++) {
                const randomIndex = Math.floor(Math.random() * charactersLength);
                result += characters.charAt(randomIndex);
            }

            return result;
        }

        let root = document.getElementById(rootId);
        if (!root) {
            throw new Error(`Error: Root is undefined. Element with ID ${rootId} does not exist`);
        } else {
            this._root = document.createElement("div");
            this._root.id = `_${GenerateRandomName(7)}root`;
            this._routeDetector = new RouteDetector();
            this._routeDetector.on("New_Route-like_object", (data: any) => {
                this.emit("new", data);
            })
        }
    }

    compileElements(elements: Array<cElement>) {
        for (let e of elements) {
            this.compileElement(e);
        }
    }

    compileElement(e: cElement) {
        if (!e.element) {
            e.generate();
        }
        this._compiled.push(e);
        this._root.appendChild(e.element);
    }

    recompileAll() {
        this._root.innerHTML = "";
        this.compileElements(this._compiled);
    }
}

export class Router extends cElement {
    dest: string;
    text: string;
    onchange: Function = () => { };

    constructor() {
        super([], '', []);
        this.on("click", (e) => {
            this.onchange(e);
        })
        let attrs = this.getAttributes();
        for (let [key, value] of Object.entries(attrs)) {
            if (key.toLowerCase() == "dest") {
                this.dest = value;
            } else if (key.toLowerCase() == "text") {
                this.text = value;
            }
        }
        if (!this.dest) {
            throw new Error("Router tag requires a 'dest' attribute of type string, got undefined");
        }
    }
}

export class Route extends cElement {
    dest: string;
    text: string;

    constructor() {
        super([], '', []);
        this.on("click", (e) => {
            this.redirect();
        })
        let attrs = this.getAttributes();
        for (let [key, value] of Object.entries(attrs)) {
            if (key.toLowerCase() == "dest") {
                this.dest = value;
            } else if (key.toLowerCase() == "text") {
                this.text = value;
            }
        }
        if (!this.dest) {
            throw new Error("Route tag requires a 'dest' attribute of type string, got undefined");
        }
    }

    redirect() {
        // Should be a DOM-wide event fired 'route-change' that includes the new 'dest'
    }
}

export class div extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class p extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
        this.type = "p";
    }
}

export class a extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
        this.type = "a";
    }
}

export class meta extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class title extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class link extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}


export class style extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}
export class script extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}
export class base extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class header extends cElement {
    hValue: number;
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = [], hValue: number = 1) {
        super(classList, id, children);
        this.hValue = hValue;
    }
}

export class br extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class hr extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class span extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}
export class img extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class ul extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class li extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class ol extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class table extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class form extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class input extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class textarea extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class button extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class label extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class select extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class option extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class fieldset extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class legend extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class radio extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class checkbox extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class submit extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class blockquote extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class pre extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class code extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class em extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class strong extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class small extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class cite extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class q extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class abbr extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class mark extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class ins extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class time extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}

export class address extends cElement {
    constructor(classList: Array<string> = [], id: string = '', children: Array<cElement> = []) {
        super(classList, id, children);
    }
}