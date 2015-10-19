/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var lang_1 = require('../facade/lang');
var metadata_1 = require('../di/metadata');
var change_detection_1 = require('../change_detection');
var DirectiveMetadata = (function(_super) {
  __extends(DirectiveMetadata, _super);
  function DirectiveMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        inputs = _b.inputs,
        outputs = _b.outputs,
        properties = _b.properties,
        events = _b.events,
        host = _b.host,
        bindings = _b.bindings,
        exportAs = _b.exportAs,
        moduleId = _b.moduleId,
        queries = _b.queries;
    _super.call(this);
    this.selector = selector;
    this.inputs = inputs;
    this.outputs = outputs;
    this.host = host;
    this.properties = properties;
    this.events = events;
    this.exportAs = exportAs;
    this.moduleId = moduleId;
    this.queries = queries;
    this.bindings = bindings;
  }
  DirectiveMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], DirectiveMetadata);
  return DirectiveMetadata;
})(metadata_1.InjectableMetadata);
exports.DirectiveMetadata = DirectiveMetadata;
var ComponentMetadata = (function(_super) {
  __extends(ComponentMetadata, _super);
  function ComponentMetadata(_a) {
    var _b = _a === void 0 ? {} : _a,
        selector = _b.selector,
        inputs = _b.inputs,
        outputs = _b.outputs,
        properties = _b.properties,
        events = _b.events,
        host = _b.host,
        exportAs = _b.exportAs,
        moduleId = _b.moduleId,
        bindings = _b.bindings,
        viewBindings = _b.viewBindings,
        _c = _b.changeDetection,
        changeDetection = _c === void 0 ? change_detection_1.ChangeDetectionStrategy.Default : _c,
        queries = _b.queries;
    _super.call(this, {
      selector: selector,
      inputs: inputs,
      outputs: outputs,
      properties: properties,
      events: events,
      host: host,
      exportAs: exportAs,
      moduleId: moduleId,
      bindings: bindings,
      queries: queries
    });
    this.changeDetection = changeDetection;
    this.viewBindings = viewBindings;
  }
  ComponentMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], ComponentMetadata);
  return ComponentMetadata;
})(DirectiveMetadata);
exports.ComponentMetadata = ComponentMetadata;
var PipeMetadata = (function(_super) {
  __extends(PipeMetadata, _super);
  function PipeMetadata(_a) {
    var name = _a.name,
        pure = _a.pure;
    _super.call(this);
    this.name = name;
    this._pure = pure;
  }
  Object.defineProperty(PipeMetadata.prototype, "pure", {
    get: function() {
      return lang_1.isPresent(this._pure) ? this._pure : true;
    },
    enumerable: true,
    configurable: true
  });
  PipeMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Object])], PipeMetadata);
  return PipeMetadata;
})(metadata_1.InjectableMetadata);
exports.PipeMetadata = PipeMetadata;
var InputMetadata = (function() {
  function InputMetadata(bindingPropertyName) {
    this.bindingPropertyName = bindingPropertyName;
  }
  InputMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], InputMetadata);
  return InputMetadata;
})();
exports.InputMetadata = InputMetadata;
var OutputMetadata = (function() {
  function OutputMetadata(bindingPropertyName) {
    this.bindingPropertyName = bindingPropertyName;
  }
  OutputMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], OutputMetadata);
  return OutputMetadata;
})();
exports.OutputMetadata = OutputMetadata;
var HostBindingMetadata = (function() {
  function HostBindingMetadata(hostPropertyName) {
    this.hostPropertyName = hostPropertyName;
  }
  HostBindingMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String])], HostBindingMetadata);
  return HostBindingMetadata;
})();
exports.HostBindingMetadata = HostBindingMetadata;
var HostListenerMetadata = (function() {
  function HostListenerMetadata(eventName, args) {
    this.eventName = eventName;
    this.args = args;
  }
  HostListenerMetadata = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [String, Array])], HostListenerMetadata);
  return HostListenerMetadata;
})();
exports.HostListenerMetadata = HostListenerMetadata;
