/*
//构建一个class, maxHeap, 堆顶为最大值；
class PriorityQueue {
    constructor() {
        this._nums = [];
    }

    get size() {
        return this._nums.length;
    }

    peek(i) {
        return this._nums[i];
    }

    push(value) {
        if (this._nums.length === 0) {
            this._nums.push(value);
        } else {
            this._heapUp(value)
        }
        return this;
    }

    _swap(i, j) {
        let temp = this._nums[i];
        this._nums[i] = this._nums[j];
        this._nums[j] = temp;
    }

    _heapUp(value) {
        this._nums.push(value);
        let i = this._nums.length - 1;
        while (i > 0) {
            let parentI = (i - 1) >>> 1;
            if (this._nums[i] > this._nums[parentI]) {
                this._swap(i, parentI);
                i = parentI;
            } else {
                break;
            }
        }
        return this;
    }

    pop() {
        //删除堆顶的元素
        if (this.length < 3) {
            return this._nums.shift();
        }
        let result = this._nums[0];
        this._nums[0] = this._nums[this._nums.length - 1];
        this._heapDown(0)
        return result;
    }

    _heapDown(i) {
        while (true) {
            let maxI = i;
            let leftI = maxI * 2 + 1;
            if (leftI < this._nums.length && this._nums[leftI] > this._nums[maxI]) {
                maxI = leftI;
            }
            let rightI = maxI * 2 + 2;
            if (rightI < this._nums.length && this._nums[rightI] > this._nums[maxI]) {
                maxI = rightI;
            }
            if (maxI !== i) {
                this._swap(maxI, i);
                i = maxI;
            } else {
                break;
            }
        }
        return this;
    }
}
*/


class PriorityQueueMax {
  //为最大堆创建类；
  constructor() {
    this._items = [];
  }

  peek (i) {
    return this._items[i];
  }

  get size() {
    return this._items.length;
  }

  pop() {
    //从堆顶取出元素并返回， 且维护堆的性质；
    if (this._items.length < 3) {
      return this._items.shift();
    }
    let res = this._items[0];
    let lastItem = this._items.pop();
    this._items[0] = lastItem;
    this._heapDown(0);
    return res;
  }

  _swap(i, j) {
    let temp = this._items[i];
    this._items[i] = this._items[j];
    this._items[j] = temp;
  }

  _heapDown(i) {
    //堆顶为原堆末尾的值， 破坏了堆的性质， 需重新维护堆的性质；
    //i为需要调整位置的值的索引；
    while (true) {
      let largeI = i;
      let leftI = largeI * 2 + 1;
      let rightI = leftI + 1;

      if (leftI < this._items.length && this._items[leftI] > this._items[largeI]) {
        largeI = leftI;
      }
      if (rightI < this._items.length && this._items[rightI] > this._items[largeI]) {
        largeI = rightI;
      }
      if (largeI !== i) {
        this._swap(largeI, i);
        i = largeI;
      } else {
        break;
      }

    }
  }

  push(val) {
    //在堆的末尾增加新的值， 并维护堆的性质；
    this._items.push(val);
    let i = this._items.length - 1;
    this._heapUp(i);
    return this;
  }

  _heapUp(i) {
    //i为当前插入的值的索引位置；
    while (i > 0) {
      let parentI = (i - 1) >>> 1;
      if (this._items[i] > this._items[parentI]) {
        this._swap(i, parentI);
        i = parentI;
      } else {
        break;
      }
    }
    return this;
  }

}

function swap (arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function heapDown (arr, i, length) {
  //在各个子树里进行堆化；
  while (true) {
    let largeI = i;
    let leftI = largeI * 2 + 1;
    let rightI = leftI + 1;
    if (leftI < length && arr[leftI] > arr[largeI]) {
      largeI = leftI;
    }
    if (rightI < length && arr[rightI] > arr[largeI]) {
      largeI = rightI;
    }
    if (largeI !== i) {
      swap(arr, largeI, i);
      i = largeI;//将原来位置的值重新赋到新的i中重新进入循环进行判断；
    } else {
      break;
    }
  }
}

function heapify (arr) {
  //将给定的数组按照堆的方式摆放, 不创建新的队列， 减少空间占用；
  let lastP = Math.floor((arr.length / 2) - 1);
  while (lastP >= 0) {
    heapDown(arr, lastP, arr.length);
    lastP--;
  }
  return arr;
}

function heapSort2 (arr) {
  heapify(arr);
  let length = arr.length - 1;
  while (length > 0) {
    swap(arr, 0, length);
    heapDown(arr, 0, length);
    length--;
  }
  return arr;
}


function heapSort1 (arr) {
  //创建新的优先队列， 调用相关方法；
  let queue = new PriorityQueue();
  for (let item of arr) {
    queue.push(item);
  }
  for (let i = arr.length - 1; i > -1; i--) {
    arr[i] = queue.pop();
  }
  return arr;
}

function randomArr (n) {
  //生成随机数组；
  let res = [];
  for (let i = 0; i < n; i++) {
    let num = Math.floor(Math.random() * i) 
    res.push(num);
  }
  return res;
}

class PriorityQueueMin {
  //创建最小堆; 
  constructor () {
    this._data = [];
  }

  get size () {
    return this._data.length;
  }

  peek (i) {
    return this_data[i];
  }

  pop () {
    //取出堆顶的最小元素并返回；
    let minValue = this._data[0];
    this._data[0] = this._data[this._data.length - 1];
    this._data.length--;
    //此刻堆顶为堆末尾的值， 非最小值， 需要heapifyDown将这个值移动到正确位置；
    this._heapifyDown(0);

    return minValue;
  }

  push (value) {
    //往最小堆中增加值， 将其放在合适位置， 并返回队列；
    this._data.push(value);
    let length =this._data.length - 1;
    this._heapifyUp(length);

    return this
  }
  
  _heapifyUp (i) {
    while (i >= 0) {
      let currentI = i;
      let parentI = Math.floor((currentI - 1) / 2);
      if (this._data[parentI] > this._data[currentI]) {
        this._swap(parentI, currentI);
        i = parentI;
      } else {
        break;
      }
    }
  }

  _swap (i, j) {
    let temp = this._data[i];
    this._data[i] = this._data[j];
    this._data[j] = temp;
  }

  _heapifyDown (i) {
    while (i < this._data.length) {
      let currentI = i;
      let leftChildI = currentI * 2 + 1;
      let rightChildI = leftChildI + 1;
      if (leftChildI < this._data.length && this._data[leftChildI] < this._data[currentI]) {
        currentI = leftChildI;
      }
      if (rightChildI < this._data.length && this._data[rightChildI] < this._data[currentI]) {
        currentI = rightChildI;
      }
      if (currentI !== i) {
        this._swap(currentI, i);
        i = currentI;
      } else {
        break;
      }
    }
  }
}