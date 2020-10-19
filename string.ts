import { One, Dec, sAdd } from './math';
import { Tail } from './array';
//!字符串操作
export type CanBeString=string | number | bigint | boolean | null | undefined;
export type JOIN<x extends CanBeString[],sep extends CanBeString="">=x extends []? "": x extends [infer s,...infer rest]? s extends CanBeString? rest extends []? `${s}`:(rest extends CanBeString[]? `${s}${sep}${JOIN<rest,sep>}`:never):never:never;
export type Split<x extends CanBeString,sep extends CanBeString>=x extends ""? []:(
    x extends `${infer cont}${sep}${infer rest}`?(
        //还有后面
        [cont,...Split<rest,sep>]
    ):[x]
);
// type a=Split<"aaa,bbb",",">
//这是直接返回SNum的函数,而非数字
//由于Split的上限问题导致这个函数存在局限性
// export type Length<x extends string>=Dec<`${Split<x,"">["length"]}`>
//双重infer 得到第一个元素
export type Length<x extends string>=x extends `${infer _a}${infer b}`? b extends ""? "x":sAdd<Length<b>,"x">:"";
type a=Length<"1111111111111111">
// type a=JOIN<["aaaa","bbbb"],",">

//二分法
//基于数字系统和Slice函数
type SplitM<x extends CanBeString,sep extends CanBeString>=x extends ""? []:(
    x extends `${infer cont}${sep}${infer rest}`?(
        //还有后面
        [cont,...Split<rest,sep>]
    ):[x]
);