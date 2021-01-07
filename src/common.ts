import { Tree } from './tree';
import { Length, Slice } from './array';
import { Dec, sMoreThan, Ten, Zero } from '.';
import { SNum } from './math';
//这个可以使用元组代替 [A,B]
//普通固定映射器
//由于无法传递通用泛型 只能单个如 a,gen<a> b,gen<b> any,gen<any>
//如果要传递 gen 然后自动映射t为 gen<t>的话 目前没有办法
//可使用名字表法 建立类型 PackTable = "name"=>Pack
//也即建立一个通用泛型 接受 T和名字 得到一个新泛型
export type MapUnit<A,B,args extends any[]=[]>=[A,B,...args];
//通用占位符
export type None={};
//类型映射器 把T类型根据A映射表 映射为目的类型
//遵循 如果找不到就递归找的方法
//去除第一个 匹配第一个 第一个匹配上 返回 第一个匹配不上 返回对后续匹配的结果
//如果里面有一个不是mapunit 那么返回never  如果匹配结束还没匹配到 返回T
//这里对所有的特殊符号进行特殊处理 此处只有Pack 主要对B进行判断 如果负责进行特殊操作
//这里的A可以起到使用table表示程序的作用，即真值表。。

/**
 * never表示出错
 * 类型不变表示没找到(也可能是存在恒等映射)
 * ! 日后将区分找不到和恒等映射的情况
 */
type _MapType<T,A extends any[]>=A extends [infer Now,...infer S]?
                         Now extends MapUnit<infer From,infer To,infer Args>?
                         T extends From? To:_MapType<T,S>:never:T;

/**
 * 用于映射更长的串
 * ! 由于某些原因可能是math模块对Maptype的依赖导致的
 * ! 目前使用MapeTypeLong已经可以实现更多特性
 * 此函数通过分段操作 即每次截取seg的长度执行映射 重复 并得到结果
 * 映射失败返回原始类型
 */
export type MapTypeLong<T,A extends any[],seg extends SNum=Ten>=
//一次找不到
_MapType<T,Slice<A,Zero,seg>> extends T?(
sMoreThan<Length<A>,seg> extends [true]?
MapTypeLong<T,Slice<A,seg>,seg>:
_MapType<T,A>):_MapType<T,Slice<A,Zero,seg>>;



//! 一个简单粗暴的实现


type _MapHEX<s extends string>=MapTypeLong<s,[
    ["0",""],
    ["1","x"],
    ["2","xx"],
    ["3","xxx"],
    ["4","xxxx"],
    ["5","xxxxx"],
    ["6","xxxxxx"],
    ["7","xxxxxxx"],
    ["8","xxxxxxxx"],
    ["9","xxxxxxxxx"],
    ["a","xxxxxxxxxx"],
    ["b","xxxxxxxxxxx"],
    ["c","xxxxxxxxxxxx"],
    ["d","xxxxxxxxxxxxx"],
    ["e","xxxxxxxxxxxxxx"],
    ["f","xxxxxxxxxxxxxxx"],
    ["A","xxxxxxxxxx"],
    ["B","xxxxxxxxxxx"],
    ["C","xxxxxxxxxxxx"],
    ["D","xxxxxxxxxxxxx"],
    ["E","xxxxxxxxxxxxxx"],
    ["F","xxxxxxxxxxxxxxx"],
  ]>
type ss=_MapHEX<"F">
                        
//? 基于此二分映射方法 是否可以用生成代码方式生成整个四则运算表?
//? 这个最多可以支持多少?理论上认为可以支持到2^12次方 也即 4096个元素的映射表
type MapTypeTree<T,A extends any[]>=A extends [infer left,infer right]?
(
    left extends any[]?
    right extends any[]?
    (
        //! 这里会导致如果left存在恒等映射的话,会返回后面的,也即自动忽略恒等映射
        //! 全局自动忽略恒等映射
        MapTypeTree<T,left> extends T?MapTypeTree<T,right>:
        MapTypeTree<T,left>
    ):_MapType<T,[A]>:_MapType<T,[A]>
    //如果不是数组表示已经到底 包装一下map
):_MapType<T,[A]>;

/**
 * never表示出错
 * 类型不变表示没找到(也可能是存在恒等映射)
 * ! 日后将区分找不到和恒等映射的情况
 * 
 * ! 这是MapType的二叉树实现,即二分实现,原始的MapType
 */
export type MapType<T,A extends any[]>=MapTypeTree<T,Tree<A>>;

//maptype现在支持长度为15个了 以前为12个 稍有进步