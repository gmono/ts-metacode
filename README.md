# 说明
**typescript元编程使用的包**

功能有几大部分:
1. **逻辑**，包括If Equal 等通用比较模板和完整的基于与非运算的数理逻辑系统
2. **数学**，基于字符串实现，支持自然数运算，最高支持12位左右的数学运算，拥有2种表示方式，二进制字符串表示和内部表示（SNum），提供转换模板，转换为内部表示后可进行计算和比较，弥补typescript元编程不支持数字运算的不足。**支持加减乘除四则运算，支持大于小于等于的数字比较，数字比较的结果与逻辑系统兼容，可直接用于控制流**
3. **数组操作**，支持对数组元素进行类型映射，添加删除等，,包括**typescript-tuple**包的大部分功能，**同时支持Filter，Zip等常见操作**
4. **对象类型**，支持对象类型的映射和融合，其中融合为自定义的融合策略，实际对象融合函数需要自己实现，按照预定义的融合策略来，如同名数组属性应该concat或混合，不应该替换，同名属性会被转换为 A|B类型等
5. **类型操作**，主要是类型映射器，类型映射表示单元，MapUnit，空值类型None，可用于对各种类型进行映射，可提供一个如[[a,b],[b,c],[c,d]]的数组用于表示映射规则，可实现爬虫等model类型到内容类型的转换（结合对象类型操作部分）
6. **字符串操作**,目前实现的有JOIN和Split,未来将加入更多操作
# 注意事项
**Logic系统中不使用普通的true和false，而使用[true],[false]，方便多位运算**
**所有的逻辑操作都可同时对一个boolean数组执行**
# 功能示例
## 数组操作
**包括普通的增删改查，包括两个特殊的Remove系列函数，可实现从后面或前面切除一段同样的序列，返回剩下的,拥有MapElement和Filter 两个集合操作函数，其中Filter配套有一系列判断模板，如DeleteSome函数,下方字符串过滤功能演示用到了此函数**
```ts
type a=Push<[1,2],1>;
type b=Concat<a,a>;
type c=Concat<b,b>;
type d=Shift<c,3>;
type e=RemoveEnd<d,[1,2,1]>;
type f=Tail<e>;
//type f = [1, 2, 1, 1, 2, 1, 1, 2, 1]
type h=MapElement<f,[[1,5],[2,"hello"]]>
//type h = [5, "hello", 5, 5, "hello", 5, 5, "hello", 5]
```
## 字符串过滤
```ts
//此为数组操作
type aaa=Filter<["","a",""],DeleteSome<[""]>>
//aaa=["a"]
```

## 字符串合并与拆分
```ts
type a=JOIN<["aaaa","bbbb"],",">//a="aaaabbbbb"
type b=Split<"aaa","">;//b=["a","a","a"]
type c=Split<"aaa,bbb","">;//a = ["aaa", "bbb"]
```

## 数组类型映射
```ts

type a=MapElement<[1,2,3,4],[[4,1],[1,2],[2,3],[3,4]]>;
//type a = [2, 3, 4, 1]
```

## 对象类型递归映射
```ts
type s=MapRecursion<{
    a:string;
    b:number;
    test:{
        b:string;
    }
},[[string,number],[number,string]]>; 
/**
 type s = {
    a: number;
    b: string;
    test: {
        b: number;
        }
};

*/
```
**注意，MapElement和其别名MapProp 可用于对Object的属性类型进行单层隐射**
## 数字与比较
**特殊值有：Zero，One ，所有运算都以小写s开头，包括三个比较运算 ＞ ＜ ＝，四则运算，配合extends语句可实现复杂的自定义公式**
```ts
type a=BinToSNum<"1110001">
type b=BinToSNum<"1001">
type s=sMul<a,b>
type isok=sEqual<s,BinToSNum<"1111111001">>;
type n=If<isok,"hello","world">
//type n = "hello"
//此时s为1017个x组成的字符串
```

## 基于数字计算的有类型嵌套类
**目前测得可最多嵌套23层,嵌套过程中不丢失类型**
```ts
class test<A extends string,H=(sEqual<A,Zero> extends [false]? test<sDec<A>>:void)>{
    get test():H{
        return null as unknown as  H;
    }
    public hello():(H extends void? "hello":"word"){
        return "" as unknown as any;
    }
}

//23重类型 似乎嵌套只能嵌套23层
let a=new test<BinToSNum<"10111">>()
a.test.test.test.test.test.test.test.test.test.test.hello();
```

## 逻辑控制
**注意，使用If等控制流模板前，应该考虑求值是否递归，因为传递如模板的参数，都会预先计算好，而extends运算是短路的，使用If代替extends可能导致无穷递归问题，建议在then和else是可直接求值的情况下，使用If等控制流模板**
```ts
type ttt<b,c>=If<Equal<b,c>,"hello","world">;
type s=ttt<1,2>;
//type s = "world"
```
**请谨慎使用控制流，切勿在递归类型的定义中使用控制流代替extends语句**

## 逻辑运算
**逻辑运算包括，与或非，异或同或，蕴含式，等价式（双条件式），理论上可用于实现命题逻辑系统，未来可能添加量词支持谓词逻辑运算**
**注意，EQ和XNOR的定义不同，XNOR基于XOR运算定义，EQ基于INFER运算定义，以下代码证明其恒定**
```ts
type a<b,c>=EQ<EQ<b,c>,XNOR<b,c>>;
type tt=[a<[false],[false]>,a<[true],[false]>,a<[false],[true]>,a<[true],[true]>];
//tt=[[true],[true],[true],[true]]
//由此可知，a为永真式，即EQ恒等于XNOR
//((a->b) and (b->a))<->(not(a^b))
```

# 计划说明
本包为元编程支持包，未来会吸纳各种相关包到其中，下一步将会把typescript-tuple包括进来