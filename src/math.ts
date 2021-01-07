
import { Push } from '.';

// type a=nAnd<[true,false],[false,true]>

import { MapElement, AND, NOT } from ".";
import { JOIN, CanBeString, Split } from './string';
import { MapUnit, MapTypeLong } from './common';
import { Concat, Tail, MergeArrayEnd } from './array';
import { OR } from './logic';

//!将01表示的二进制数字的字符串形式 和boolean数组互相转换
//bin和 logic的互换
export type BinToLogic<s extends string>=s extends "" ?[]:
                            s extends `0${infer tail}`? [false,...BinToLogic<tail>]:
                            s extends `1${infer tail}`? [true,...BinToLogic<tail>]:never;
//此处使用了JOIN函数会成为长度瓶颈
export type LogicToBin<s extends boolean[]>=JOIN<MapElement<s,[[true,"1"],[false,"0"]]>>
// type p=TransToLogic<"10010001">;
// type aaa=TransToString<p>



//!!基于字符串序列的自然数体系 构建中
//重新用字符串定义公理系统 自然数
//建议这个系统的使用 不要超过8位
//如果使用16位可能导致typescript服务出问题 或 递归深度过高
//注意  乘除法目前采用数数实现 没有用二分 效率较低
//使用此公理系统加上二进制表示转换机制可实现 简单的数字运算 弥补 ts不支持泛型数字运算的缺陷
// 可实现 c++模板特化功能
export type SNum=string;
export type Zero="";
export type One="x"
//把数字和Snum统一处理成SNum
//模板位置使用此函数转换
export type Num<T extends SNum|number>=T extends number? Dec<T>:T;
export type __ToNum<T extends SNum>=T;
// type __ReceiveType=SNum|number;
// type __ToNum<T extends __ReceiveType>=Num<T>;
//负数 目前不支持负数
// export type Minus<R extends string>=`-${R}`;
//! 前置的转换语句和最后的返回语句
export type sMoreOrEqual<P extends  SNum,R extends SNum>=
OR<sEqual<P,R>,sMoreThan<P,R>>;

export type sLessOrEqual<P extends  SNum,R extends SNum>=
OR<sEqual<P,R>,sLessThan<P,R>>;
//比较 主要基于 大于等于定义所有比较
export type sMoreThan<P extends  SNum,R extends SNum>=
__ToNum<P> extends `${__ToNum<R>}${infer ANY}x`? [true]:[false];

export type sEqual<P extends  SNum,R extends SNum>=
__ToNum<P> extends __ToNum<R>? [true]:[false];

export type sLessThan<P extends  SNum,R extends SNum>=
AND<NOT<sMoreThan<P,R>>,NOT<sEqual<P,R>>>;

export type sInc<R extends SNum>=
`${__ToNum<R>}x`;
export type sDec<R extends SNum>=
__ToNum<R> extends `${infer T}x`? T:Zero;

export type sAdd<R extends SNum,P extends SNum>=
`${__ToNum<R>}${__ToNum<P>}`;
export type sSub<R extends SNum,P extends SNum>=
__ToNum<R> extends `${__ToNum<P>}${infer T}`? T:never;
//这个还是逐步增加的 需要改为二分
export type sMul<R extends SNum,P extends SNum>=
__ToNum<P> extends  Zero? Zero:(
  `${__ToNum<R>}${sMul<R,sDec<P>>}`
)
//! 注意 关键 ，当计算泛型参数时是一起计算的 而 extends短路 因此用if可能导致递归无限
//需要处理p大于r的情况
//!应当改为使用二分法做除法 即倍乘直到大于,然后再回溯,回溯可通过带当前状态变量来实现,但可能深度过高
export type sDiv<R extends SNum,P extends SNum,NowTry extends SNum=One>=
__ToNum<P> extends  Zero? never:sMoreThan<P,R> extends [true]? Zero:(
  //逆运算
  //可能无限循环 如果不能整除
  //要检测 如果大于 则直接返回
  sMul<P,NowTry> extends __ToNum<R>? NowTry:(
    // @ts-ignore
    sMoreThan<sMul<P,sInc<NowTry>>,R> extends [true]? NowTry:
      sDiv<R,P,sInc<NowTry>>
      )
);
// type test=sDiv<"xxx","xxxx">





//!!! 基本计算函数完成


//没有把snum转回去的办法 目前没有开发
//!! 转换部分 可将 SNum 转化为 Bin 和 Logic 结合上面的Bin和Login的互相转换 
//把字符串自然数系统和字符串的二进制数互相转换
export type LogicToSNum<s extends boolean[]>= s extends [...infer rest,infer l]? (
    //如果rest没了 直接返回
    rest extends []?
    (l extends true? "x":""):
    //如果rest还有 把前面的求值并x2 后加到自己上
    //那要是不是boolean数组了  那出错
    (rest extends boolean[]? sAdd<sMul<LogicToSNum<rest>,"xx">,(l extends true? "x":"")>:never)
):"";
//把 二进制表示 转化为 字符串表示的数字
export type BinToSNum<s extends string>=LogicToSNum<BinToLogic<s>>;

