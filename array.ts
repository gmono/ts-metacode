
// export type a=Pack<PackSign|string>
//如果是要把t映射为pack<t> 呢
//可映射 对象和数组 用过循环方式 优于递归方式实现
//映射数组和对象

import { MapUnit, MapType, If } from ".";
import { Zero, SNum, sEqual, sDec, OCT, sInc, One, Dec, Bin, sAdd, sMoreThan, sMoreOrEqual, sDiv, sSub } from './math';
import { JOIN } from './string';

//此映射不递归 用于映射数组元素足够 ，对object只能映射第一层
export type MapElement<T extends any,M extends MapUnit<any,any>[]>=
                            {[R in keyof T]:MapType<T[R],M> };
//zip
export type Zip<a,b>=a extends [infer i,...infer q]?b extends [infer ii,...infer qq]?[[i,ii],...Zip<q,qq>]:[]:[];



//元组操作部分

//这里和ts tuple的定义一致
//连接
export type Concat<One extends any[],Two extends any[]>=[...One,...Two];

//前方操作
//取最前面
export type Head<Raw extends any[]>=Raw extends [infer S,...infer Rest] ?S:never;
//与ts tuple定义重合
//取最后面 即去掉前面后的部分
export type Tail<Raw extends any[]>=Raw extends [infer Set,...infer Rest]? Rest:never;
// type a=Tail<[""]>
//从前面添加一个
export type Shift<Raw extends any[],Ele>=[Ele,...Raw];
//得到最左边一个 也就是取第一个
export type UnShift<Raw extends any[]>=Head<Raw>;

//后方操作
//最后插入一个
export type Push<Raw extends any[],Ele>=[...Raw,Ele];
//取前面那段
export type Previous<Raw extends [any,...any[]]>=Raw extends [...infer P,infer Ele]? P:never;
//去掉最后一个
export type Pop<Raw extends [any,...any[]]>= Last<Raw>;
//取最后一个
export type Last<Raw extends [any,...any[]]>= Raw extends [...infer P,infer Ele]? Ele:never;
type a=Push<[1,2],1>;
type b=Concat<a,a>;
type c=Concat<b,b>;
type d=Shift<c,3>;
type e=ReplaceAll<[1,2,3,2,2,3],[2,3],[1,2,3]>;
//8进制
type k=Skip<e,OCT<"3">>
type idx=IndexOf<k,[3]>
type f=Tail<e>;
type h=MapElement<f,[[1,5],[2,"hello"]]>
type cc=JOIN<h,"">
type aa=Last<[1]>;


//! 串操作部分
//前后块操作 如果匹配不上返回never 如果前面比后面短返回unknow
export type RemoveFront<R extends any[],K extends any[]>=
R extends []? (K extends []? []:never):
(R extends [...K,...infer Rest]? Rest:never);
export type RemoveEnd<R extends any[],K extends any[]>=
R extends []? (K extends []? []:never):
(R extends [...infer Rest,...K]? Rest:never);
//中间模板匹配操作（基于模板匹配的中间删除，只删除第一个) 
//! 如果一直匹配不到？ 这里如果前面比后面长或者匹配不到则出现无限深度实例化
//! 无限实例化会导致提醒用户，而返回never逻辑上更完美
export type RemoveSame<R extends any[],K extends any[]>=
R extends []? (K extends []? []:never):
(RemoveFront<R,K> extends never? Shift<RemoveSame<Tail<R>,K>,Head<R>>:RemoveFront<R,K>)
//! 移除所有的一样的串 按顺序 有点像 Filter+ DeleteSome 类似 但此函数可实现段式删除 而非只有元素级别操作
export type RemoveAllSame<R extends any[],K extends any[]>=
RemoveSame<R,K> extends never? R:
RemoveAllSame<RemoveSame<R,K>,K>;
//! 替换一个 不行就never
export type ReplaceOne<R extends any[],A extends any[],B extends any[]>=
R extends []? []:
(RemoveFront<R,A> extends never? Shift<ReplaceOne<Tail<R>,A,B>,Head<R>>:[...B,...RemoveFront<R,A>]);
//不能直接按remove all的来 可能出现重复替换 无限问题
//这里在替换第一个后继续替换后面的
export type ReplaceAll<R extends any[],A extends any[],B extends any[]>=
R extends []? []:
(RemoveFront<R,A> extends never? Shift<ReplaceAll<Tail<R>,A,B>,Head<R>>:[...B,...ReplaceAll<RemoveFront<R,A>,A,B>]);

//搜索部分 数字用snum表示 没找到返回never
 export type IndexOf<R extends any[],A extends any[],NowIndx extends SNum=Zero>=
 R extends []? never:
 RemoveFront<R,A> extends never?
 (
     //没有找到 递归
     IndexOf<Tail<R>,A,sInc<NowIndx>>
 )
 :NowIndx
