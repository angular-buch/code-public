import { ViewContainerRef, TemplateRef } from 'angular2/core';
/**
 * Removes or recreates a portion of the DOM tree based on an {expression}.
 *
 * If the expression assigned to `ng-if` evaluates to a false value then the element
 * is removed from the DOM, otherwise a clone of the element is reinserted into the DOM.
 *
 * # Example:
 *
 * ```
 * <div *ng-if="errorCount > 0" class="error">
 *   <!-- Error message displayed when the errorCount property on the current context is greater
 * than 0. -->
 *   {{errorCount}} errors detected
 * </div>
 * ```
 *
 * # Syntax
 *
 * - `<div *ng-if="condition">...</div>`
 * - `<div template="ng-if condition">...</div>`
 * - `<template [ng-if]="condition"><div>...</div></template>`
 */
export declare class NgIf {
    viewContainer: ViewContainerRef;
    templateRef: TemplateRef;
    prevCondition: boolean;
    constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef);
    ngIf: any;
}
