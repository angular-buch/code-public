import { Parser } from 'angular2/src/change_detection/change_detection';
import { SelectorMatcher } from 'angular2/src/render/dom/compiler/selector';
import { CompileStep } from './compile_step';
import { CompileElement } from './compile_element';
import { CompileControl } from './compile_control';
import { DirectiveMetadata } from '../../api';
import { DirectiveBuilder, ElementBinderBuilder } from '../view/proto_view_builder';
/**
 * Parses the directives on a single element. Assumes ViewSplitter has already created
 * <template> elements for template directives.
 */
export declare class DirectiveParser implements CompileStep {
    _parser: Parser;
    _directives: List<DirectiveMetadata>;
    _selectorMatcher: SelectorMatcher;
    constructor(_parser: Parser, _directives: List<DirectiveMetadata>);
    processStyle(style: string): string;
    processElement(parent: CompileElement, current: CompileElement, control: CompileControl): void;
    _sortedKeysForEach(map: Map<string, string>, fn: (value: string, key: string) => void): void;
    _ensureHasOnlyOneComponent(elementBinder: ElementBinderBuilder, elDescription: string): void;
    _bindDirectiveProperty(bindConfig: string, compileElement: CompileElement, directiveBinderBuilder: DirectiveBuilder): void;
    _bindDirectiveEvent(eventName: any, action: any, compileElement: any, directiveBinderBuilder: any): void;
    _bindHostProperty(hostPropertyName: any, expression: any, compileElement: any, directiveBinderBuilder: any): void;
    _addHostAttribute(attrName: any, attrValue: any, compileElement: any): void;
    _splitBindConfig(bindConfig: string): List<any>;
}
