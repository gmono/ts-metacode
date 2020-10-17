import { MapType } from '.';

// type a=nAnd<[true,false],[false,true]>

import { MapElement, AND, NOT } from ".";
import { JOIN, CanBeString, Split } from './string';
import { MapUnit } from './common';
import { Concat } from './array';

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
export type Zero="";
export type One="x"
//负数 目前不支持负数
export type Minus<R extends string>=`-${R}`;
//比较
export type sMoreThan<P extends  string,R extends string>=P extends `${R}x`? [true]:[false];
export type sEqual<P extends  string,R extends string>=P extends R? [true]:[false];
export type sLessThan<P extends  string,R extends string>=AND<NOT<sMoreThan<P,R>>,NOT<sEqual<P,R>>>;

export type sInc<R extends string>=`${R}x`;
export type sDec<R extends string>=R extends `${infer T}x`? T:Zero;
export type sAdd<R extends string,P extends string>=`${R}${P}`;
export type sSub<R extends string,P extends string>=R extends `${P}${infer T}`? T:never;
export type sMul<R extends string,P extends string>=P extends  Zero? Zero:(
  `${R}${sMul<R,sDec<P>>}`
)
//! 注意 关键 ，当计算泛型参数时是一起计算的 而 extends短路 因此用if可能导致递归无限
//需要处理p大于r的情况
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
//!从snum转换回到bin和logic 目前没有实现 数字运算和比较在snum状态 并不需要转换回去


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
export type BaseMap<s extends CanBeString,mt extends MapUnit<any,any>[]>=_BaseMap<Split<s,"">,mt>;
export type _BaseMap<s extends CanBeString[],mt extends MapUnit<any,any>[]>=s extends [infer a,...infer b]?(
  MapType<a,mt> extends CanBeString?
  b extends CanBeString[]?
   `${MapType<a,mt>}${_BaseMap<b,mt>}`:never:never
):Zero;

export type OCT<s extends CanBeString>=BaseMap<s,MapOCTToBin>;
// export type HEX<s extends CanBeString[]>=BaseMap<s,MapHEXToBin>;

// type a=HEX<>

// type a=OCT<"176">
// type b=BinToSNum<a>
