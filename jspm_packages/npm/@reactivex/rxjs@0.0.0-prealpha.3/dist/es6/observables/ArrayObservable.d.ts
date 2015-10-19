import Scheduler from '../Scheduler';
import Observable from '../Observable';
export default class ArrayObservable<T> extends Observable<T> {
    private array;
    private scheduler;
    static create<T>(array: T[], scheduler?: Scheduler): ArrayObservable<T>;
    static of<T>(...array: (T | Scheduler)[]): Observable<T>;
    static dispatch(state: any): void;
    constructor(array: T[], scheduler?: Scheduler);
    _subscribe(subscriber: any): void;
}
