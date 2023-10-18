export class cArgument {
    name: string;
    value: any;
    constructor(name: string, value: any) {
        this.name = name;
        this.value = value;
    }
}

export class TweenInfo {
    width: string | undefined;
    height: string | undefined;
    color: string | undefined;
    backgroundColor: string | undefined;
    borderWidth: string | undefined;
    borderColor: string | undefined;
    borderRadius: string | undefined;
    left: string | undefined;
    top: string | undefined;
    right: string | undefined;
    bottom: string | undefined;
    transform: string | undefined;
    filter: string | undefined;

    duration: number = 1000; // ms

    state: number = -1;

    set: Array<string> = [];
    /*

        State:
            -1: Placeholder
            0: Initialized / Reset
            1: Playing
            2: Paused
            3: Error

     */

    constructor(...args: Array<cArgument>) {
        for (let arg of args) {
            if (arg.name in this) {
                this[arg.name] = arg.value;
                this.set.push(arg.name);
            }
        }
        this.state = 0;
    }
}

export class Tween {
    element: HTMLElement;
    differences: { [key: string]: number } = {};
    properties: TweenInfo;

    private animationFrameId: number | null = null;
    private startTime: number | null = null;

    constructor(element: HTMLElement, Properties: TweenInfo) {
        this.properties = Properties;
        this.element = element;
        for (const prop in Properties) {
            if (Properties.hasOwnProperty(prop)) {
                const propertyValue = Properties[prop];
                for (let name of Properties.set) {
                    let difference = this.GetDifference(this.element, name);
                    this.differences[name] = difference;
                }
            }
        }
    }

    play(): void {
        if (!this.animationFrameId) {
            // Only start the animation if it's not already running
            this.startTime = performance.now();
            this.animate();
        }
    }

    pause(): void {
        if (this.animationFrameId) {
            // Stop the animation if it's running
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
            this.startTime = null;
        }
    }

    private animate(): void {
        if (!this.startTime) {
            this.startTime = performance.now();
        }

        const currentTime = performance.now();
        const deltaTime = currentTime - this.startTime;

        for (const prop in this.properties) {
            if (this.properties.hasOwnProperty(prop)) {
                const initialValue = this.GetDifference(this.element, prop);
                const targetValue = this.properties[prop];

                if (typeof initialValue === 'number' && typeof targetValue === 'number') {
                    // Handle numeric properties with linear interpolation
                    const easedValue = this.ease(deltaTime, initialValue, targetValue, this.properties.duration);
                    this.element.style[prop] = `${easedValue}px`;
                } else if (typeof initialValue === 'string' && typeof targetValue === 'string') {
                    if (prop === 'color') {
                        // Handle color properties (assuming they are provided in hex format)
                        const easedValue = this.interpolateColor(initialValue, targetValue, deltaTime, this.properties.duration);
                        this.element.style[prop] = easedValue;
                    } else if (prop === 'rotate') {
                        // Handle rotation properties
                        const easedValue = this.interpolateRotation(initialValue, targetValue, deltaTime, this.properties.duration);
                        this.element.style.transform = `rotate(${easedValue}deg)`;
                    }
                }
            }
        }

        if (deltaTime < this.properties.duration) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationFrameId = null;
            this.startTime = null;
        }
    }

    // Implement an interpolation function for color properties
    private interpolateColor(startColor: string, endColor: string, currentTime: number, duration: number): string {
        // You would need to convert hex colors to RGB, interpolate the RGB values, and then convert back to hex
        // Here's a simplified example (you may need to handle color formats and edge cases differently):
        const startRGB = parseInt(startColor.slice(1), 16);
        const endRGB = parseInt(endColor.slice(1), 16);
        const interpolatedRGB = startRGB + (endRGB - startRGB) * (currentTime / duration);
        const interpolatedColor = `#${Math.round(interpolatedRGB).toString(16)}`;
        return interpolatedColor;
    }

    // Implement an interpolation function for rotation properties
    private interpolateRotation(startRotation: string, endRotation: string, currentTime: number, duration: number): number {
        const startAngle = parseFloat(startRotation);
        const endAngle = parseFloat(endRotation);
        return startAngle + (endAngle - startAngle) * (currentTime / duration);
    }


    private GetDifference(e0: HTMLElement, prop: string): number {
        const GetValue = (v: any) => {
            if (typeof v === 'string') {
                const match = v.match(/([-+]?[0-9]*\.?[0-9]+)([a-zA-Z%]*)/);

                if (match) {
                    const numericalValue = parseFloat(match[1]);
                    const unit = match[2];

                    switch (unit) {
                        case 'px':
                            return numericalValue;
                        case '%':
                            return numericalValue / 100;
                        case 'em':
                            // Conversion factor for em to pixels
                            const emToPixels = 16; // 1em = 16px (default for many browsers)
                            return numericalValue * emToPixels;
                        case 'rem':
                            // Conversion factor for rem to pixels
                            const remToPixels = 16; // 1rem = 16px (default for many browsers)
                            return numericalValue * remToPixels;
                        // Add other units as needed
                        default:
                            return NaN; // Different unit type; return NaN
                    }
                }
            }

            if (typeof v === 'number') {
                return v; // If it's already a number, return it as is.
            }

            return 0; // Default to 0 if the value can't be converted to a number.
        }


        let diff = GetValue(e0[prop]) - GetValue(this[prop]);
        return diff;
    }

    SetProperty(prop: string, value: any): void {
        this.properties[prop] = value;
        if (!this.properties.set.indexOf(prop)) {
            this.properties.set.push(prop);
        }
    }

    Reset(Properties: TweenInfo | undefined) {
        if (Properties) {
            for (const prop in Properties) {
                if (Properties.hasOwnProperty(prop)) {
                    const propertyValue = Properties[prop];
                    for (let name of Properties.set) {
                        let difference = this.GetDifference(this.element, name);
                        this.differences[name] = difference;
                    }
                }
            }
        } else {
            for (let name of this.properties.set) {
                let difference = this.GetDifference(this.element, name);
                this.differences[name] = difference;
            }
        }
    }

    private ease(t: number, b: number, c: number, d: number): number {
        return c * (t / d) + b;
    }
}
