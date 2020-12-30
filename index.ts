import { Push, RemoveFront, Slice } from './array';
import { Dec, sAdd } from './math';

/**
 * 功能说明： 
 * 数学相关：
 * ! 此处实体：SNum Bin Logic  分别为 
 * ! 基于string构建的自然数计算系统的数字，只能是正整数
 * ! 二进制数字的字符串表示 比如 "11110000"
 * ! 二进制的数组表示形式 如[true,false,true] 在此基础上可构建单位位运算体系 结合控制流体系实现编程
 * 数组相关：
 * ! 实现了数组的各种操作，包括一些集合操作，如 Map Filter 
 * 对象相关
 * ! 实现了递归的对象类型映射，对象类型融合等功能
 * 控制流 
 * ! 实现了 If Equal等，未来使用逻辑系统可实现复杂逻辑
 */












//!!!!!!数学部分结束

// type a=If<Equal<string,number>,string,number>;

// export type P<Str>=Str extends `${infer T}`? T:never;
// export type a=MapType<string,[[any,number]]>

export * from "./common"
export * from "./array"
export * from "./objectType"
export * from "./math"
export * from "./logic"
export * from "./string"
export * from "./tree"
//暂时不导出此模块
// export * from "./types"
//整合typescriopt tuple包 未来将作出包装和改进
export {IsFinite,Reverse,Repeat,ConcatMultiple,Drop,SliceStartQuantity,FillTuple,CompareLength,SortTwoTuple,ShortestTuple,LongestTuple,FilterTuple as FilterType} from "typescript-tuple"

//准备替代
// type Drop<A extends any[],B extends number>=Slice<A,Dec<B>>

// type ss=Drop<[1,2,3,4,5],2>
// type SliceStartQuantity<A extends any[],B extends number,C extends number>=
// Slice<A,Dec<B>,sAdd<B,C>>;
// type sss=SliceStartQuantity<[1,2,3,4,5,6],1,4>
//Drop=RemoveFront
//SliceStartQuantity 从某个位置开始切多少个  可以直接用slice实现
//Fill可以用MapElement any->"r" 实现
//!数组长度比较可以用 length函数+数学实现  也可以用匹配方式实现,即通过映射所有
//!元素到同一个值,然后用extends 运算进行匹配,可以比较数组的长短
//Sort 不过是比长短上衍生的 sortest longest 也一样
//Filter不过是我的Filter的廉价版,等于我的Filter<a,[[a|b|c,false]]>