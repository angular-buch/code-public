/* */ 
"format cjs";
import { ComponentAnnotation, DirectiveAnnotation } from './annotations';
import { ViewAnnotation } from './view';
import { AttributeAnnotation, QueryAnnotation, ViewQueryAnnotation } from './di';
import { makeDecorator, makeParamDecorator } from '../../util/decorators';
/**
 * {@link Component} factory function.
 */
export var Component = makeDecorator(ComponentAnnotation, (fn) => fn.View = View);
/**
 * {@link Directive} factory function.
 */
export var Directive = makeDecorator(DirectiveAnnotation);
/**
 * {@link View} factory function.
 */
export var View = makeDecorator(ViewAnnotation, (fn) => fn.View = View);
/**
 * {@link Attribute} factory function.
 */
export var Attribute = makeParamDecorator(AttributeAnnotation);
/**
 * {@link Query} factory function.
 */
export var Query = makeParamDecorator(QueryAnnotation);
/**
 * {@link ViewQuery} factory function.
 */
export var ViewQuery = makeParamDecorator(ViewQueryAnnotation);
//# sourceMappingURL=decorators.js.map