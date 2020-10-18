"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//此处
class test {
    get test() {
        return null;
    }
    hello() {
        return "";
    }
}
//23重类型 似乎嵌套只能嵌套23层
let a = new test();
a.test.test.test.test.test.test.test.test.test.test.hello();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxJQUFJO0FBRUosTUFBTSxJQUFJO0lBQ04sSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFxQixDQUFDO0lBQ2pDLENBQUM7SUFDTSxLQUFLO1FBQ1IsT0FBTyxFQUFvQixDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQUVELG1CQUFtQjtBQUNuQixJQUFJLENBQUMsR0FBQyxJQUFJLElBQUksRUFBc0IsQ0FBQTtBQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDIn0=