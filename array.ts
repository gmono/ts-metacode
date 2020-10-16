
// export type a=Pack<PackSign|string>
//如果是要把t映射为pack<t> 呢
//可映射 对象和数组 用过循环方式 优于递归方式实现
//映射数组和对象

import { MapUnit, MapType } from ".";

//此映射不递归 用于映射数组元素足够 ，对object只能映射第一层
export type MapElement<T extends any,M extends MapUnit<any,any>[]>=
                            {[R in keyof T]:MapType<T[R],M> };
//zip
export type Zip<a,b>=a extends [infer i,...infer q]?b extends [infer ii,...infer qq]?[[i,ii],...Zip<q,qq>]:[]:[];



//元组操作部分
export type Push<Raw extends any[],Ele>=[...Raw,Ele];
export type Concat<One extends any[],Two extends any[]>=[...One,...Two];
export type Head<Raw extends any[]>=Raw extends [infer S,...infer Rest] ?S:never;
export type Tail<Raw extends any[]>=Raw extends [infer Set,...infer Rest]? Rest:never;
export type Shift<Raw extends any[],Ele>=[Ele,...Raw];
export type Pop<Raw extends any[]>= Raw extends [...infer P,infer Ele]? P:never;


export type RemoveFront<R extends any[],K extends any[]>=R extends [...K,...infer Rest]? Rest:never;
export type RemoveEnd<R extends any[],K extends any[]>=R extends [...infer Rest,...K]? Rest:never;

//把数组的第一个元素放到最后 一般用于反转 参数列表 把回调函数弄到前面来 方便处理
export type ReverseToEnd<T extends any[]>=Push<Tail<T>,Head<T>>;
// export type a=ReverseToEnd<[number,string,string]>;
//集合操作部分
//MapElement算是集合操作的一部分 这里不重复
//由于不能传递程序而只能传递值，这里直接传递映射模板
//即 传递一个可用于maptype的数组 如果一个element 映射为false 则过滤掉
//如
//type a=Filter<["","a",""],[["",false],[any,true]]>
export type Filter<ar extends any[],ju extends [any,boolean][]>=ar extends [infer t,...infer ttt]?(
    //处理第一个 
    MapType<t,ju> extends true?(
        //如果判断t是true 则表示加入数组
        [t,...Filter<ttt,ju>]
    ):(
        //不加入数组
        Filter<ttt,ju>
    )
):[];
//生成筛选器 用于删除某些东西
export type DeleteSome<art extends any[]>=art extends [infer n,...infer r]?( [[n,false],...DeleteSome<r>]):[[any,true]];

// type aaa=Filter<["","a",""],DeleteSome<[""]>>

