/* */ 
'use strict';
var lang_1 = require("../facade/lang");
var collection_1 = require("../facade/collection");
var path_recognizer_1 = require("./path_recognizer");
var route_config_impl_1 = require("./route_config_impl");
var async_route_handler_1 = require("./async_route_handler");
var sync_route_handler_1 = require("./sync_route_handler");
var helpers_1 = require("./helpers");
var RouteRecognizer = (function() {
  function RouteRecognizer(isRoot) {
    if (isRoot === void 0) {
      isRoot = false;
    }
    this.isRoot = isRoot;
    this.names = new collection_1.Map();
    this.redirects = new collection_1.Map();
    this.matchers = new collection_1.Map();
  }
  RouteRecognizer.prototype.config = function(config) {
    var handler;
    if (config instanceof route_config_impl_1.Redirect) {
      var path = config.path == '/' ? '' : config.path;
      this.redirects.set(path, config.redirectTo);
      return true;
    } else if (config instanceof route_config_impl_1.Route) {
      handler = new sync_route_handler_1.SyncRouteHandler(config.component);
    } else if (config instanceof route_config_impl_1.AsyncRoute) {
      handler = new async_route_handler_1.AsyncRouteHandler(config.loader);
    }
    var recognizer = new path_recognizer_1.PathRecognizer(config.path, handler, this.isRoot);
    collection_1.MapWrapper.forEach(this.matchers, function(matcher, _) {
      if (recognizer.regex.toString() == matcher.regex.toString()) {
        throw new lang_1.BaseException("Configuration '" + config.path + "' conflicts with existing route '" + matcher.path + "'");
      }
    });
    this.matchers.set(recognizer.regex, recognizer);
    if (lang_1.isPresent(config.as)) {
      this.names.set(config.as, recognizer);
    }
    return recognizer.terminal;
  };
  RouteRecognizer.prototype.recognize = function(url) {
    var solutions = [];
    if (url.length > 0 && url[url.length - 1] == '/') {
      url = url.substring(0, url.length - 1);
    }
    collection_1.MapWrapper.forEach(this.redirects, function(target, path) {
      if (path == '/' || path == '') {
        if (path == url) {
          url = target;
        }
      } else if (url.startsWith(path)) {
        url = target + url.substring(path.length);
      }
    });
    var queryParams = collection_1.StringMapWrapper.create();
    var queryString = '';
    var queryIndex = url.indexOf('?');
    if (queryIndex >= 0) {
      queryString = url.substring(queryIndex + 1);
      url = url.substring(0, queryIndex);
    }
    if (this.isRoot && queryString.length > 0) {
      helpers_1.parseAndAssignParamString('&', queryString, queryParams);
    }
    collection_1.MapWrapper.forEach(this.matchers, function(pathRecognizer, regex) {
      var match;
      if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(regex, url))) {
        var matchedUrl = '/';
        var unmatchedUrl = '';
        if (url != '/') {
          matchedUrl = match[0];
          unmatchedUrl = url.substring(match[0].length);
        }
        var params = null;
        if (pathRecognizer.terminal && !collection_1.StringMapWrapper.isEmpty(queryParams)) {
          params = queryParams;
          matchedUrl += '?' + queryString;
        }
        solutions.push(new RouteMatch(pathRecognizer, matchedUrl, unmatchedUrl, params));
      }
    });
    return solutions;
  };
  RouteRecognizer.prototype.hasRoute = function(name) {
    return this.names.has(name);
  };
  RouteRecognizer.prototype.generate = function(name, params) {
    var pathRecognizer = this.names.get(name);
    if (lang_1.isBlank(pathRecognizer)) {
      return null;
    }
    var url = pathRecognizer.generate(params);
    return {
      url: url,
      'nextComponent': pathRecognizer.handler.componentType
    };
  };
  return RouteRecognizer;
})();
exports.RouteRecognizer = RouteRecognizer;
var RouteMatch = (function() {
  function RouteMatch(recognizer, matchedUrl, unmatchedUrl, p) {
    if (p === void 0) {
      p = null;
    }
    this.recognizer = recognizer;
    this.matchedUrl = matchedUrl;
    this.unmatchedUrl = unmatchedUrl;
    this._paramsParsed = false;
    this._params = lang_1.isPresent(p) ? p : collection_1.StringMapWrapper.create();
  }
  RouteMatch.prototype.params = function() {
    var _this = this;
    if (!this._paramsParsed) {
      this._paramsParsed = true;
      collection_1.StringMapWrapper.forEach(this.recognizer.parseParams(this.matchedUrl), function(value, key) {
        collection_1.StringMapWrapper.set(_this._params, key, value);
      });
    }
    return this._params;
  };
  return RouteMatch;
})();
exports.RouteMatch = RouteMatch;
function configObjToHandler(config) {
  if (lang_1.isType(config)) {
    return new sync_route_handler_1.SyncRouteHandler(config);
  } else if (lang_1.isStringMap(config)) {
    if (lang_1.isBlank(config['type'])) {
      throw new lang_1.BaseException("Component declaration when provided as a map should include a 'type' property");
    }
    var componentType = config['type'];
    if (componentType == 'constructor') {
      return new sync_route_handler_1.SyncRouteHandler(config['constructor']);
    } else if (componentType == 'loader') {
      return new async_route_handler_1.AsyncRouteHandler(config['loader']);
    } else {
      throw new lang_1.BaseException("oops");
    }
  }
  throw new lang_1.BaseException("Unexpected component \"" + config + "\".");
}
