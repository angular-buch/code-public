/* */ 
'use strict';
var lang_1 = require("../../facade/lang");
var di_1 = require("../../../di");
exports.ON_WEBWORKER = lang_1.CONST_EXPR(new di_1.OpaqueToken('WebWorker.onWebWorker'));
var WorkerElementRef = (function() {
  function WorkerElementRef(renderView, renderBoundElementIndex) {
    this.renderView = renderView;
    this.renderBoundElementIndex = renderBoundElementIndex;
  }
  return WorkerElementRef;
})();
exports.WorkerElementRef = WorkerElementRef;
