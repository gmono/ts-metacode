//这个可以使用元组代替 [A,B]
//普通固定映射器
//由于无法传递通用泛型 只能单个如 a,gen<a> b,gen<b> any,gen<any>
//如果要传递 gen 然后自动映射t为 gen<t>的话 目前没有办法
//可使用名字表法 建立类型 PackTable = "name"=>Pack
//也即建立一个通用泛型 接受 T和名字 得到一个新泛型
export type MapUnit<A,B,args extends any[]=[]>=[A,B,...args];
//通用占位符
export type None={};
//类型映射器 把T类型根据A映射表 映射为目的类型
//遵循 如果找不到就递归找的方法
//去除第一个 匹配第一个 第一个匹配上 返回 第一个匹配不上 返回对后续匹配的结果
//如果里面有一个不是mapunit 那么返回never  如果匹配结束还没匹配到 返回T
//这里对所有的特殊符号进行特殊处理 此处只有Pack 主要对B进行判断 如果负责进行特殊操作
//这里的A可以起到使用table表示程序的作用，即真值表。。
export type MapType<T,A extends any[]>=A extends [infer Now,...infer S]?
                         Now extends MapUnit<infer From,infer To,infer Args>?
                         T extends From? To:MapType<T,S>:never:T;
