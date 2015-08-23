/* */ 
"format cjs";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injector, Injectable } from 'angular2/di';
import { ListWrapper, MapWrapper } from 'angular2/src/facade/collection';
import * as eli from './element_injector';
import { isPresent, isBlank } from 'angular2/src/facade/lang';
import * as viewModule from './view';
import { internalView } from './view_ref';
import { ElementRef } from './element_ref';
import { TemplateRef } from './template_ref';
import { Pipes } from 'angular2/src/core/pipes/pipes';
import { ViewType } from 'angular2/src/render/api';
export let AppViewManagerUtils = class {
    constructor() {
    }
    getComponentInstance(parentView, boundElementIndex) {
        var eli = parentView.elementInjectors[boundElementIndex];
        return eli.getComponent();
    }
    createView(mergedParentViewProto, renderViewWithFragments, viewManager, renderer) {
        var renderFragments = renderViewWithFragments.fragmentRefs;
        var renderView = renderViewWithFragments.viewRef;
        var elementCount = mergedParentViewProto.mergeMapping.renderElementIndices.length;
        var viewCount = mergedParentViewProto.mergeMapping.nestedViewCountByViewIndex[0] + 1;
        var elementRefs = ListWrapper.createFixedSize(elementCount);
        var viewContainers = ListWrapper.createFixedSize(elementCount);
        var preBuiltObjects = ListWrapper.createFixedSize(elementCount);
        var elementInjectors = ListWrapper.createFixedSize(elementCount);
        var views = ListWrapper.createFixedSize(viewCount);
        var elementOffset = 0;
        var textOffset = 0;
        var fragmentIdx = 0;
        for (var viewOffset = 0; viewOffset < viewCount; viewOffset++) {
            var hostElementIndex = mergedParentViewProto.mergeMapping.hostElementIndicesByViewIndex[viewOffset];
            var parentView = isPresent(hostElementIndex) ?
                internalView(elementRefs[hostElementIndex].parentView) :
                null;
            var protoView = isPresent(hostElementIndex) ?
                parentView.proto.elementBinders[hostElementIndex - parentView.elementOffset]
                    .nestedProtoView :
                mergedParentViewProto;
            var renderFragment = null;
            if (viewOffset === 0 || protoView.type === ViewType.EMBEDDED) {
                renderFragment = renderFragments[fragmentIdx++];
            }
            var currentView = new viewModule.AppView(renderer, protoView, mergedParentViewProto.mergeMapping, viewOffset, elementOffset, textOffset, protoView.protoLocals, renderView, renderFragment);
            views[viewOffset] = currentView;
            var rootElementInjectors = [];
            for (var binderIdx = 0; binderIdx < protoView.elementBinders.length; binderIdx++) {
                var binder = protoView.elementBinders[binderIdx];
                var boundElementIndex = elementOffset + binderIdx;
                var elementInjector = null;
                // elementInjectors and rootElementInjectors
                var protoElementInjector = binder.protoElementInjector;
                if (isPresent(protoElementInjector)) {
                    if (isPresent(protoElementInjector.parent)) {
                        var parentElementInjector = elementInjectors[elementOffset + protoElementInjector.parent.index];
                        elementInjector = protoElementInjector.instantiate(parentElementInjector);
                    }
                    else {
                        elementInjector = protoElementInjector.instantiate(null);
                        rootElementInjectors.push(elementInjector);
                    }
                }
                elementInjectors[boundElementIndex] = elementInjector;
                // elementRefs
                var el = new ElementRef(currentView.ref, boundElementIndex, mergedParentViewProto.mergeMapping.renderElementIndices[boundElementIndex], renderer);
                elementRefs[el.boundElementIndex] = el;
                // preBuiltObjects
                if (isPresent(elementInjector)) {
                    var templateRef = binder.hasEmbeddedProtoView() ? new TemplateRef(el) : null;
                    preBuiltObjects[boundElementIndex] =
                        new eli.PreBuiltObjects(viewManager, currentView, el, templateRef);
                }
            }
            currentView.init(protoView.protoChangeDetector.instantiate(currentView), elementInjectors, rootElementInjectors, preBuiltObjects, views, elementRefs, viewContainers);
            if (isPresent(parentView) && protoView.type === ViewType.COMPONENT) {
                parentView.changeDetector.addShadowDomChild(currentView.changeDetector);
            }
            elementOffset += protoView.elementBinders.length;
            textOffset += protoView.textBindingCount;
        }
        return views[0];
    }
    hydrateRootHostView(hostView, injector) {
        this._hydrateView(hostView, injector, null, new Object(), null);
    }
    // Misnomer: this method is attaching next to the view container.
    attachViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, view) {
        if (isBlank(contextView)) {
            contextView = parentView;
            contextBoundElementIndex = boundElementIndex;
        }
        parentView.changeDetector.addChild(view.changeDetector);
        var viewContainer = parentView.viewContainers[boundElementIndex];
        if (isBlank(viewContainer)) {
            viewContainer = new viewModule.AppViewContainer();
            parentView.viewContainers[boundElementIndex] = viewContainer;
        }
        ListWrapper.insert(viewContainer.views, atIndex, view);
        var elementInjector = contextView.elementInjectors[contextBoundElementIndex];
        var sibling;
        if (atIndex == 0) {
            sibling = elementInjector;
        }
        else {
            sibling = ListWrapper.last(viewContainer.views[atIndex - 1].rootElementInjectors);
        }
        for (var i = view.rootElementInjectors.length - 1; i >= 0; i--) {
            if (isPresent(elementInjector.parent)) {
                view.rootElementInjectors[i].linkAfter(elementInjector.parent, sibling);
            }
            else {
                contextView.rootElementInjectors.push(view.rootElementInjectors[i]);
            }
        }
    }
    detachViewInContainer(parentView, boundElementIndex, atIndex) {
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        view.changeDetector.remove();
        ListWrapper.removeAt(viewContainer.views, atIndex);
        for (var i = 0; i < view.rootElementInjectors.length; ++i) {
            var inj = view.rootElementInjectors[i];
            if (isPresent(inj.parent)) {
                inj.unlink();
            }
            else {
                var removeIdx = ListWrapper.indexOf(parentView.rootElementInjectors, inj);
                if (removeIdx >= 0) {
                    ListWrapper.removeAt(parentView.rootElementInjectors, removeIdx);
                }
            }
        }
    }
    hydrateViewInContainer(parentView, boundElementIndex, contextView, contextBoundElementIndex, atIndex, imperativelyCreatedBindings) {
        if (isBlank(contextView)) {
            contextView = parentView;
            contextBoundElementIndex = boundElementIndex;
        }
        var viewContainer = parentView.viewContainers[boundElementIndex];
        var view = viewContainer.views[atIndex];
        var elementInjector = contextView.elementInjectors[contextBoundElementIndex];
        var injector = isPresent(imperativelyCreatedBindings) ?
            Injector.fromResolvedBindings(imperativelyCreatedBindings) :
            null;
        this._hydrateView(view, injector, elementInjector.getHost(), contextView.context, contextView.locals);
    }
    _hydrateView(initView, imperativelyCreatedInjector, hostElementInjector, context, parentLocals) {
        var viewIdx = initView.viewOffset;
        var endViewOffset = viewIdx + initView.mainMergeMapping.nestedViewCountByViewIndex[viewIdx];
        while (viewIdx <= endViewOffset) {
            var currView = initView.views[viewIdx];
            var currProtoView = currView.proto;
            if (currView !== initView && currView.proto.type === ViewType.EMBEDDED) {
                // Don't hydrate components of embedded fragment views.
                viewIdx += initView.mainMergeMapping.nestedViewCountByViewIndex[viewIdx] + 1;
            }
            else {
                if (currView !== initView) {
                    // hydrate a nested component view
                    imperativelyCreatedInjector = null;
                    parentLocals = null;
                    var hostElementIndex = initView.mainMergeMapping.hostElementIndicesByViewIndex[viewIdx];
                    hostElementInjector = initView.elementInjectors[hostElementIndex];
                    context = hostElementInjector.getComponent();
                }
                currView.context = context;
                currView.locals.parent = parentLocals;
                var binders = currProtoView.elementBinders;
                for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
                    var boundElementIndex = binderIdx + currView.elementOffset;
                    var elementInjector = initView.elementInjectors[boundElementIndex];
                    if (isPresent(elementInjector)) {
                        elementInjector.hydrate(imperativelyCreatedInjector, hostElementInjector, currView.preBuiltObjects[boundElementIndex]);
                        this._populateViewLocals(currView, elementInjector, boundElementIndex);
                        this._setUpEventEmitters(currView, elementInjector, boundElementIndex);
                        this._setUpHostActions(currView, elementInjector, boundElementIndex);
                    }
                }
                var pipes = isPresent(hostElementInjector) ?
                    new Pipes(currView.proto.pipes, hostElementInjector.getInjector()) :
                    null;
                currView.changeDetector.hydrate(currView.context, currView.locals, currView, pipes);
                viewIdx++;
            }
        }
    }
    _populateViewLocals(view, elementInjector, boundElementIdx) {
        if (isPresent(elementInjector.getDirectiveVariableBindings())) {
            MapWrapper.forEach(elementInjector.getDirectiveVariableBindings(), (directiveIndex, name) => {
                if (isBlank(directiveIndex)) {
                    view.locals.set(name, view.elementRefs[boundElementIdx].nativeElement);
                }
                else {
                    view.locals.set(name, elementInjector.getDirectiveAtIndex(directiveIndex));
                }
            });
        }
    }
    _setUpEventEmitters(view, elementInjector, boundElementIndex) {
        var emitters = elementInjector.getEventEmitterAccessors();
        for (var directiveIndex = 0; directiveIndex < emitters.length; ++directiveIndex) {
            var directiveEmitters = emitters[directiveIndex];
            var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
            for (var eventIndex = 0; eventIndex < directiveEmitters.length; ++eventIndex) {
                var eventEmitterAccessor = directiveEmitters[eventIndex];
                eventEmitterAccessor.subscribe(view, boundElementIndex, directive);
            }
        }
    }
    _setUpHostActions(view, elementInjector, boundElementIndex) {
        var hostActions = elementInjector.getHostActionAccessors();
        for (var directiveIndex = 0; directiveIndex < hostActions.length; ++directiveIndex) {
            var directiveHostActions = hostActions[directiveIndex];
            var directive = elementInjector.getDirectiveAtIndex(directiveIndex);
            for (var index = 0; index < directiveHostActions.length; ++index) {
                var hostActionAccessor = directiveHostActions[index];
                hostActionAccessor.subscribe(view, boundElementIndex, directive);
            }
        }
    }
    dehydrateView(initView) {
        var endViewOffset = initView.viewOffset +
            initView.mainMergeMapping.nestedViewCountByViewIndex[initView.viewOffset];
        for (var viewIdx = initView.viewOffset; viewIdx <= endViewOffset; viewIdx++) {
            var currView = initView.views[viewIdx];
            if (currView.hydrated()) {
                if (isPresent(currView.locals)) {
                    currView.locals.clearValues();
                }
                currView.context = null;
                currView.changeDetector.dehydrate();
                var binders = currView.proto.elementBinders;
                for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
                    var eli = initView.elementInjectors[currView.elementOffset + binderIdx];
                    if (isPresent(eli)) {
                        eli.dehydrate();
                    }
                }
            }
        }
    }
};
AppViewManagerUtils = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], AppViewManagerUtils);
//# sourceMappingURL=view_manager_utils.js.map