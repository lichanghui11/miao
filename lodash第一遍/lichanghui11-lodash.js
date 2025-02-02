var lichanghui11 = {
  chunk(array, size = 1) {
    var results = [];
    var res = [];
    for (var i = 0; i < array.length; i++) {
      res.push(array[i]);
      if (res.length === size) {
        results.push(res);
        res = [];
      }
    }
    if (res.length) results.push(res);
    return results;
  },

  compact(array) {
    var res = [];
    for (var item of array) {
      if (item) {
        res.push(item);
      }

    }
    return res;
  },

  concat(array, ...arguments) {
    for (var i = 0; i < arguments.length; i++) {
      if (Array.isArray(arguments[i])) {
        array.push(...arguments[i]);
      } else {
        array.push(arguments[i]);
      }
    }
    return array;
  },

  fill(array, value, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      array[i] = value;
    }
    return array;
  },

  drop(array, num = 1) {
    for (let i = 0; i < num; i++) {
      if (array) array.shift();
    }
    return array;
  },

  /*
passed: compact,chunk,fill,drop,flatten,flattenDeep,fromPairs, toPairs
head indexOf ,map lastIndexOf initial join last ,pull,reverse keyBy,forEach,

wrong answer: findIndex,findLastIndex,flattenDepth countBy


,,,,,,,,every,some
,groupBy,filter,reduce,reduceRight,size,sortBy,sample,
isUndefined,isNull,isNil,max,min,maxBy,minBy,round,sumBy
flagMap,flatMapDepth,get,has,mapKeys,mapValues
range,stringifyJSON,concat,isEqual,repeat,padStart,padEnd,pad,keys,values,random,
round,ceil,floor,cloneDeep
trim,trimStart,trimEnd,assign,merge,

  */
  
  


  map(collection, iteratee) {
    let res = [];
    if (Array.isArray(collection)) {
     if (typeof iteratee == 'function') {
        for (let i = 0; i < collection.length; i++) {
          let temp = iteratee(collection[i], i, collection);
          res.push(temp);
        }
      } else {
        for (let item of collection) {
          for (let it in item) {
            res.push(item[it]);
          }
        }
      }
   } else if (typeof collection === 'object') {
      for (let item in collection) {
        let temp = iteratee(collection[item])
        res.push(temp);
      }
    }
    return res;
  }, 

  forEach(collection, iteratee) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iteratee(collection[i], i, collection);
      }
    } else {
      for (let item in collection) {
        iteratee(collection[item], item);
      }
    }
  },

  keyBy(collection, iteratee) {
    let res = {};
    if (typeof iteratee === 'function') {
      for (let item of collection) {
        let temp = iteratee(item);
          res[temp] = item;
      }
      return res;
    } else {
      for (let item of collection) {
        let temp = item[iteratee];
        res[temp] = item;  
      } 
      return res;
    }
  }, 


  

 /*
 JavaScript: Check if an Object Has a Property Methods
    In operator
    Object.prototype.hasOwnProperty() method
    Object.hasOwn() method
    Check for undefined value
    Object.keys() and Array.prototype.some method
    Custom JavaScript util function.
*/

  reverse(array) {
    let res = [];
    for (let i = array.length - 1; i >= 0; i--) {
      res.push(array[i]);
    }
    return res;
  }, 

  pull(array, ...values) {
    let res = [];
    
    for (let i = 0; i < array.length; i++) {
      let isSame = false;
      for (let item of values) {
        if (array[i] === item) {
          isSame = true;
          break;
        }
      }
      if (isSame === false) res.push(array[i]);
    }
    return res;
  },

  last(array) {
    return array[array.length - 1];
  },

  join(array, separator = ',') {
    let res = '';
    for (let item of array) {
      res = res + item + separator;
    }
    return res.slice(0, res.length - 1);
  }, 

  initial(array) {
    return array.slice(0, array.length - 1);
  },

  lastIndexOf(array, value, fromIndex = array.length - 1) {
    for (let i = fromIndex; i > 0; i--) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  },

 

  flatten(array) {
    let res = [];
    for (let item of array) {
      if (Array.isArray(item)) {
        for (let it of item) {
          res.push(it);
        }
      } else {
        res.push(item);
      }
    }
    return res;
  },

  flattenDeep: function flattenDeep(array) {
    let res = [];
    for (let item of array) {
      if (Array.isArray(item)) {
        for (let it of flattenDeep(item)) {
          res.push(it);
        }
      } else {
        res.push(item);
      }
    }
    return res;
  },

  

  fromPairs(pairs) {
    let obj = {}; 
    for (let i = 0; i < pairs.length; i++) {
      if (Array.isArray(pairs[i])) {
        for (let j = 0; j < pairs[i].length; j += 2) {
          let key = pairs[i][j];
          let val = pairs[i][j + 1];
          obj[key] = val;
        }
      }
    }
    return obj;
  },

  toPairs(object) {
    let res = [];
    for (let item in object) {
      let ans = [];
      let val = object[item];
      let key = item.toString();
      ans.push(key);
      ans.push(val);
      res.push(ans);
    }
    return res;
  },

  head(array) {
    if (!array) return undefined;
    return array[0];
  },

  indexOf(array, value, fromIndex = 0) {
    for (let i = fromIndex; i < array.length; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  },


  

}

class MySet1 {
  constructor(array) {
    this._set = [];
    for (var item of array) {
      if (!this._set.includes(item)) this._set.push(item);
    }
  }

  has(val) {
    for (var item of this._set) {
      if (item === val) return true;
    }
    return false;
  }
}
function isArrayMatch(arr, array) {
  let i = 0;
  let j = 0;
  for (let key of arr) {

    if (key === array[i] && key.val === array[i + 1]) {
      return j;
    }
    j++;
    i += 2;
  }
  return -1;
}
