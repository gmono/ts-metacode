//!字符串操作
export type CanBeString=string | number | bigint | boolean | null | undefined;
export type JOIN<x extends CanBeString[],sep extends CanBeString="">=x extends []? "": x extends [infer s,...infer rest]? s extends CanBeString? rest extends []? `${s}`:(rest extends CanBeString[]? `${s}${sep}${JOIN<rest,sep>}`:never):never:never;
export type Split<x extends CanBeString,sep extends CanBeString>=x extends ""? []:(
    x extends `${infer cont}${sep}${infer rest}`?(
        //还有后面
        [cont,...Split<rest,sep>]
    ):[x]
);
type a=Split<"aaa,bbb",",">
// type a=JOIN<["aaaa","bbbb"],",">

//二分法
//基于数字系统和Slice函数
// type SplitM<x extends CanBeString,sep extends CanBeString>=x extends ""? []:(
//     x extends `${infer cont}${sep}${infer rest}`?(
//         //还有后面
//         [cont,...Split<rest,sep>]
//     ):[x]
// );