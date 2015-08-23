import { EventEmitter } from 'angular2/src/facade/async';
import { QueryList } from 'angular2/core';
import { NgControl } from './ng_control';
import { Control } from '../model';
import { NgValidator } from './validators';
/**
 * Binds a domain model to the form.
 *
 * # Example
 *  ```
 * @Component({selector: "search-comp"})
 * @View({
 *      directives: [formDirectives],
 *      template: `
              <input type='text' [(ng-model)]="searchQuery">
 *      `})
 * class SearchComp {
 *  searchQuery: string;
 * }
 *  ```
 */
export declare class NgModel extends NgControl {
    _control: Control;
    _added: boolean;
    update: EventEmitter;
    model: any;
    viewModel: any;
    ngValidators: QueryList<NgValidator>;
    constructor(ngValidators: QueryList<NgValidator>);
    onChange(c: StringMap<string, any>): void;
    control: Control;
    path: List<string>;
    validator: Function;
    viewToModelUpdate(newValue: any): void;
}