//测试计算 目前测试最高支持8位x4位 的乘法 否则实例化深度越界
// type num=TransBinToSNum<"11111111">;
// type num2=TransBinToSNum<"1111">;
// type sum=sMul<num,num2>;
//!从snum转换回到bin和logic 还没实现
//! 此处为把snum转换为十进制数字的方法
// export type Num<s extends string>=Split<s,"">["length"];
//可用于支持 1 2 4 8 16 等2 的幂次进制
//非幂次可自行发挥想象力。。
type MapFourBaseToBin=[
  ["0","00"],
  ["1","01"],
  ["2","10"],
  ["3","11"]
];
type MapOCTToBin=
[
  ["0","000"],
  ["1","001"],
  ["2","010"],
  ["3","011"],
  ["4","100"],
  ["5","101"],
  ["6","110"],
  ["7","111"]
]
// type MapHEXToBin=
// [
//   ["0","0000"],
//   ["1","0001"],
//   ["2","0010"],
//   ["3","0011"],
//   ["4","0100"],
//   ["5","0101"],
//   ["6","0110"],
//   ["7","0111"],
//   ["8","1000"],
//   ["9","1001"],
//   ["A","1010"],
//   ["B","1011"],
//   ["C","1100"],
//   ["D","1101"],
//   ["E","1110"],
//   ["F","1111"],
//   ["a","1010"],
//   ["b","1011"],
//   ["c","1100"],
//   ["d","1101"],
//   ["e","1110"],
//   ["f","1111"]
// ]
//进制映射器 可用于自定义进制

//注意 由于使用的Split函数有缺陷 有深度限制
//所有使用basemap 的进制转换 包括OCT等都存在问题
export type BaseMap<s extends CanBeString,mt extends MapUnit<any,any>[]>=_BaseMap<Split<s,"">,mt>;
export type _BaseMap<s extends CanBeString[],mt extends MapUnit<any,any>[]>=s extends [infer a,...infer b]?(
  MapTypeLong<a,mt> extends CanBeString?
  b extends CanBeString[]?
  //忽略错误
  // @ts-ignore
   `${MapTypeLong<a,mt>}${_BaseMap<b,mt>}`:never:never
):Zero;

//!目前OCT存在上限太低问题,尚未修复,Bin和Dec没有问题
// export type OCT<s extends string>=BinToSNum<BaseMap<s,MapOCTToBin>>;
export type Bin<s extends CanBeString>=BinToSNum<`${s}`>;

//!此处使用 乘法实现,递归深度为LogN级
 type _Dec<s extends string[]>=s extends [...infer b,infer a]?
(
  b extends []?  (a extends string?_MapDEC<a>:never):
  (
    //如果b不为空 把a*10 后传递到下一级
    a extends string? b extends string[]?
    sAdd<_MapDEC<a>,sMul<_Dec<b>,Ten>>:never:never
  )
):Zero;
export type Dec<s extends CanBeString>=_Dec<Split<`${s}`,"">>
//! 基于定义实现的OCT 和HEX 全部为LogN级深度,解决了上限问题
type _OCT<s extends string[]>=s extends [...infer b,infer a]?
(
  b extends []?  (a extends string?_MapOCT<a>:never):
  (
    //如果b不为空 把a*10 后传递到下一级
    a extends string? b extends string[]?
    sAdd<_MapOCT<a>,sMul<_OCT<b>,Eight>>:never:never
  )
):Zero;
export type OCT<s extends CanBeString>=_OCT<Split<`${s}`,"">>
// type a=OCT<"10">
//16进制
type _HEX<s extends string[]>=s extends [...infer b,infer a]?
(
  b extends []?  (a extends string?_MapHEX<a>:never):
  (
    //如果b不为空 把a*10 后传递到下一级
    a extends string? b extends string[]?
    sAdd<_MapHEX<a>,sMul<_HEX<b>,Sixteen>>:never:never
  )
):Zero;
export type HEX<s extends CanBeString>=_HEX<Split<`${s}`,"">>
//无法超过C 由于MAPTYPE限制
type a=HEX<"F">;
type bbb=sSub<HEX<"100">,a>
// type t=Num<a>
// type s=Num<a>
// export type DEC<s extends number,Now extends string=One>=s extends 0? Zero:
// (
//   Num<sMul<Now,"xx">> extends s?sMul<Now,"xx">:
//   (
//     //不是正好相等
//     sLessThan<sMul<Now,"xx">>
//   )
// );
// type a=DEC<5>
// export type HEX<s extends CanBeString[]>=BaseMap<s,MapHEXToBin>;

