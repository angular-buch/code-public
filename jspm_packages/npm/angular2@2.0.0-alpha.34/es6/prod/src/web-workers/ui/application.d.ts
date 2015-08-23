import { MessageBus, MessageBusSource, MessageBusSink, SourceListener } from "angular2/src/web-workers/shared/message_bus";
/**
 * Bootstrapping a WebWorker
 *
 * You instantiate a WebWorker application by calling bootstrap with the URI of your worker's index
 * script
 * Note: The WebWorker script must call bootstrapWebworker once it is set up to complete the
 * bootstrapping process
 */
export declare function bootstrap(uri: string): void;
export declare function spawnWorker(uri: string): MessageBus;
export declare class UIMessageBus implements MessageBus {
    sink: UIMessageBusSink;
    source: UIMessageBusSource;
    constructor(sink: UIMessageBusSink, source: UIMessageBusSource);
}
export declare class UIMessageBusSink implements MessageBusSink {
    private _worker;
    constructor(_worker: Worker);
    send(message: Object): void;
}
export declare class UIMessageBusSource implements MessageBusSource {
    private _worker;
    private _listenerStore;
    private _numListeners;
    constructor(_worker: Worker);
    addListener(fn: SourceListener): int;
    removeListener(index: int): void;
}
