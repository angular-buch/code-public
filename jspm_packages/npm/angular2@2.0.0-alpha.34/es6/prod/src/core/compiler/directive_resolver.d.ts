import { Type } from 'angular2/src/facade/lang';
import { Directive } from '../annotations_impl/annotations';
/**
 * Resolve a `Type` for {@link Directive}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
export declare class DirectiveResolver {
    /**
     * Return {@link Directive} for a given `Type`.
     */
    resolve(type: Type): Directive;
}
