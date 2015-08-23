/* */ 
"format cjs";
import * as ng from './angular2';
import * as router from './router';
var _prevNg = window.ng;
window.ng = ng;
ng.router = router;
/**
 * Calling noConflict will restore window.angular to its pre-angular loading state
 * and return the angular module object.
 */
ng.noConflict = function () {
    window.ng = _prevNg;
    return ng;
};
//# sourceMappingURL=angular2_sfx.js.map