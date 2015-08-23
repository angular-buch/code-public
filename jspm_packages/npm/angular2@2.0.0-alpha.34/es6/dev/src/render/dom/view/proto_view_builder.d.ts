import { ASTWithSource, AST, AstTransformer, AccessMember } from 'angular2/src/change_detection/change_detection';
import { Event } from './element_binder';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { TemplateCloner } from '../template_cloner';
import * as api from '../../api';
export declare class ProtoViewBuilder {
    rootElement: any;
    type: api.ViewType;
    viewEncapsulation: api.ViewEncapsulation;
    variableBindings: Map<string, string>;
    elements: List<ElementBinderBuilder>;
    rootTextBindings: Map<Node, ASTWithSource>;
    ngContentCount: number;
    hostAttributes: Map<string, string>;
    constructor(rootElement: any, type: api.ViewType, viewEncapsulation: api.ViewEncapsulation);
    bindElement(element: HTMLElement, description?: string): ElementBinderBuilder;
    bindVariable(name: string, value: string): void;
    bindRootText(textNode: Text, expression: ASTWithSource): void;
    bindNgContent(): void;
    setHostAttribute(name: string, value: string): void;
    build(schemaRegistry: ElementSchemaRegistry, templateCloner: TemplateCloner): api.ProtoViewDto;
}
export declare class ElementBinderBuilder {
    index: number;
    element: any;
    parent: ElementBinderBuilder;
    distanceToParent: number;
    directives: List<DirectiveBuilder>;
    nestedProtoView: ProtoViewBuilder;
    propertyBindings: Map<string, ASTWithSource>;
    variableBindings: Map<string, string>;
    eventBindings: List<api.EventBinding>;
    eventBuilder: EventBuilder;
    textBindings: Map<Node, ASTWithSource>;
    readAttributes: Map<string, string>;
    componentId: string;
    constructor(index: number, element: any, description: string);
    setParent(parent: ElementBinderBuilder, distanceToParent: number): ElementBinderBuilder;
    readAttribute(attrName: string): void;
    bindDirective(directiveIndex: number): DirectiveBuilder;
    bindNestedProtoView(rootElement: HTMLElement): ProtoViewBuilder;
    bindProperty(name: string, expression: ASTWithSource): void;
    bindVariable(name: string, value: string): void;
    bindEvent(name: string, expression: ASTWithSource, target?: string): void;
    bindText(textNode: Text, expression: ASTWithSource): void;
    setComponentId(componentId: string): void;
}
export declare class DirectiveBuilder {
    directiveIndex: number;
    propertyBindings: Map<string, ASTWithSource>;
    templatePropertyNames: List<string>;
    hostPropertyBindings: Map<string, ASTWithSource>;
    eventBindings: List<api.EventBinding>;
    eventBuilder: EventBuilder;
    constructor(directiveIndex: number);
    bindProperty(name: string, expression: ASTWithSource, elProp: string): void;
    bindHostProperty(name: string, expression: ASTWithSource): void;
    bindEvent(name: string, expression: ASTWithSource, target?: string): void;
}
export declare class EventBuilder extends AstTransformer {
    locals: List<AST>;
    localEvents: List<Event>;
    globalEvents: List<Event>;
    _implicitReceiver: AST;
    constructor();
    add(name: string, source: ASTWithSource, target: string): api.EventBinding;
    visitAccessMember(ast: AccessMember): AccessMember;
    buildEventLocals(): List<AST>;
    buildLocalEvents(): List<Event>;
    buildGlobalEvents(): List<Event>;
    merge(eventBuilder: EventBuilder): void;
    _merge(host: List<Event>, tobeAdded: List<Event>): void;
}
