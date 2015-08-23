/* */ 
"format cjs";
import { bind } from 'angular2/di';
import { Http, Jsonp } from 'angular2/src/http/http';
import { XHRBackend } from 'angular2/src/http/backends/xhr_backend';
import { JSONPBackend } from 'angular2/src/http/backends/jsonp_backend';
import { BrowserXhr } from 'angular2/src/http/backends/browser_xhr';
import { BrowserJsonp } from 'angular2/src/http/backends/browser_jsonp';
import { BaseRequestOptions, RequestOptions } from 'angular2/src/http/base_request_options';
import { ConnectionBackend } from 'angular2/src/http/interfaces';
import { BaseResponseOptions, ResponseOptions } from 'angular2/src/http/base_response_options';
export { MockConnection, MockBackend } from 'angular2/src/http/backends/mock_backend';
export { Request } from 'angular2/src/http/static_request';
export { Response } from 'angular2/src/http/static_response';
export { Connection, ConnectionBackend } from 'angular2/src/http/interfaces';
export { BrowserXhr } from 'angular2/src/http/backends/browser_xhr';
export { BaseRequestOptions, RequestOptions } from 'angular2/src/http/base_request_options';
export { BaseResponseOptions, ResponseOptions } from 'angular2/src/http/base_response_options';
export { XHRBackend, XHRConnection } from 'angular2/src/http/backends/xhr_backend';
export { JSONPBackend, JSONPConnection } from 'angular2/src/http/backends/jsonp_backend';
export { Http, Jsonp } from 'angular2/src/http/http';
export { Headers } from 'angular2/src/http/headers';
export { ResponseTypes, ReadyStates, RequestMethods, RequestCredentialsOpts, RequestCacheOpts, RequestModesOpts } from 'angular2/src/http/enums';
export { URLSearchParams } from 'angular2/src/http/url_search_params';
/**
 * Provides a basic set of injectables to use the {@link Http} service in any application.
 *
 * #Example
 *
 * ```
 * import {httpInjectables, Http} from 'angular2/http';
 * @Component({selector: 'http-app', viewBindings: [httpInjectables]})
 * @View({template: '{{data}}'})
 * class MyApp {
 *   constructor(http:Http) {
 *     http.request('data.txt').subscribe(res => this.data = res.text());
 *   }
 * }
 * ```
 *
 */
export var httpInjectables = [
    bind(ConnectionBackend)
        .toClass(XHRBackend),
    BrowserXhr,
    bind(RequestOptions).toClass(BaseRequestOptions),
    bind(ResponseOptions).toClass(BaseResponseOptions),
    Http
];
export var jsonpInjectables = [
    bind(ConnectionBackend)
        .toClass(JSONPBackend),
    BrowserJsonp,
    bind(RequestOptions).toClass(BaseRequestOptions),
    bind(ResponseOptions).toClass(BaseResponseOptions),
    Jsonp
];
//# sourceMappingURL=http.js.map