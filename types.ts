import { sEqual, Zero, One, Dec } from './math';
import { Head, Length, Slice, Tail } from './array';
import { CanBeString } from './string';
export type  TypeNameList= RawTypeNameList| "object" | "function";
export type RawTypeNameList="string" | "number" | "bigint" | "boolean" | "symbol" | "undefined";
export type RawTypeList=string | number | bigint | boolean | symbol | undefined;
export type  TypeList= RawTypeList| object | Function;
export type TypeMap<tp extends TypeList>=tp extends string? "string":
                    tp extends number? "number":
                    tp extends bigint? "bigint":
                    tp extends boolean? "boolean":
                    tp extends symbol? "symbol":
                    tp extends Function? "function":
                    tp extends undefined? "undefined":
                    tp extends object? "object":never;
export type TypeNameMap<name extends TypeNameList>=name extends "string"? string:
                    name extends "number"? number:
                    name extends "bigint"? bigint:
                    name extends "boolean"? boolean:
                    name extends "symbol"? symbol:
                    name extends "function"? Function:
                    name extends "undefined"? undefined:
                    name extends "object"? object:never;
export type ClassType=new(...args:any[])=>any;

//数组字符串化
type _StringifyArray<ar extends any[]>=
sEqual<Length<ar>,Zero> extends [true]? "":
sEqual<Length<ar>,One> extends [true]?(
    Head<ar> extends TypeList?
    TypeMap<Head<ar>>:
    Head<ar> extends CanBeString? `${Head<ar>}`:never
):
`${_StringifyArray<Slice<ar,Dec<0>,One>>},${_StringifyArray<Tail<ar>>}`

//数组文本化
export type StringifyArray<ar extends any[]>=`[${_StringifyArray<ar>}]`
type s=StringifyArray<[1,number,string,{}]>

//对象文本化
type StringifyObject<obj>=
{[idx in keyof obj]: idx extends CanBeString? obj[idx] extends infer S? S extends TypeList? `${idx}:${TypeMap<S>}`:never:never:never};
// type Stringify<obj extends {[idx:string]:string},stack extends string[]=[]>=


// union to intersection of functions
type UnionToIoF<U> =
    (U extends any ? (k: (x: U) => void) => void : never) extends
    ((k: infer I) => void) ? I : never

// return last element from Union
type UnionPop<U> = UnionToIoF<U> extends { (a: infer A): void; } ? A : never;

// prepend an element to a tuple.
type Prepend<U, T extends any[]> =
    ((a: U, ...r: T) => void) extends (...r: infer R) => void ? R : never;

type UnionToTupleRecursively<Union, Result extends any[]> = {
    1: Result;
    0: UnionToTupleRecursively_<Union, UnionPop<Union>, Result>;
    // 0: UnionToTupleRecursively<Exclude<Union, UnionPop<Union>>, Prepend<UnionPop<Union>, Result>>
}[[Union] extends [never] ? 1 : 0];

type UnionToTupleRecursively_<Union, Element, Result extends any[]> =
    UnionToTupleRecursively<Exclude<Union, Element>, Prepend<Element, Result>>;

type UnionToTuple<U> = UnionToTupleRecursively<U, []>;

//! 借鉴别人的工作

type ToStrList<obj> =obj extends infer S? UnionToTuple<StringifyObject<S>[keyof S]>:never;

type ssss=ToStrList<{a:1;b:2}>