class Vector {
  constructor(x, y) {
    this._x = x; 
    this._y = y; 
  }
  plus(v) {
    let x = v._x + this._x;
    let y = v._y + this._y;
    return new Vector(x, y); 
  }
  minus(v) {
    let x = this._x - v._x; 
    let y = this._y - v._y; 
    return new Vector(x, y); 
  }
  div(v) {
    let x = this._x / v._x; 
    let y = this._y / v._y; 
    return new Vector(x, y);
  }
}

class Complex {
  constructor(real, imag) {
    this._real = real; 
    this._imag = imag;
  }
  plus(complex) {
    let real = this._real + complex._real; 
    let imag = this._imag + complex._imag; 
    return new Complex(real, imag); 
  }
  minus(complex) {
    let real = this._real - complex._real;
    let imag = this._imag - complex._imag; 
    return new Complex(real, imag); 
  }
  multiply(complex) {
    let real = this._real * complex._real - this._imag * complex._imag; 
    let imag = this._imag * complex._real + this._real * complex._imag; 
    return new Complex(real, imag); 
  }
  div(complex) {
    let helper = new Complex(complex._real, -complex._imag)
    let m = this.multiply(helper);
    let 分子 = m._real; 
    let imag = m._imag;
    let 分母 = complex._real * complex._real + complex._imag * complex._imag; 
    let real = 分子 / 分母; 
    return new Complex(real, imag); 
  }
  toString() {
    return '' + this._real + (this._imag < 0 ? this._imag : ('+' + this._imag)) + 'i';
 }
}

class LinkedList {
  constructor(val) {
    this._val = val;
    this._next = null;
    this._length = 1;
  }
  append(val) {
    this._length++;
    if (this === null) return new LinkedList(val);
    if (this._next === null) {
      this._next = new LinkedList(val); 
      return this;
    }
    let pointer = this; 
    while (pointer._next) {
      pointer = pointer._next; 
    }
    pointer._next = new LinkedList(val); 
    return this;
  }
  prepend(val) {
    this._length++;
    let head = new LinkedList(val);
    head._next = this; 
    return head; 
  } 
  get size() {
    return this._length; 
  } 
  at(index) {
    if (index < 0) return undefined; 
    if (index === 0) return this._val; 
    let pointer = this; 
    while (index > 0 && pointer) {
      pointer = pointer._next; 
      index--; 
    }
    if (!pointer) return undefined;
    else return pointer._val;
  }
  set(index, val) {
    let dummy = new LinkedList(0); 
    dummy._next = this;
    let pointer = dummy; 
    while (index > 0 && pointer._next) {
      pointer = pointer._next; 
      index--; 
    }
    let temp = pointer._next; 
    pointer._next = new LinkedList(val); 
    pointer._next._next = temp; 
    this._length++;
    return dummy._next;
  }
  pop() {
    if (!this) return null; 
    this._length--; 
    if (!this._next) {
      this._length--; 
      let temp = this;
      this = this._next;
      return temp._val; 
    }
    if (!this._next._next) {
      let temp = this._next; 
      this._next = null; 
      return temp._val; 
    }
    let pointer = this; 
    while (pointer._next._next) {
      pointer = pointer._next;
    }
    let temp = pointer._next; 
    pointer._next = null; 
    return temp._val; 
  }
  shift() {
    if (!this) return null; 
    this._length--;
    let pointer = this._next; 
    return pointer; 
  }
  toArray() {
    let res = []; 
    let pointer = this; 
    while (pointer) {
      res.push(pointer._val); 
      pointer = pointer._next;
    }
    return res; 
  }
  toString() {
    return this.toArray().join(''); 
  }
}

class MyMap {
  constructor(key, val) {
    this._pairs = [key, val];
  }
  set(key, val) {
    let setted = false; 
    for (let i = 0; i < this._pairs.length; i += 2) {
      if (this._pairs[i] === key) {
        this._pairs[i + 1] = val; 
        setted = true; 
      }
    }
    if (setted === false) this._pairs.push(key, val); 
    return this._pairs;
  }
  get(key) {
    for (let i = 0; i < this._pairs.length; i += 2) {
      if (this._pairs[i] === key) return this._pairs[i + 1]; 
    }
    return undefined; 
  }
  get size() {
    return this._pairs.length / 2; 
  }
  has(key) {
    for (let i = 0; i < this._pairs.length; i += 2) {
      if (this._pairs[i] === key) return true;
    }
    return false; 
  }
  clear() {
    return []; 
  }
  delete(key) {
    for (let i = 0; i < this._pairs.length; i += 2) {
      if (this._pairs[i] === key) {
        this._pairs.splice(i, 2); 
      } 
    }
  }
  forEach(func) {
    for (let i = 1; i < this._pairs.length; i += 2) func(this._pairs[i]);
  }
}

class MySet {
  constructor() {
    this.set = [];
  }
  add(val) {
    for (item of this.set) {
      if (item === val) {
        return this.set; 
      }
    }
    this.set.push(val); 
    return this.set; 
  }
  get size() {
    return this.set.length; 
  }
  delete(val) {
    for (let i = 0; i < this.set.length; i++) {
      if (this.set[i] === val) {
        this.set.slice(i, i + 1); 
        return true; 
      }
    }
    return false; 
  }
  has(val) {
    for (let i = 1; i < this.set.length; i++) {
      if (this.set[i] === val) return true; 
    }
    return false; 
  }
}

function Stack() {
  this.map = [];
}
Stack.prototype.push = function (val) {
  this.map.push(val); 
  return this; 
}

Stack.prototype.pop = function (val) {
  return this.map.pop()
}
Stack.prototype.peek = function (val) {
  return this.map[this.map.length - 1];
}
Stack.prototype.size = function () {
  return this.map.length; 
}

class Queue {
  constructor() {
    this.head = null; 
    this.tail = null;
    this.length = 0; 
  }
  add(val) {
    this.length++;
    if (this.head === null) {
      this.head = this.tail = new ListNode(val); 
      return this.head; 
    }
    this.tail.next = new ListNode(val); 
    this.tail = this.tail.next; 
    return this.head;
  }
  pop() {
    let temp = this.head.val; 
    this.head = this.head.next; 
    this.length--;
    return temp;
  }
  get size() {
    return this.length;
  }
}