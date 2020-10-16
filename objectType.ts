
//!对象映射与融合部分
//合并类型 如果不存在 直接赋值 如果是同名数组 变成|类型 如果是同名对象
//递归调用得到新类型

import { MapUnit, MapElement, MapType } from ".";

//!合并类型用于JSON对象类型的合并中 需要函数按照对应合并策略进行合并
export type MergeObject<A,B>={[idx in (keyof A|keyof B)]:
    idx extends keyof A?
    idx extends keyof B?(
        //同时
        MergeType<A[idx],B[idx]>
    )
    :(
        //非同时 即属性名属于一个对象 直接赋值
        idx extends keyof A?A[idx]:
        idx extends keyof B?B[idx]:never
        //如果最后一个都属于 说明出错了
    ):(
        //非同时 即属性名属于一个对象 直接赋值
        idx extends keyof A?A[idx]:
        idx extends keyof B?B[idx]:never
        //如果最后一个都属于 说明出错了
    )};
//合并类型 如果是同一个类型 返回 如果是数组类型返回合并后
//以后支持 如果是迭代器 生成器 等常见模板类型 都进行合并
//但由于不支持通用泛型表示 无法覆盖自定义泛型
//对于自定义泛型 只能通过 & 符号来自动合并
//对象不适用& 来自动合并 因为& 无法自动处理当两个属性冲突时的情况
//例如无法把两个不同的数组合并为一个或类型数组,如果进行 元素结果为never
//不能提供更多类似这种特殊类型的合并处理操作
//! 这里做如下假设： 迭代器合并是进行混合或拼接concat，而非取舍
//! 一切对象类型都进行合并
//! 原始类型进行或操作
export type MergeType<A,B>=A extends B? A:
                    
                    A extends Array<infer AT>?B extends Array<infer BT>? Array<AT|BT>:MergeObject<A,B>:MergeObject<A,B>;


//!融合部分结束 开始映射部分
//别名 用于映射对象 方便理解
export type MapProp<T extends any,M extends MapUnit<any,any>[]>=MapElement<T,M>;

//递归映射 可映射数组和对象
//judgetype用于判断是否需要递归 如果extends 判定为true 则继续递归 即
//递归模板 judgetype可以是联合类型 等 还可以是复杂泛型等
//由于extends操作判定主要基于类型签名而非实质，实际使用时可使用包装函数
//包装原始对象 而将judgeexport type作为纯粹的记号类型使用
export type MapRecursion<T extends any,M extends MapUnit<any,any>[],JudgeType=object>=
                        {[R in keyof T]:T[R] extends JudgeType? MapRecursion<T[R],M,JudgeType>:MapType<T[R],M> };


//例如modle设计思路 可使用getarray getobject 来包装复杂成员
//原封返回 但类型签名 变为Getter<object>
// export type s=MapRecursion<{
//     a:string;
//     b:number;
//     test:{
//         b:string;
//     }
// },[[string,number],[number,string]]>; 