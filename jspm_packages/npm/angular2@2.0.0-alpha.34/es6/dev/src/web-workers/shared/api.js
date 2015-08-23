/* */ 
"format cjs";
import { CONST_EXPR } from "angular2/src/facade/lang";
import { OpaqueToken } from "angular2/di";
export const ON_WEBWORKER = CONST_EXPR(new OpaqueToken('WebWorker.onWebWorker'));
export class WorkerElementRef {
    constructor(renderView, renderBoundElementIndex) {
        this.renderView = renderView;
        this.renderBoundElementIndex = renderBoundElementIndex;
    }
}
//# sourceMappingURL=api.js.map