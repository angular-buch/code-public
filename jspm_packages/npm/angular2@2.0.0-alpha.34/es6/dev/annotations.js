/* */ 
"format cjs";
/**
 * @module
 * @description
 *
 * Annotations provide the additional information that Angular requires in order to run your
 * application. This module
 * contains {@link Component}, {@link Directive}, and {@link View} annotations, as well as
 * the {@link Host} annotation that is used by Angular to resolve dependencies.
 *
 */
export { ComponentAnnotation, DirectiveAnnotation, LifecycleEvent } from './src/core/annotations/annotations';
export { ViewAnnotation, ViewEncapsulation } from 'angular2/src/core/annotations/view';
export { QueryAnnotation, AttributeAnnotation } from 'angular2/src/core/annotations/di';
export { Class } from 'angular2/src/util/decorators';
export { Attribute, Component, Directive, View, Query, ViewQuery } from 'angular2/src/core/annotations/decorators';
//# sourceMappingURL=annotations.js.map