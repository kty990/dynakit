import { CustomEventEmitter } from './event';

export class RouteDetector extends CustomEventEmitter {
    constructor() {
        super();
        const targetElement = document.querySelector("Root"); // Replace with your desired class name

        let routes: Array<{ [key: string]: Node }> = [];
        if (targetElement) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        // Child elements were added to the target element
                        mutation.addedNodes.forEach(node => {
                            if (node instanceof Element) {
                                const tagName = node.tagName; // Get the tag name in uppercase
                                if (tagName == "ROUTE" || tagName == "ROUTER") {
                                    this.emit("New_Route-like_object", { type: tagName, element: node });
                                    routes.push({ "element": node });
                                }
                            }
                        })
                    }
                }
            });

            const config = { childList: true };
            observer.observe(targetElement, config);
        } else {
            console.error("Target element not found.");
        }
    }

}