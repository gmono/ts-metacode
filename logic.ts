import { MapUnit, MapElement, Zip } from ".";

//逻辑部分
export type If<cond,then,Else>=cond extends [true]? then:Else;
//比较 广泛比较 可比较任意的ab 和数字逻辑中的双条件不一样
export type Equal<a,b>=a extends b? [true]:[false];
//二元映射 A R B->C
//二元映射给予mapexport type实现
export type RMapUnit<a,b,c>=MapUnit<[a,b],c>; //=[[a,b],c]
//将使用乘法表和进位法实现 加减乘除运算
//使用类型映射实现bool逻辑运算 更多有待添加
// export type XOR<a,b>=MapType<[a,b],[
//                             RMapUnit<true,false,true>,
//                             RMapUnit<false,false,false>,
//                             RMapUnit<false,true,true>,
//                             RMapUnit<true,true,false>
//                         ]>
//                         ;
//与非门 此时可构建数字计算系统
//直接就是多位的如果要单位的直接特化
//!一切逻辑基于与非门构建
export type NOT<a>=MapElement<a,[
    [true,false],
    [false,true]
]>
//直接类型映射 ，可能导致提前求值问题，
export type AND<a,b>=MapElement<Zip<a,b>,[
    RMapUnit<true,false,false>,
    RMapUnit<false,false,false>,
    RMapUnit<false,true,false>,
    RMapUnit<true,true,true>
]>;

export type XOR<a,b>=OR<AND<a,NOT<b>>,AND<b,NOT<a>>>;
export type XNOR<a,b>=NOT<XOR<a,b>>;
//蕴含式 单独使用可以  复合起来就会出问题
export type INFER<a,b>=OR<NOT<a>,b>;
//? 注意这里是以前的注释，这里是说在not使用extends 实现的时候，单位位运算时，出现的不一致问题，可能
//? extends 操作并不能完全代替真值表映射 当前改为多位运算并使用Map操作实现后 已经正常
//!双条件 这里是ts 4.1的bug  因为这里EQ应该和Equal一致 此处使用Equal代替 
//! 或可用XNOR代替 理论上XNOR与EQ等价 这里EQ不能工作 而XNOR和Equal可以 情况奇特 可能是And的直接求值导致的
export type EQ<a,b>=AND<INFER<a,b>,INFER<b,a>>;


//这里竟然是永真式 md
//? 看似是因为extends 运算的自己的特性，而使用映射表实现Not操作可有效避免这种问题
// type aa<a,b>=INFER<INFER<a,b>,INFER<b,a>>

//魔幻 EQ 和 XNOR不同 其实他们应该是等价的
// XNOR应该可以和双条件等价 ，并可分解为 (a->b) and (b->a)
// type k=EQ<true,false> extends XNOR<true,false>? true:false;
export type OR<a,b>=NOT<AND<NOT<a>,NOT<b>>>;