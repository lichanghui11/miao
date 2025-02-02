class MyArr<T> {
  length: number = 0; 
  [idx: number]: T;

  push(val: T): number {

    this[this.length] = val;
    this.length++;

    return this.length;
  }
  pop(): T {
    let res = this[this.length - 1];
    delete this[this.length - 1];

    return res;
  }
  slice(a: number, b: number): T[] {
    let temp:T[] = []; 
    for (let i = a; i < b; i++) {
      temp.push(this[i])
    }

    return temp;
  }
}
const aa = new MyArr<string>()
aa.push('dsj');


type ResolveT<T> = (val: T) => void;
type RejectT<T> = (rea: T) => void; 
class MyPromise2<T> {
  constructor(executor: (resolve: ResolveT<T>, reject: RejectT<T>) => void) {
    const re: ResolveT<T> = () => { } 
    const rj: RejectT<T> = () => { }
    executor(re, rj)
  }
  then<U, V>(onResolved: (val: U) => void, onRejected: (rea: V) => void): MyPromise2<U> {
    return new MyPromise2((resolve, reject) => {

    })
  }
}

let promise = new MyPromise2<number>(re => {
  re(33)
})

type pair = [string, number, object, Function];

const tem1: pair = ['dsfjfj', 33, {}, () => { }]

interface Foo{
  aa: number, 
  bb: string, 
  cc: boolean,
}
type dd = {
  [i: number]: string
}

type cc = keyof dd

type x = keyof Foo
const x1: Foo = {
  aa: 88, 
  bb: 'dsjf', 
  cc: false,
}

function getProperty<T, U extends keyof T>(obj: T, key: U) {
  return obj[key]
}

const tem3 = {
  'a': true, 
  'b': 2,
  c: 'djsfkfj',
}

type t = keyof typeof tem3

let tem4 = getProperty(tem3, 'a')

//使用interface声明函数类型
//接参数
interface Func {
  (a: string, b: number): object
}
//不接参数
interface Func1 {
  (): object
}
//构造函数
interface Ctor<T> {
  new ():T 
}
interface Ctor1<T> {
  new(a: string, b: boolean): T
}

//简单的ReturnType使用
interface Func {
  (a: number, b: string): object
}

type UnPromise<T> = T extends Promise<infer U> ? U : T

//实现Flatten将数组里面的值的类型推导出来
type Flatten<T> = T extends Array<infer U> ? U : T;
type Flatten1<T> = T extends any[] ?T[number] : T;
type aa = Flatten1<string[]>

//ReturnType: 函数的返回值的类型
type ReturnType1<T> = T extends (...args: infer U) => infer V ? V : T
type re = ReturnType1<() => boolean>
type re1 = ReturnType1<number>
//ArgType: 函数的参数的类型
type ArgType1<T> = T extends (...args: infer V) => infer U ? V : T
type ar = ArgType1<(a: number, b: string, c: boolean) => object>  

//Map类型
const mm = new Map<boolean, string>()
const nn12 = mm.set(false, 'dsfjkadsf')
type zz = ((args: string) => bigint) extends (args: number) => bigint ? boolean : number
type ReturnType2<T> = T extends (a: number) => infer U ? U : T
type zz1 = ReturnType2<() => string>

//使用联合类型 union验证双向推导
type ReturnedType3<T> = T extends (a: number | string, b: boolean) => object ? boolean : never
type uu = ReturnedType3<(a: string, b: boolean) => object>
//string 不是 number | string 的子集， 所以推导出来的类型值为never
type ReturnedType4<T> = T extends (a: string, b: boolean) => object ? boolean : never
type uu1 = ReturnedType4<(a: string | number) => object>
//string | number 可以是 string 的子集， 所以推导出来的类型值为boolean

//测试返回值的不同可能导致的推导类型的结果
type ReturnedType5<T> = T extends (a: number) => void ? boolean : never; 
type vv = ReturnedType5<(a: number) => number > 
//任何有返回值的函数可以是与其相同参数但返回值为空的函数的子集， 因此vv推导出来的类型为boolean
type ReturnedType6<T> = T extends (a: number) => number ? boolean : never; 
type vv1 = ReturnedType6<(a: number) => void>
//但是任何没有返回值的函数不是与其相同参数但返回值为非空的函数的子集， 因此vv1推导出来的类型为never

