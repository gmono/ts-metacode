

import type {SNumToBin,LogicToBin,BinToLogic,BinToSNum,sMul,sEqual,If,Zero,sDec, sDiv, LogicToSNum, Dec,sSub} from "."
// import { BinTransToLogic, sMul, sEqual, Zero, sDec, LogicToSNum } from './math';
import { Equal } from './logic';


type a=BinToSNum<"1110001">
type b=BinToSNum<"1001">
type ssssss=sMul<a,b>
type isok=sEqual<s,BinToSNum<"111111100">>;
type n=If<isok,"hello","world">
type sss=BinToLogic<"11111101">
type sssss=LogicToSNum<sss>;
//此处1

type ss=SNumToBin<sDiv<Dec<1256>,Dec<122>>>
type sts=sEqual<ss,Dec<2>>
type ssskk = Dec<7777>
type ret = If<sEqual<Dec<5>, Dec<2>>, ssskk, sSub<ssskk, Dec<2>>>;
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

type ttt<b,c>=If<Equal<b,c>,"hello","world">;
type s=ttt<1,2>;