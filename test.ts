import type {LogicToBin,BinToLogic,BinToSNum,sMul,sEqual,If,Zero,sDec} from "."
// import { BinTransToLogic, sMul, sEqual, Zero, sDec } from './math';
import { Equal } from './logic';


type a=BinToSNum<"1110001">
type b=BinToSNum<"1001">
type s=sMul<a,b>
type isok=sEqual<s,BinToSNum<"1111111001">>;
type n=If<isok,"hello","world">
//此处

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