//准备把sNum系统改为Num系统 基于数组的数字体系
//改进num改为使用乘法实现
//原理为数数数到等于为止 由于无法判断大小
//如果snum可以变为logic 那么可以使用二分法实现
type __Num<a extends number,Now extends any[]=[]>=Push<Now,"x">["length"] extends a? Push<Now,"x">:__Num<a,Push<Now,"x">>;
//这个只能转换0-9
type _MapDEC<s extends string>=MapTypeLong<s,[
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
]>;
type _MapOCT<s extends string>=MapTypeLong<s,[
  ["0",""],
  ["1","x"],
  ["2","xx"],
  ["3","xxx"],
  ["4","xxxx"],
  ["5","xxxxx"],
  ["6","xxxxxx"],
  ["7","xxxxxxx"]
]>;
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
type s=_MapDEC<"9">
//10
export type Ten=sMul<"xxxxx","xx">;
export type Eight=sMul<"xxxx","xx">;
export type Sixteen=sMul<Eight,"xx">;
// type a=HEX<>

// type a=OCT<"176">
// type b=BinToSNum<a>

// type a=SplitDec<100>
type MapSDecToDec=[
  ["0",0],
  ["1",1],
  ["2",2],
  ["3",3],
  ["4",4],
  ["5",5],
  ["6",6],
  ["7",7],
  ["8",8],
  ["9",9],
];
//分割数字，最后是一个number数组
type SplitDec<a extends number|string>=MapElement<Split<`${a}`,"">,MapSDecToDec>;


//从snum到logic

//纯粹移位 得到的是下界
//! 这里得到的只是2的幂次 如果超过则不取 
type _SNumToLogic<T extends SNum,Now extends boolean[]=[],NowSum extends SNum=Zero>=
//移位匹配 移位=x2 
T extends Zero? [false]:
T extends One? [true]:
//移位 左移
//这里返回NowSum也即可SNum表示的数字,但此处直接返回true false数组 
//! 若此处返回NowSum则上面的false和true也应该改变为Zero和One
//! 此转换机制可改成多进制形式
Now extends [true,...infer S]? (
  sMoreThan<sMul<NowSum,Dec<2>>,T> extends [true]? Now:
  _SNumToLogic<T,[...Now,false],sMul<NowSum,Dec<2>>>
):_SNumToLogic<T,[true],Dec<1>>;
/**
 * 从snum转到Logic表示 即位串表示
 */
export type SNumToLogic<T extends SNum>=
//得到2的幂次  得到对应的SNum 把T减去已经得到的值后剩余的作为Rest
//如果Rest是Zero 那么直接返回 否则把Rest当做T再次求取Logic并合并数组到之前的
//把剩余转换来的值合并到后面 
sSub<T,LogicToSNum<_SNumToLogic<T>>> extends Zero?_SNumToLogic<T>:
MergeArrayEnd<_SNumToLogic<T>,SNumToLogic<sSub<T,LogicToSNum<_SNumToLogic<T>>>>>;

//! 基于位串表示实现从snUM到Bin的转化
export type SNumToBin<T extends SNum>=SNumToLogic<T> extends boolean[]? LogicToBin<SNumToLogic<T>>:never;
// type s=sMoreThan<"xxxx","xx">

// type b=SNumToLogic<"xxxxxxxx">
// type c=LogicToBin<b>
// type d=BinToSNum<c>;
// type t=sEqual<d,"xxxxxxxx">
// //type t=[true]
type k=SNumToBin<"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">
//把所有字符用某个字符代替

//type k = "101010"
//? 此处已经有 SNum到二进制的转化 而从SNum到10进制的转化尚未实现
//? 到10进制或其他的转化到底是直接从SNum开始还是要从Logic或Bin表示开始?
//? 数学运算由于只支持SNum 如果使用数学运算来从二进制数开始转化,得到的会是SNum表示的数
//? 而非一般十进制数,理论上如果把SNum的实现转为数组实现,则可以方便从length属性得到其值
//? 但可能失去字符串匹配的一些功能 从logic或bin开始转化可以建立映射表,但只能对2幂次
//? 进制进行转化,而十进制不行 ,从SNum开始,截取字符串 ,采用数数的方式进行处理
//? 此方法也可把Snum转为任意进制的数的字符串形式,或模拟上述二分匹配
//? 可使用10分匹配, 即一次乘10,如果不行再乘10,若超过则返回当前, 另一个type把剩余的拿去再次转化
//? 将之前转化的与现在转化的尾部对接,可将数组对接改为字符串对接 或数组对接后Join
//! 若使用复制上述的方式,则应该把递归结束部分,0 1 改为0到9  可用MapType实现
// type a=LogicToSNum<[false]>
