/* */ 
'use strict';
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
var messaging_api_1 = require("../shared/messaging_api");
var async_1 = require("../../facade/async");
var message_bus_1 = require("../shared/message_bus");
var anchor_based_app_root_url_1 = require("../../services/anchor_based_app_root_url");
var di_1 = require("../../../di");
var WebWorkerSetup = (function() {
  function WebWorkerSetup(bus, anchorBasedAppRootUrl) {
    var rootUrl = anchorBasedAppRootUrl.value;
    var sink = bus.to(messaging_api_1.SETUP_CHANNEL);
    var source = bus.from(messaging_api_1.SETUP_CHANNEL);
    async_1.ObservableWrapper.subscribe(source, function(message) {
      if (message === "ready") {
        async_1.ObservableWrapper.callNext(sink, {"rootUrl": rootUrl});
      }
    });
  }
  WebWorkerSetup = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [message_bus_1.MessageBus, anchor_based_app_root_url_1.AnchorBasedAppRootUrl])], WebWorkerSetup);
  return WebWorkerSetup;
})();
exports.WebWorkerSetup = WebWorkerSetup;