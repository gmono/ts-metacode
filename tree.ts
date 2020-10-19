//! 准备实现数组的自底向上构建


//! 考虑通过构造解决扫描问题
//! 首先编写树形发构造函数,把一个数组构造为一个树形数组,方便之后处理,即通过构造
//! 自底向上,进行提前递归,由于无法直接二分,因此直接改变序列为树形,通过处理树形数据
//! 自动二分  二重化函数->树形化函数->二分处理函数
//! 构建二叉树

//? 此处查明: 数量不够 直接失败    rest若没有 为[] 
type ToDouble<s extends any[]>=
s extends []? []:
s extends [infer a]?[[a]]:
s extends [infer a,infer b,...infer rest]?(
    rest extends []? [[a,b]]:
    [[a,b],...ToDouble<rest>]
):never;
//! 多重double化
export type Tree<s extends any[]>=
s extends []? []:
ToDouble<s> extends [s]?s:
//两个元素或以上 先进行一次double 然后再truee
Tree<ToDouble<s>>;
//! 注意此处二叉树为平衡二叉树
//! 注意可能出现单分支  此二叉树的所有分支深度相等
//分别处理只有一个叉时 没有叉时 也就是空 两个叉时 标准范式

//平坦化函数
//! 注意只能给二叉树用平坦化函数
/**
 * 二叉树专用
 */
type Flatten<a extends any[]>=
a extends []? []:
a extends [infer a]? a extends any[]?Flatten<a>:[a]:
a extends [infer left,infer right]? 
(
    //二叉
    left extends any[]? right extends any[]?
    [...Flatten<left>,...Flatten<right>]:[left,right]:[left,right]
):never;
type t=Tree<[1,2,3,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4]>
type s=Flatten<t>;