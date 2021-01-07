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
//! 重要函数 string的SLice函数 注意 此处由于无法使用split嫁接
//! 可能需要转移所有数组方面的逻辑 
//! 重大不同 tuple的length属性为一个约定的number而 string的length属性为number类型 不定长
//! 未来可能转移SNum体系到tuple实现
/**
 * 用某一个字符串替换另一个字符串中的所有字符
 */
type FillWithChar1<str extends string,rep extends string>=
str extends `${infer F}${infer rest}`?
`${rep}${FillWithChar1<rest,rep>}`
:str;
type FillWithChar2<str extends string,rep extends string>=
str extends `${infer F}${infer ff}${infer rest}`?
`${rep}${rep}${FillWithChar2<rest,rep>}`
:FillWithChar1<str,rep>;

type FillWithChar4<str extends string,rep extends string>=
str extends `${infer F}${infer ff}${infer F}${infer ff}${infer rest}`?
`${rep}${rep}${rep}${rep}${FillWithChar4<rest,rep>}`
:FillWithChar2<str,rep>;
/**
 * 8倍计数器 目前主要用这个 可以对150左右长度的串进行操作
 * 此后可能加后缀8 并增加到 1024倍
 * ! 目前由于类型表达式过于复杂可能导致提示报错而暂时不使用8倍以上计数器
 * ! 此方式可用于其他方面 如maptype的支持长度扩展
 */
export type FillWithChar<str extends string,rep extends string>=
str extends `${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer rest}`?
`${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${FillWithChar<rest,rep>}`
:FillWithChar4<str,rep>;


type FillWithChar16<str extends string,rep extends string>=
str extends `${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer F}${infer ff}${infer rest}`?
`${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${rep}${FillWithChar16<rest,rep>}`
:FillWithChar<str,rep>;


//! 考虑改写实现 通过nowrep参数携带块级参数,从2^16开始匹配 实现一个专门将字符串转换为
//! 数字的实现
// type a=Split<"aaa,bbb",",">
//这是直接返回SNum的函数,而非数字
//由于Split的上限问题导致这个函数存在局限性
// export type Length<x extends string>=Dec<`${Split<x,"">["length"]}`>
//双重infer 得到第一个元素
// export type StrLength<x extends string>=Split<x,"">["length"];

// type a=StrLength<"11111111111111111">
// type a=JOIN<["aaaa","bbbb"],",">

export type StrLength<a extends string>=FillWithChar<a,"x">
  
//最多23层
// type aa=StrLength<"11111111111111111111111fasdfasdfasdffasdfasdfasdfasdfasdfadsfasdfasdfasdfasddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddf">


  
// type b="xx"[0]
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


// type a="1234" extends `${infer a}2${infer T}`? [a,T]:never;


//! 考虑通过替换所有字符为x来生成SNum表示的Length