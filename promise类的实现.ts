

class MyPromise<T> {
  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    // resolve1: (val: T) => void; 
    // function resolve1(value: T): void{
    // 
    // }
    const resolve1: (val: T) => void = (val) => {

    }

    function reject1(reason: any): void {
      
    }

    executor(resolve1, reject1);
  }

  then<V, U>(onResolve: (value: T) => U, onReject: (reason: any) =>V): MyPromise<U | V> {
    return new MyPromise((resolve, reject)=> {

    })
  }
}



type resolver1<T> = (value: T) => void;
type rejector1 = (reason: any) => void;
type executor1<T> = (resolve: resolver1<T>, reject: rejector1) => void;

class MyPromise1<T> {
  constructor(execute: executor1<T>) {}

  then<V, U>(onResolve: (value: T) => U, onReject: (reason: any) => V): MyPromise<U | V> {
    return new MyPromise1((resolve, reject) => {});
  }
}

let temp = new MyPromise<number>((re, rj) => {
  re(44);
})

let a = temp.then(val => {
  return 'dd';
}, rea => {
  return 55;
})