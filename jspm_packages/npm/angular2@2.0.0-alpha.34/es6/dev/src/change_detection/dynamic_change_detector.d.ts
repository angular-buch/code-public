import { AbstractChangeDetector } from './abstract_change_detector';
import { BindingRecord } from './binding_record';
import { SimpleChange } from './change_detection_util';
import { ProtoRecord } from './proto_record';
export declare class DynamicChangeDetector extends AbstractChangeDetector<any> {
    values: List<any>;
    changes: List<any>;
    localPipes: List<any>;
    prevContexts: List<any>;
    directives: any;
    constructor(id: string, changeDetectionStrategy: string, dispatcher: any, protos: List<ProtoRecord>, directiveRecords: List<any>);
    hydrateDirectives(directives: any): void;
    dehydrateDirectives(destroyPipes: boolean): void;
    _destroyPipes(): void;
    checkNoChanges(): void;
    detectChangesInRecordsInternal(throwOnChange: boolean): void;
    _firstInBinding(r: ProtoRecord): boolean;
    callOnAllChangesDone(): void;
    _updateDirectiveOrElement(change: any, bindingRecord: any): void;
    _addChange(bindingRecord: BindingRecord, change: any, changes: any): any;
    _getDirectiveFor(directiveIndex: any): any;
    _getDetectorFor(directiveIndex: any): any;
    _check(proto: ProtoRecord, throwOnChange: boolean): SimpleChange;
    _referenceCheck(proto: ProtoRecord, throwOnChange: boolean): SimpleChange;
    _calculateCurrValue(proto: ProtoRecord): any;
    _pipeCheck(proto: ProtoRecord, throwOnChange: boolean): SimpleChange;
    _pipeFor(proto: ProtoRecord, context: any): any;
    _readContext(proto: ProtoRecord): any;
    _readSelf(proto: ProtoRecord): any;
    _writeSelf(proto: ProtoRecord, value: any): void;
    _readPipe(proto: ProtoRecord): any;
    _writePipe(proto: ProtoRecord, value: any): void;
    _setChanged(proto: ProtoRecord, value: boolean): void;
    _pureFuncAndArgsDidNotChange(proto: ProtoRecord): boolean;
    _argsChanged(proto: ProtoRecord): boolean;
    _readArgs(proto: ProtoRecord): List<any>;
}
