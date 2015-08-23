/* */ 
"format cjs";
import { BaseException, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { AbstractChangeDetector } from './abstract_change_detector';
import { ChangeDetectionUtil } from './change_detection_util';
import { CodegenNameUtil, sanitizeName } from './codegen_name_util';
import { CodegenLogicUtil } from './codegen_logic_util';
/**
 * The code generator takes a list of proto records and creates a function/class
 * that "emulates" what the developer would write by hand to implement the same
 * kind of behaviour.
 *
 * This code should be kept in sync with the Dart transformer's
 * `angular2.transform.template_compiler.change_detector_codegen` library. If you make updates
 * here, please make equivalent changes there.
*/
var ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
var UTIL = "ChangeDetectionUtil";
var IS_CHANGED_LOCAL = "isChanged";
var CHANGES_LOCAL = "changes";
export class ChangeDetectorJITGenerator {
    constructor(id, changeDetectionStrategy, records, directiveRecords, generateCheckNoChanges) {
        this.id = id;
        this.changeDetectionStrategy = changeDetectionStrategy;
        this.records = records;
        this.directiveRecords = directiveRecords;
        this.generateCheckNoChanges = generateCheckNoChanges;
        this._names = new CodegenNameUtil(this.records, this.directiveRecords, UTIL);
        this._logic = new CodegenLogicUtil(this._names, UTIL);
        this._typeName = sanitizeName(`ChangeDetector_${this.id}`);
    }
    generate() {
        var classDefinition = `
      var ${this._typeName} = function ${this._typeName}(dispatcher, protos, directiveRecords) {
        ${ABSTRACT_CHANGE_DETECTOR}.call(
            this, ${JSON.stringify(this.id)}, dispatcher, protos, directiveRecords,
            "${ChangeDetectionUtil.changeDetectionMode(this.changeDetectionStrategy)}");
        this.dehydrateDirectives(false);
      }

      ${this._typeName}.prototype = Object.create(${ABSTRACT_CHANGE_DETECTOR}.prototype);

      ${this._typeName}.prototype.detectChangesInRecordsInternal = function(throwOnChange) {
        ${this._names.genInitLocals()}
        var ${IS_CHANGED_LOCAL} = false;
        var ${CHANGES_LOCAL} = null;

        ${this.records.map((r) => this._genRecord(r)).join("\n")}

        ${this._names.getAlreadyCheckedName()} = true;
      }

      ${this._genCheckNoChanges()}

      ${this._maybeGenCallOnAllChangesDone()}

      ${this._maybeGenHydrateDirectives()}

      ${this._maybeGenDehydrateDirectives()}

      return function(dispatcher) {
        return new ${this._typeName}(dispatcher, protos, directiveRecords);
      }
    `;
        return new Function('AbstractChangeDetector', 'ChangeDetectionUtil', 'protos', 'directiveRecords', classDefinition)(AbstractChangeDetector, ChangeDetectionUtil, this.records, this.directiveRecords);
    }
    _maybeGenDehydrateDirectives() {
        var destroyPipesCode = this._names.genPipeOnDestroy();
        if (destroyPipesCode) {
            destroyPipesCode = `if (destroyPipes) { ${destroyPipesCode} }`;
        }
        var dehydrateFieldsCode = this._names.genDehydrateFields();
        if (!destroyPipesCode && !dehydrateFieldsCode)
            return '';
        return `${this._typeName}.prototype.dehydrateDirectives = function(destroyPipes) {
        ${destroyPipesCode}
        ${dehydrateFieldsCode}
    }`;
    }
    _maybeGenHydrateDirectives() {
        var hydrateDirectivesCode = this._genHydrateDirectives();
        var hydrateDetectorsCode = this._genHydrateDetectors();
        if (!hydrateDirectivesCode && !hydrateDetectorsCode)
            return '';
        return `${this._typeName}.prototype.hydrateDirectives = function(directives) {
      ${hydrateDirectivesCode}
      ${hydrateDetectorsCode}
    }`;
    }
    _genHydrateDirectives() {
        var directiveFieldNames = this._names.getAllDirectiveNames();
        var lines = ListWrapper.createFixedSize(directiveFieldNames.length);
        for (var i = 0, iLen = directiveFieldNames.length; i < iLen; ++i) {
            lines[i] = `${directiveFieldNames[i]} = directives.getDirectiveFor(
          ${this._names.getDirectivesAccessorName()}[${i}].directiveIndex);`;
        }
        return lines.join('\n');
    }
    _genHydrateDetectors() {
        var detectorFieldNames = this._names.getAllDetectorNames();
        var lines = ListWrapper.createFixedSize(detectorFieldNames.length);
        for (var i = 0, iLen = detectorFieldNames.length; i < iLen; ++i) {
            lines[i] = `${detectorFieldNames[i]} = directives.getDetectorFor(
          ${this._names.getDirectivesAccessorName()}[${i}].directiveIndex);`;
        }
        return lines.join('\n');
    }
    _maybeGenCallOnAllChangesDone() {
        var notifications = [];
        var dirs = this.directiveRecords;
        // NOTE(kegluneq): Order is important!
        for (var i = dirs.length - 1; i >= 0; --i) {
            var dir = dirs[i];
            if (dir.callOnAllChangesDone) {
                notifications.push(`${this._names.getDirectiveName(dir.directiveIndex)}.onAllChangesDone();`);
            }
        }
        if (notifications.length > 0) {
            var directiveNotifications = notifications.join("\n");
            return `
        ${this._typeName}.prototype.callOnAllChangesDone = function() {
          ${ABSTRACT_CHANGE_DETECTOR}.prototype.callOnAllChangesDone.call(this);
          ${directiveNotifications}
        }
      `;
        }
        else {
            return '';
        }
    }
    _genRecord(r) {
        var rec;
        if (r.isLifeCycleRecord()) {
            rec = this._genDirectiveLifecycle(r);
        }
        else if (r.isPipeRecord()) {
            rec = this._genPipeCheck(r);
        }
        else {
            rec = this._genReferenceCheck(r);
        }
        return `
      ${this._maybeFirstInBinding(r)}
      ${rec}
      ${this._maybeGenLastInDirective(r)}
    `;
    }
    _genDirectiveLifecycle(r) {
        if (r.name === "onCheck") {
            return this._genOnCheck(r);
        }
        else if (r.name === "onInit") {
            return this._genOnInit(r);
        }
        else if (r.name === "onChange") {
            return this._genOnChange(r);
        }
        else {
            throw new BaseException(`Unknown lifecycle event '${r.name}'`);
        }
    }
    _genPipeCheck(r) {
        var context = this._names.getLocalName(r.contextIndex);
        var argString = r.args.map((arg) => this._names.getLocalName(arg)).join(", ");
        var oldValue = this._names.getFieldName(r.selfIndex);
        var newValue = this._names.getLocalName(r.selfIndex);
        var pipe = this._names.getPipeName(r.selfIndex);
        var cdRef = "this.ref";
        var pipeType = r.name;
        var read = `
      if (${pipe} === ${UTIL}.uninitialized) {
        ${pipe} = ${this._names.getPipesAccessorName()}.get('${pipeType}', ${context}, ${cdRef});
      } else if (!${pipe}.supports(${context})) {
        ${pipe}.onDestroy();
        ${pipe} = ${this._names.getPipesAccessorName()}.get('${pipeType}', ${context}, ${cdRef});
      }
      ${newValue} = ${pipe}.transform(${context}, [${argString}]);
    `;
        var check = `
      if (${oldValue} !== ${newValue}) {
        ${newValue} = ${UTIL}.unwrapValue(${newValue})
        ${this._genChangeMarker(r)}
        ${this._genUpdateDirectiveOrElement(r)}
        ${this._genAddToChanges(r)}
        ${oldValue} = ${newValue};
      }
    `;
        return r.shouldBeChecked() ? `${read}${check}` : read;
    }
    _genReferenceCheck(r) {
        var oldValue = this._names.getFieldName(r.selfIndex);
        var newValue = this._names.getLocalName(r.selfIndex);
        var read = `
      ${this._logic.genUpdateCurrentValue(r)}
    `;
        var check = `
      if (${newValue} !== ${oldValue}) {
        ${this._genChangeMarker(r)}
        ${this._genUpdateDirectiveOrElement(r)}
        ${this._genAddToChanges(r)}
        ${oldValue} = ${newValue};
      }
    `;
        var genCode = r.shouldBeChecked() ? `${read}${check}` : read;
        if (r.isPureFunction()) {
            var condition = r.args.map((a) => this._names.getChangeName(a)).join(" || ");
            if (r.isUsedByOtherRecord()) {
                return `if (${condition}) { ${genCode} } else { ${newValue} = ${oldValue}; }`;
            }
            else {
                return `if (${condition}) { ${genCode} }`;
            }
        }
        else {
            return genCode;
        }
    }
    _genChangeMarker(r) {
        return r.argumentToPureFunction ? `${this._names.getChangeName(r.selfIndex)} = true` : ``;
    }
    _genUpdateDirectiveOrElement(r) {
        if (!r.lastInBinding)
            return "";
        var newValue = this._names.getLocalName(r.selfIndex);
        var oldValue = this._names.getFieldName(r.selfIndex);
        var br = r.bindingRecord;
        if (br.isDirective()) {
            var directiveProperty = `${this._names.getDirectiveName(br.directiveRecord.directiveIndex)}.${br.propertyName}`;
            return `
        ${this._genThrowOnChangeCheck(oldValue, newValue)}
        ${directiveProperty} = ${newValue};
        ${IS_CHANGED_LOCAL} = true;
      `;
        }
        else {
            return `
        ${this._genThrowOnChangeCheck(oldValue, newValue)}
        this.notifyDispatcher(${newValue});
      `;
        }
    }
    _genThrowOnChangeCheck(oldValue, newValue) {
        if (this.generateCheckNoChanges) {
            return `
        if(throwOnChange) {
          this.throwOnChangeError(${oldValue}, ${newValue});
        }
        `;
        }
        else {
            return '';
        }
    }
    _genCheckNoChanges() {
        if (this.generateCheckNoChanges) {
            return `${this._typeName}.prototype.checkNoChanges = function() { this.runDetectChanges(true); }`;
        }
        else {
            return '';
        }
    }
    _genAddToChanges(r) {
        var newValue = this._names.getLocalName(r.selfIndex);
        var oldValue = this._names.getFieldName(r.selfIndex);
        if (!r.bindingRecord.callOnChange())
            return "";
        return `${CHANGES_LOCAL} = this.addChange(${CHANGES_LOCAL}, ${oldValue}, ${newValue});`;
    }
    _maybeFirstInBinding(r) {
        var prev = ChangeDetectionUtil.protoByIndex(this.records, r.selfIndex - 1);
        var firstInBindng = isBlank(prev) || prev.bindingRecord !== r.bindingRecord;
        return firstInBindng ? `${this._names.getFirstProtoInCurrentBinding()} = ${r.selfIndex};` : '';
    }
    _maybeGenLastInDirective(r) {
        if (!r.lastInDirective)
            return "";
        return `
      ${CHANGES_LOCAL} = null;
      ${this._genNotifyOnPushDetectors(r)}
      ${IS_CHANGED_LOCAL} = false;
    `;
    }
    _genOnCheck(r) {
        var br = r.bindingRecord;
        return `if (!throwOnChange) ${this._names.getDirectiveName(br.directiveRecord.directiveIndex)}.onCheck();`;
    }
    _genOnInit(r) {
        var br = r.bindingRecord;
        return `if (!throwOnChange && !${this._names.getAlreadyCheckedName()}) ${this._names.getDirectiveName(br.directiveRecord.directiveIndex)}.onInit();`;
    }
    _genOnChange(r) {
        var br = r.bindingRecord;
        return `if (!throwOnChange && ${CHANGES_LOCAL}) ${this._names.getDirectiveName(br.directiveRecord.directiveIndex)}.onChange(${CHANGES_LOCAL});`;
    }
    _genNotifyOnPushDetectors(r) {
        var br = r.bindingRecord;
        if (!r.lastInDirective || !br.isOnPushChangeDetection())
            return "";
        var retVal = `
      if(${IS_CHANGED_LOCAL}) {
        ${this._names.getDetectorName(br.directiveRecord.directiveIndex)}.markAsCheckOnce();
      }
    `;
        return retVal;
    }
}
//# sourceMappingURL=change_detection_jit_generator.js.map