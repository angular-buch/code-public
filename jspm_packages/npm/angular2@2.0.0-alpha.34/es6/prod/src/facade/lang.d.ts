/// <reference path="../../../../../angular2/globals.d.ts" />
declare var _global: BrowserNodeGlobal;
export { _global as global };
export declare var Type: FunctionConstructor;
/**
 * Runtime representation of a type.
 *
 * In JavaScript a Type is a constructor function.
 */
export interface Type extends Function {
    new (...args: any[]): any;
}
export declare function getTypeNameForDebugging(type: Type): string;
export declare var isDart: boolean;
export declare class BaseException extends Error {
    message: string;
    private _originalException;
    private _originalStack;
    private _context;
    stack: any;
    constructor(message?: string, _originalException?: any, _originalStack?: any, _context?: any);
    originalException: any;
    originalStack: any;
    context: any;
    toString(): string;
}
export declare function makeTypeError(message?: string): Error;
export declare var Math: Math;
export declare var Date: DateConstructor;
export declare function assertionsEnabled(): boolean;
export declare function ENUM_INDEX(value: int): int;
export declare function CONST_EXPR<T>(expr: T): T;
export declare function CONST(): ClassDecorator;
export declare function ABSTRACT(): ClassDecorator;
export declare function IMPLEMENTS(_: any): ClassDecorator;
export declare function isPresent(obj: any): boolean;
export declare function isBlank(obj: any): boolean;
export declare function isString(obj: any): boolean;
export declare function isFunction(obj: any): boolean;
export declare function isType(obj: any): boolean;
export declare function isStringMap(obj: any): boolean;
export declare function isPromise(obj: any): boolean;
export declare function isArray(obj: any): boolean;
export declare function isNumber(obj: any): boolean;
export declare function isDate(obj: any): boolean;
export declare function stringify(token: any): string;
export declare function serializeEnum(val: any): int;
export declare function deserializeEnum(val: any, values: Map<int, any>): any;
export declare class StringWrapper {
    static fromCharCode(code: int): string;
    static charCodeAt(s: string, index: int): number;
    static split(s: string, regExp: RegExp): List<string>;
    static equals(s: string, s2: string): boolean;
    static replace(s: string, from: string, replace: string): string;
    static replaceAll(s: string, from: RegExp, replace: string): string;
    static toUpperCase(s: string): string;
    static toLowerCase(s: string): string;
    static startsWith(s: string, start: string): boolean;
    static substring(s: string, start: int, end?: int): string;
    static replaceAllMapped(s: string, from: RegExp, cb: Function): string;
    static contains(s: string, substr: string): boolean;
    static compare(a: string, b: string): int;
}
export declare class StringJoiner {
    parts: any[];
    constructor(parts?: any[]);
    add(part: string): void;
    toString(): string;
}
export declare class NumberParseError extends BaseException {
    message: string;
    name: string;
    constructor(message: string);
    toString(): string;
}
export declare class NumberWrapper {
    static toFixed(n: number, fractionDigits: int): string;
    static equal(a: number, b: number): boolean;
    static parseIntAutoRadix(text: string): int;
    static parseInt(text: string, radix: int): int;
    static parseFloat(text: string): number;
    static NaN: number;
    static isNaN(value: any): boolean;
    static isInteger(value: any): boolean;
}
export declare var RegExp: RegExpConstructor;
export declare class RegExpWrapper {
    static create(regExpStr: string, flags?: string): RegExp;
    static firstMatch(regExp: RegExp, input: string): List<string>;
    static test(regExp: RegExp, input: string): boolean;
    static matcher(regExp: RegExp, input: string): {
        re: RegExp;
        input: string;
    };
}
export declare class RegExpMatcherWrapper {
    static next(matcher: {
        re: RegExp;
        input: string;
    }): string[];
}
export declare class FunctionWrapper {
    static apply(fn: Function, posArgs: any): any;
}
export declare function looseIdentical(a: any, b: any): boolean;
export declare function getMapKey<T>(value: T): T;
export declare function normalizeBlank(obj: Object): any;
export declare function normalizeBool(obj: boolean): boolean;
export declare function isJsObject(o: any): boolean;
export declare function print(obj: Error | Object): void;
export declare class Json {
    static parse(s: string): Object;
    static stringify(data: Object): string;
}
export declare class DateWrapper {
    static create(year: int, month?: int, day?: int, hour?: int, minutes?: int, seconds?: int, milliseconds?: int): Date;
    static fromMillis(ms: int): Date;
    static toMillis(date: Date): int;
    static now(): Date;
    static toJson(date: Date): string;
}
