/* */ 
"format cjs";
import { isPresent, isBlank, BaseException } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { ChangeDetectionUtil } from './change_detection_util';
import { ChangeDetectorRef } from './change_detector_ref';
import { ChangeDetectionError, ExpressionChangedAfterItHasBeenCheckedException, DehydratedException } from './exceptions';
import { CHECK_ONCE, CHECKED, DETACHED } from './constants';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
var _scope_check = wtfCreateScope(`ChangeDetector#check(ascii id, bool throwOnChange)`);
class _Context {
    constructor(element, componentElement, instance, context, locals, injector, expression) {
        this.element = element;
        this.componentElement = componentElement;
        this.instance = instance;
        this.context = context;
        this.locals = locals;
        this.injector = injector;
        this.expression = expression;
    }
}
export class AbstractChangeDetector {
    constructor(id, dispatcher, protos, directiveRecords, modeOnHydrate) {
        this.id = id;
        this.modeOnHydrate = modeOnHydrate;
        this.lightDomChildren = [];
        this.shadowDomChildren = [];
        // The names of the below fields must be kept in sync with codegen_name_util.ts or
        // change detection will fail.
        this.alreadyChecked = false;
        this.locals = null;
        this.mode = null;
        this.pipes = null;
        this.ref = new ChangeDetectorRef(this);
        this.directiveRecords = directiveRecords;
        this.dispatcher = dispatcher;
        this.protos = protos;
    }
    addChild(cd) {
        this.lightDomChildren.push(cd);
        cd.parent = this;
    }
    removeChild(cd) { ListWrapper.remove(this.lightDomChildren, cd); }
    addShadowDomChild(cd) {
        this.shadowDomChildren.push(cd);
        cd.parent = this;
    }
    removeShadowDomChild(cd) { ListWrapper.remove(this.shadowDomChildren, cd); }
    remove() { this.parent.removeChild(this); }
    detectChanges() { this.runDetectChanges(false); }
    checkNoChanges() { throw new BaseException("Not implemented"); }
    runDetectChanges(throwOnChange) {
        if (this.mode === DETACHED || this.mode === CHECKED)
            return;
        var s = _scope_check(this.id, throwOnChange);
        this.detectChangesInRecords(throwOnChange);
        this._detectChangesInLightDomChildren(throwOnChange);
        if (throwOnChange === false)
            this.callOnAllChangesDone();
        this._detectChangesInShadowDomChildren(throwOnChange);
        if (this.mode === CHECK_ONCE)
            this.mode = CHECKED;
        wtfLeave(s);
    }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `detectChangesInRecordsInternal` which does the work of detecting changes
    // and which this method will call.
    // This method expects that `detectChangesInRecordsInternal` will set the property
    // `this.firstProtoInCurrentBinding` to the selfIndex of the first proto record. This is to
    // facilitate error reporting.
    detectChangesInRecords(throwOnChange) {
        if (!this.hydrated()) {
            this.throwDehydratedError();
        }
        try {
            this.detectChangesInRecordsInternal(throwOnChange);
        }
        catch (e) {
            this._throwError(e, e.stack);
        }
    }
    // Subclasses should override this method to perform any work necessary to detect and report
    // changes. For example, changes should be reported via `ChangeDetectionUtil.addChange`, lifecycle
    // methods should be called, etc.
    // This implementation should also set `this.firstProtoInCurrentBinding` to the selfIndex of the
    // first proto record
    // to facilitate error reporting. See {@link #detectChangesInRecords}.
    detectChangesInRecordsInternal(throwOnChange) { }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `hydrateDirectives`.
    hydrate(context, locals, directives, pipes) {
        this.mode = this.modeOnHydrate;
        this.context = context;
        this.locals = locals;
        this.pipes = pipes;
        this.hydrateDirectives(directives);
        this.alreadyChecked = false;
    }
    // Subclasses should override this method to hydrate any directives.
    hydrateDirectives(directives) { }
    // This method is not intended to be overridden. Subclasses should instead provide an
    // implementation of `dehydrateDirectives`.
    dehydrate() {
        this.dehydrateDirectives(true);
        this.context = null;
        this.locals = null;
        this.pipes = null;
    }
    // Subclasses should override this method to dehydrate any directives. This method should reverse
    // any work done in `hydrateDirectives`.
    dehydrateDirectives(destroyPipes) { }
    hydrated() { return this.context !== null; }
    callOnAllChangesDone() { this.dispatcher.notifyOnAllChangesDone(); }
    _detectChangesInLightDomChildren(throwOnChange) {
        var c = this.lightDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i].runDetectChanges(throwOnChange);
        }
    }
    _detectChangesInShadowDomChildren(throwOnChange) {
        var c = this.shadowDomChildren;
        for (var i = 0; i < c.length; ++i) {
            c[i].runDetectChanges(throwOnChange);
        }
    }
    markAsCheckOnce() { this.mode = CHECK_ONCE; }
    markPathToRootAsCheckOnce() {
        var c = this;
        while (isPresent(c) && c.mode != DETACHED) {
            if (c.mode === CHECKED)
                c.mode = CHECK_ONCE;
            c = c.parent;
        }
    }
    notifyDispatcher(value) {
        this.dispatcher.notifyOnBinding(this._currentBinding(), value);
    }
    addChange(changes, oldValue, newValue) {
        if (isBlank(changes)) {
            changes = {};
        }
        changes[this._currentBinding().propertyName] =
            ChangeDetectionUtil.simpleChange(oldValue, newValue);
        return changes;
    }
    _throwError(exception, stack) {
        var proto = this._currentBindingProto();
        var c = this.dispatcher.getDebugContext(proto.bindingRecord.elementIndex, proto.directiveIndex);
        var context = isPresent(c) ? new _Context(c.element, c.componentElement, c.directive, c.context, c.locals, c.injector, proto.expressionAsString) :
            null;
        throw new ChangeDetectionError(proto, exception, stack, context);
    }
    throwOnChangeError(oldValue, newValue) {
        var change = ChangeDetectionUtil.simpleChange(oldValue, newValue);
        throw new ExpressionChangedAfterItHasBeenCheckedException(this._currentBindingProto(), change, null);
    }
    throwDehydratedError() { throw new DehydratedException(); }
    _currentBinding() { return this._currentBindingProto().bindingRecord; }
    _currentBindingProto() {
        return ChangeDetectionUtil.protoByIndex(this.protos, this.firstProtoInCurrentBinding);
    }
}
//# sourceMappingURL=abstract_change_detector.js.map