//如何推导出联合类型的数组： （string | number)[]
//类似这样的数组： ['djfk', 33]
type ToArr<T> = [T] extends [any] ? T[] : never;
type tt = ToArr<string | number>
const t1: tt = [22, 'djfk']
//注意以下写法只能推导出单个类型的数组
//类似这样的数组： string[] number[]
type ToArr1<T> = T extends any ? T[] : never;
type tt1 = ToArr1<string | number>
const t: tt1 = [33, 'djf'] //这里会报错

//mapped array 将一个类型转换为另一个类型
type Changed<T> = {
  [P in keyof T]: boolean
}
type ccc = Changed<{ a: string, b: number, c: symbol }>
//此时ccc已经由{a: string, b: number, c: symbol} 变为了{a: boolean, b: boolean, c: boolean}

//实现MyCapitalize: 将属性值的首字母大写
type Trans<T> = T extends 'a' ? 'A' : T | T extends 'b' ? 'B' : T | T extends 'c' ? 'C' : T
type MyCapitalize<T> = T extends `${infer U}${infer V}` ? `${Trans<U>}${V}` : never
//这里的infer实际上应该是使用了回溯算法， 开始匹配时优先给U类型分配一个字母， 以此类推
type ss = MyCapitalize<'coo'> //这里能够成功将‘coo'转换为‘Coo'

//实现MyExclude: 排除某个或某些属性
type MyExclude<keys, Ts> = keys extends Ts ? never : keys;
type ee = MyExclude<'foo' | 'bar' | 'aaa', 'aaa' | 'bar'> //成功排除了‘aaa'和'bar'

//监控对象的变化
type ExtractName<T> = `${keyof T & string}Changed`
function makeWatchObj<T>(obj: T) {
  return {
    on(event: ExtractName<T>, func: () => void) {

    }
  }
}
 makeWatchObj( {
  name: 'Esti', 
  age: 18, 
  id: 999,
})

// function watch<T>(obj: T): T & {
//   on<key extends keyof T>(
//     eventName: `${key & string}Changed`,
//     callback: (newVal: T[key]) => void
//   ): void;
// } {
// }

// function makeWatchedObject<T>(obj: T): T & {
//   on<Key extends keyof T>(
//     eventName: `${string & Key}Changed`,
//     callback: (newValue: T[Key]) => void
//   ): void;
// } {
//   // ...
// }

//Utility Types
//Await
// type Await1<T> = T extends Promise<infer U> ? U : never
// type Await2<T> = T extends Promise<Promise<infer U>> ? U : never
type Await2<T> = T extends Promise<infer U> ? Await2<U> : T
type a = Await2<Promise<string>>
type a1 = Await2<Promise<Promise<number>>>
type a2 = Await2<boolean | Promise<number>>
//对于联合类型， Await2会分别计算每个部分

//Utility Types: Partial
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
interface todo {
  title: string, 
  des: string,
}
type mm = MyPartial<todo>

//Utility Types: Required
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
}
type nn = MyRequired<mm>

//Utility Types: Readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

type rr = MyReadonly<nn>
let tem: rr = {
  title: 'he', 
  des: 'dkf',
}

tem.title = 'djf'//这里报错是因为这个属性只读， 无法赋值

//Utility Types: Pick
type MyPick<T, K extends keyof T> = {
  //至少要是string类型才能被遍历
  //K必须要是T类型的子集， 才能访问T[P]
  [P in K]: T[P]
}

//Utility Types: Omit
//MyOmit没有正确实现
type MyOmit<T, K extends keyof  T> = {
  [P in keyof T]: P extends K ? never : T[P]
}
interface temn {
  title: string, 
  des: string,
}
//以下是正确实现： 结合了Pick 与 Exclude
type MyOmit1<T, K extends keyof T> = MyPick<T, MyExclude<keyof T, K>>
type aaa = MyOmit1<temn, 'des'> //这里成功去除了'des'属性

//Utility Types: NonNullable<Type>
type MyNonNullable<T> = T extends undefined | null ? never : T
type T = MyNonNullable<string | undefined | null | number>

//Utility Types: Parameters<Type>
type MyParameters<T> = T extends (...args: infer U) => void ? U : T
type ttt = MyParameters<() => string>
