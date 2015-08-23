import { ConnectionBackend, Connection } from '../interfaces';
import { ReadyStates } from '../enums';
import { Request } from '../static_request';
import { ResponseOptions } from '../base_response_options';
import { BrowserXhr } from './browser_xhr';
import { EventEmitter } from 'angular2/src/facade/async';
/**
 * Creates connections using `XMLHttpRequest`. Given a fully-qualified
 * request, an `XHRConnection` will immediately create an `XMLHttpRequest` object and send the
 * request.
 *
 * This class would typically not be created or interacted with directly inside applications, though
 * the {@link MockConnection} may be interacted with in tests.
 */
export declare class XHRConnection implements Connection {
    request: Request;
    /**
     * Response {@link EventEmitter} which emits a single {@link Response} value on load event of
     * `XMLHttpRequest`.
     */
    response: EventEmitter;
    readyState: ReadyStates;
    private _xhr;
    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions);
    /**
     * Calls abort on the underlying XMLHttpRequest.
     */
    dispose(): void;
}
/**
 * Creates {@link XHRConnection} instances.
 *
 * This class would typically not be used by end users, but could be
 * overridden if a different backend implementation should be used,
 * such as in a node backend.
 *
 * #Example
 *
 * ```
 * import {Http, MyNodeBackend, httpInjectables, BaseRequestOptions} from 'angular2/http';
 * @Component({
 *   viewBindings: [
 *     httpInjectables,
 *     bind(Http).toFactory((backend, options) => {
 *       return new Http(backend, options);
 *     }, [MyNodeBackend, BaseRequestOptions])]
 * })
 * class MyComponent {
 *   constructor(http:Http) {
 *     http('people.json').subscribe(res => this.people = res.json());
 *   }
 * }
 * ```
 *
 **/
export declare class XHRBackend implements ConnectionBackend {
    private _browserXHR;
    private _baseResponseOptions;
    constructor(_browserXHR: BrowserXhr, _baseResponseOptions: ResponseOptions);
    createConnection(request: Request): XHRConnection;
}
