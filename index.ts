
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