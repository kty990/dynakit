export class CustomEventEmitter {
    private events: Record<string, EventListener[]> = {};

    constructor() { }

    on(channel: string, listener: EventListener) {
        if (!this.events[channel]) {
            this.events[channel] = [];
        }
        this.events[channel].push(listener);
    }

    off(channel: string, listener: EventListener) {
        if (this.events[channel] && this.events[channel].indexOf(listener) !== -1) {
            this.events[channel].splice(this.events[channel].indexOf(listener));
        }
    }

    emit(channel: string, data: any) {
        const listeners = this.events[channel];
        if (listeners) {
            for (const listener of listeners) {
                listener(data);
            }
        }
    }
}
