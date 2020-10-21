
import { MapType, Push } from '.';

// type a=nAnd<[true,false],[false,true]>

import { MapElement, AND, NOT } from ".";
import { JOIN, CanBeString, Split } from './string';
import { MapUnit } from './common';
import { Concat, Tail } from './array';
import { OR } from './logic';

//!将01表示的二进制数字的字符串形式 和boolean数组互相转换
//bin和 logic的互换
export type BinToLogic<s extends string>=s extends "" ?[]:
                            s extends `0${infer tail}`? [false,...BinToLogic<tail>]:
                            s extends `1${infer tail}`? [true,...BinToLogic<tail>]:never;
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
//负数 目前不支持负数
// export type Minus<R extends string>=`-${R}`;
export type sMoreOrEqual<P extends  string,R extends string>=OR<sEqual<P,R>,sMoreThan<P,R>>;
export type sLessOrEqual<P extends  string,R extends string>=OR<sEqual<P,R>,sLessThan<P,R>>;
//比较
export type sMoreThan<P extends  string,R extends string>=P extends `${R}x`? [true]:[false];
export type sEqual<P extends  string,R extends string>=P extends R? [true]:[false];
export type sLessThan<P extends  string,R extends string>=AND<NOT<sMoreThan<P,R>>,NOT<sEqual<P,R>>>;

export type sInc<R extends string>=`${R}x`;
export type sDec<R extends string>=R extends `${infer T}x`? T:Zero;
export type sAdd<R extends string,P extends string>=`${R}${P}`;
export type sSub<R extends string,P extends string>=R extends `${P}${infer T}`? T:never;
//这个还是逐步增加的 需要改为二分
export type sMul<R extends string,P extends string>=P extends  Zero? Zero:(
  `${R}${sMul<R,sDec<P>>}`
)
//! 注意 关键 ，当计算泛型参数时是一起计算的 而 extends短路 因此用if可能导致递归无限
//需要处理p大于r的情况
//!应当改为使用二分法做除法 即倍乘直到大于,然后再回溯,回溯可通过带当前状态变量来实现,但可能深度过高
export type sDiv<R extends string,P extends string,NowTry extends string=One>=
P extends  Zero? never:sMoreThan<P,R> extends [true]? Zero:(
  //逆运算
  //可能无限循环 如果不能整除
  //要检测 如果大于 则直接返回
  sMul<P,NowTry> extends R? NowTry:(
    sMoreThan<sMul<P,sInc<NowTry>>,R> extends [true]? NowTry:
      sDiv<R,P,sInc<NowTry>>
      )
);
// type test=sDiv<"xxx","xxxx">

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
export type Num<s extends string>=Split<s,"">["length"];
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
  MapType<a,mt> extends CanBeString?
  b extends CanBeString[]?
   `${MapType<a,mt>}${_BaseMap<b,mt>}`:never:never
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
type a=OCT<"10">
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
type a=Dec<10>;
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
type _MapDEC<s extends string>=MapType<s,[
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
]>
type _MapOCT<s extends string>=MapType<s,[
  ["0",""],
  ["1","x"],
  ["2","xx"],
  ["3","xxx"],
  ["4","xxxx"],
  ["5","xxxxx"],
  ["6","xxxxxx"],
  ["7","xxxxxxx"]
]>;
type _MapHEX<s extends string>=MapType<s,[
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
  ["k","xxxxxxxxxx"],
  ["B","xxxxxxxxxxx"],
  ["C","xxxxxxxxxxxx"],
  ["D","xxxxxxxxxxxxx"],
  ["E","xxxxxxxxxxxxxx"],
  ["F","xxxxxxxxxxxxxxx"],
]>
// type s=_MapHEX<"f">
//10
type Ten=sMul<"xxxxx","xx">;
type Eight=sMul<"xxxx","xx">;
type Sixteen=sMul<Eight,"xx">;
// type a=HEX<>

// type a=OCT<"176">
// type b=BinToSNum<a>

type a=SplitDec<100>
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