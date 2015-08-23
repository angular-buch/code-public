/* */ 
'use strict';
var collection_1 = require("../facade/collection");
var lang_1 = require("../facade/lang");
var RouteParams = (function() {
  function RouteParams(params) {
    this.params = params;
  }
  RouteParams.prototype.get = function(param) {
    return lang_1.normalizeBlank(collection_1.StringMapWrapper.get(this.params, param));
  };
  return RouteParams;
})();
exports.RouteParams = RouteParams;
var Instruction = (function() {
  function Instruction(component, capturedUrl, _recognizer, child, _params) {
    if (child === void 0) {
      child = null;
    }
    if (_params === void 0) {
      _params = null;
    }
    this.component = component;
    this.capturedUrl = capturedUrl;
    this._recognizer = _recognizer;
    this.child = child;
    this._params = _params;
    this.reuse = false;
    this.accumulatedUrl = capturedUrl;
    this.specificity = _recognizer.specificity;
    if (lang_1.isPresent(child)) {
      this.child = child;
      this.specificity += child.specificity;
      var childUrl = child.accumulatedUrl;
      if (lang_1.isPresent(childUrl)) {
        this.accumulatedUrl += childUrl;
      }
    }
  }
  Instruction.prototype.params = function() {
    if (lang_1.isBlank(this._params)) {
      this._params = this._recognizer.parseParams(this.capturedUrl);
    }
    return this._params;
  };
  return Instruction;
})();
exports.Instruction = Instruction;
