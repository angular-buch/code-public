import { ChangeDetector, ProtoChangeDetector, ChangeDetectorDefinition } from './interfaces';
import { BindingRecord } from './binding_record';
import { ProtoRecord } from './proto_record';
export declare class DynamicProtoChangeDetector implements ProtoChangeDetector {
    private definition;
    _records: List<ProtoRecord>;
    constructor(definition: ChangeDetectorDefinition);
    instantiate(dispatcher: any): ChangeDetector;
    _createRecords(definition: ChangeDetectorDefinition): ProtoRecord[];
}
export declare class ProtoRecordBuilder {
    records: List<ProtoRecord>;
    constructor();
    add(b: BindingRecord, variableNames?: List<string>): void;
    _setArgumentToPureFunction(startIndex: number): void;
    _appendRecords(b: BindingRecord, variableNames: List<string>): void;
}
