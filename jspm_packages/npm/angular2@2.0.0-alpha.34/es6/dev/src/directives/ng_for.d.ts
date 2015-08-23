import { ViewContainerRef, ViewRef, TemplateRef } from 'angular2/core';
import { ChangeDetectorRef, IterableDiffers } from 'angular2/change_detection';
/**
 * The `NgFor` directive instantiates a template once per item from an iterable. The context for
 * each instantiated template inherits from the outer context with the given loop variable set
 * to the current item from the iterable.
 *
 * It is possible to alias the `index` to a local variable that will be set to the current loop
 * iteration in the template context.
 *
 * When the contents of the iterator changes, `NgFor` makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 *
 * # Example
 *
 * ```
 * <ul>
 *   <li *ng-for="#error of errors; #i = index">
 *     Error {{i}} of {{errors.length}}: {{error.message}}
 *   </li>
 * </ul>
 * ```
 *
 * # Syntax
 *
 * - `<li *ng-for="#item of items; #i = index">...</li>`
 * - `<li template="ng-for #item of items; #i = index">...</li>`
 * - `<template ng-for #item [ng-for-of]="items" #i="index"><li>...</li></template>`
 */
export declare class NgFor {
    private viewContainer;
    private templateRef;
    private iterableDiffers;
    private cdr;
    _ngForOf: any;
    private _differ;
    constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef, iterableDiffers: IterableDiffers, cdr: ChangeDetectorRef);
    ngForOf: any;
    onCheck(): void;
    private _applyChanges(changes);
    private _perViewChange(view, record);
    static bulkRemove(tuples: List<RecordViewTuple>, viewContainer: ViewContainerRef): List<RecordViewTuple>;
    static bulkInsert(tuples: List<RecordViewTuple>, viewContainer: ViewContainerRef, templateRef: TemplateRef): List<RecordViewTuple>;
}
export declare class RecordViewTuple {
    view: ViewRef;
    record: any;
    constructor(record: any, view: any);
}