//把数组的第一个元素放到最后 一般用于反转 参数列表 把回调函数弄到前面来 方便处理
export type ReverseToEnd<T extends any[]>=Push<Tail<T>,Head<T>>;
// export type a=ReverseToEnd<[number,string,string]>;

//Insert Get Slice等数字相关函数
export type Get<T extends any[],idx extends SNum>=
idx extends Zero? T[0]:
//递归
Get<Tail<T>,sDec<idx>>;

//删除前面的
type _Slice<T extends any[],start extends SNum>=
start extends Zero? T:
//递归
_Slice<Tail<T>,sDec<start>>;

// type a=1 extends Uncapitalize<`${infer t}`>? t:never;
//默认参数可实现 removefront和removeend 按数值截取的功能
export type Slice<T extends any[],start extends SNum=Zero,end extends SNum=Length<T>>=
//删除的方式 找到开始位置,删除前面那段,继续找到后面位置,删除后面那段,返回
RemoveEnd<_Slice<T,start>,_Slice<T,end>>;
type one=_Slice<Range<Dec<0>,Dec<1>,Dec<40>>,Dec<40>>
type kk=Slice<[1,2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],Dec<"15">,Dec<"20">>
// type ss=Get<[1,2,3,4,54,6,7],Dec<"4">>
export type Insert<T extends any[],idx extends SNum,subAr extends any[]>=
// 用_Slice把后面切出来  用 remove end 把前面切出来 把前面和中间和后面结合
[...RemoveEnd<T,_Slice<T,idx>>,...subAr,..._Slice<T,idx>]
//集合操作部分

// type aaa=Insert<[1,2,3],Dec<"1">,[1,2,4]>

//移除最后的等长串
//切断函数
/**
 * 切断最后面的等长串
 */
export type CutEnd<R extends any[],K extends any[]>=Slice<R,Dec<0>,sSub<Length<R>,Length<K>>>;
/**
 * 切断前面的等长串
 */
export type CutFront<R extends any[],K extends any[]>=Slice<R,Length<K>>;
/**
 * 融合 到最前面或最后面 即切断再连接的过程 等于切断再插入
 */
export type MergeArrayEnd<R extends any[],K extends any[]>=Concat<CutEnd<R,K>,K>;
export type MergeArrayFront<R extends any[],K extends any[]>=Concat<K,CutFront<R,K>>;
//
type s=MergeArrayEnd<[1,2,3,8],[4,5]>
//type s = [1, 2, 4, 5]
//MapElement算是集合操作的一部分 这里不重复
//由于不能传递程序而只能传递值，这里直接传递映射模板
//即 传递一个可用于maptype的数组 如果一个element 映射为false 则过滤掉
//如
//type a=Filter<["","a",""],[["",false],[any,true]]>
//! Filter 实现的是对单个元素进行映射 进而决定是否需要删除 true表示保留 false表示删除
//! 注意Filter 可用映射表实现复杂筛选，映射表可通过Filter配套筛选器生成
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
export type DeleteSameElement<art extends any[]>=art extends [infer n,...infer r]?( [[n,false],...DeleteSameElement<r>]):[[any,true]];
//这里的Map函数使用MapElement代替
//这里的Foreach函数由于不能执行操作,直接省略
//剩余的还有Skip函数,这个等于是 多重的Head函数 即运用N次Head函数
//? 此处的Skip函数实现可用作使用SNUM做数字的例子
export type Skip<art extends any[],num extends SNum>=sEqual<num,Zero> extends [true]? art:Skip<Tail<art>,sDec<num>>;
// type aaa=Filter<["","a",""],DeleteSome<[""]>>

// type a=MapElement<[1,2,3,4],[[4,1],[1,2],[2,3],[3,4]]>

//生成部分

//生成数字序列 SNum表示

//尝试循环方式表示递归 就看ts支不支持尾递归了
//! 准备把Range改成二分生成
export type Range<start extends SNum,space extends SNum,end extends SNum,Now extends SNum=start,nowar extends string[]=[]>=
sMoreThan<Now,end> extends [true]? nowar:sEqual<Now,end> extends [true]? nowar:
Range<start,space,end,sAdd<Now,space>,[...nowar,Now]>;

// export type __Mid<start extends string,end extends string>=sDiv<sAdd<end,start>,Dec<2>>;
// export type Range<start extends SNum,space extends SNum,end extends SNum>=
// sMoreThan<start,end> extends [true]? []:
// sLessThan<sAdd<start,space>,end> extends [true]? [start]:
// sEqual<sAdd<start,space>,end> extends [true]? [start,end]:
// [...Range<start,space,__Mid<start,end>>,...Range<__Mid<start,end>,space,end>];

// type a=sDiv<Dec<1>,Dec<2>>
//如果是尾递归的话 似乎可以达到47层左右
// type a=Range<Dec<"1">,Dec<"3">,Dec<"4">>
// type b=__Mid<Dec<1>,Dec<2>>


export type Length<a extends any[]>=Dec<a["length"]>;
// type s=Length<"1,2,32">
