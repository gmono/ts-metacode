import { One, Dec, sAdd, sInc } from './math';
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
// export type StrLength<x extends string>=Split<x,"">["length"];

// type a=StrLength<"11111111111111111">
// type a=JOIN<["aaaa","bbbb"],",">

type StrLength<a extends string,now extends string="">= a extends ""? now:(
    a extends `${infer first}${infer last}`?
    StrLength<last,sInc<now>>:never
  )
  
//最多23层
type aa=StrLength<"11111111111111111111111">

  
type b="xx"[0]
//二分法
//基于数字系统和Slice函数
type SplitM<x extends CanBeString,sep extends CanBeString>=x extends ""? []:(
    x extends `${infer cont}${sep}${infer rest}`?(
        //还有后面
        [cont,...Split<rest,sep>]
    ):[x]
);
//split 范式 使用多重包装,也即一次检测2个元素,如果失败,就把这2个元素结合成一个字符串
//放入原始split中处理,如果失败就直接返回,这时候最多只有一个元素 
//如果成功,并且后面还有内容,递归处理

//! 注意 合成法:即使用合成方法,首先通过sep和cont合成一个二分分隔符 然后进行分割
//! 关键是如何直接实现二分


type a="1234" extends `${infer a}2${infer T}`? [a,T]:never;


//! 考虑通过替换所有字符为x来生成SNum表示的Length