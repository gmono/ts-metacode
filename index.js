"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
//!!!!!!数学部分结束
// type a=If<Equal<string,number>,string,number>;
// export type P<Str>=Str extends `${infer T}`? T:never;
// export type a=MapType<string,[[any,number]]>
__exportStar(require("./common"), exports);
__exportStar(require("./array"), exports);
__exportStar(require("./objectType"), exports);
__exportStar(require("./math"), exports);
__exportStar(require("./logic"), exports);
__exportStar(require("./string"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7Ozs7Ozs7Ozs7R0FhRzs7Ozs7Ozs7Ozs7O0FBYUgsY0FBYztBQUVkLGlEQUFpRDtBQUVqRCx3REFBd0Q7QUFDeEQsK0NBQStDO0FBRS9DLDJDQUF3QjtBQUN4QiwwQ0FBdUI7QUFDdkIsK0NBQTRCO0FBQzVCLHlDQUFzQjtBQUN0QiwwQ0FBdUI7QUFDdkIsMkNBQXdCIn0=