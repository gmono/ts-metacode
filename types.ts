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