"use strict";
//!对象映射与融合部分
//合并类型 如果不存在 直接赋值 如果是同名数组 变成|类型 如果是同名对象
//递归调用得到新类型
Object.defineProperty(exports, "__esModule", { value: true });
//例如modle设计思路 可使用getarray getobject 来包装复杂成员
//原封返回 但类型签名 变为Getter<object>
// export type s=MapRecursion<{
//     a:string;
//     b:number;
//     test:{
//         b:string;
//     }
// },[[string,number],[number,string]]>; 
// type a=s["test"]
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0VHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9iamVjdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLFlBQVk7QUFDWix1Q0FBdUM7QUFDdkMsV0FBVzs7QUFrRFgsMkNBQTJDO0FBQzNDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQixhQUFhO0FBQ2Isb0JBQW9CO0FBQ3BCLFFBQVE7QUFDUix5Q0FBeUM7QUFDekMsbUJBQW1CIn0=