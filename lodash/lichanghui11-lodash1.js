/*
  以下为书写建议： 
  function chunc1(){
  

  }
  return {
    chunc: chunc1, 
  }
*/

var lichanghui11 = function () {
  function compact(arr) {
    let res = [];
    for (let item of arr) {
      if (item) res.push(item);
    }
    return res;
  }

  function chunk(arr, size = 1) {
    let res = [];
    let k = 0;
    let i = 0
    while (i < arr.length) {
      let temp = size;
      while (temp > 0) {
        if (!res[k]) {
          if (i > arr.length - 1) break;
          else res[k] = [arr[i]];
        } else {
          if (i > arr.length - 1) break;
          else res[k].push(arr[i]);
        }
        temp--;
        i++;
      }
      k++;
    }
    return res;
  }

  function fill(arr, val, start = 0, end = arr.length) {
    for (let i = start; i < end; i++) {
      arr[i] = val;
    }
    return arr;
  }

  function drop(arr, n = 1) {
    let res = [];
    for (let i = n; i < arr.length; i++) {
      res.push(arr[i]);
    }
    return res;
  }

  function findIndex(arr, func, fromIndex = 0) {
    if (typeof func === 'function') {
      for (let i = fromIndex; i < arr.length; i++) {
        if (func(arr[i])) return i;
      }
      return -1;
    } else if (Array.isArray(func)) {
      let key = func[0], val = func[1];
      for (let i = fromIndex; i < arr.length; i++) {
        if (arr[i][key] === val) return i;
      }
      return -1;
    } else if (typeof func === 'object') {
      for (let i = fromIndex; i < arr.length; i++) {
        if (_isEqual(arr[i], func)) return i;
      }
      return -1;
    } else {
      for (let i = fromIndex; i < arr.length; i++) {
        if (arr[i][func]) return i;
      }
      return -1;
    }
  }
  function _isEqual(obj1, obj2) {
    for (let key in obj1) {
      if (obj1[key] !== obj2[key]) return false;
    }
    for (let key in obj2) {
      if (obj2[key] !== obj1[key]) return false;
    }
    return true;
  }


  function findLastIndex(arr, predicate, fromIndex = arr.length - 1) {
    if (typeof predicate === 'function') {
      for (let i = fromIndex; i > -1; i--) {
        if (predicate(arr[i])) return i;
      }
      return -1;
    } else if (Array.isArray(predicate)) {
      let key = predicate[0], val = predicate[1];
      for (let i = fromIndex; i > -1; i--) {
        if (arr[i][key] === val) return i;
      }
      return -1;
    } else if (typeof predicate === 'object') {
      for (let i = fromIndex; i > -1; i--) {
        if (_isEqual(arr[i], predicate)) return i;
      }
      return -1;
    } else {
      for (let i = fromIndex; i > -1; i--) {
        if (arr[i][predicate]) return i;
      }
      return -1;
    }
  }

  function flatten(arr) {
    let res = [];
    for (let item of arr) {
      if (Array.isArray(item)) {
        res.push(...item);
      } else {
        res.push(item);
      }
    }
    return res;
  }

  function flattenDeep(arr) {
    let res = [];
    for (let item of arr) {
      if (Array.isArray(item)) {
        res.push(...flattenDeep(item));
      } else {
        res.push(item);
      }
    }
    return res;
  }

  function reduce(collection, iteratee, accumulator) {
    if (Array.isArray(collection)) {
      if (accumulator == undefined) initial = arr[0];
      else initial = accumulator;
      for (let i = 0; i < collection.length; i++) {
        initial = iteratee(initial, collection[i], i, collection);
      }
      return initial;
    } else {
      let initial = accumulator || {};
      for (let key in collection) {
        iteratee(initial, collection[key], key);
      }
      return initial;
    }
  }

  function concat(arr, ...values) {
    let res = [];
    for (let item of arr) {
      res.push(item);
    }
    for (let item of values) {
      if (Array.isArray(item)) {
        res.push(...item);
      } else {
        res.push(item);
      }
    }
    return res;
  }

  function flattenDepth(arr, depth = 1) {
    let res = [];
    function helper(arr, depth) {
      for (let item of arr) {
        if (typeof item === 'object' && depth > 0) {
          helper(item, depth - 1);
        } else {
          res.push(item);
        }
      }
    }
    helper(arr, depth);
    return res;
  }

  function fromPairs(pairs) {
    let dict = {};
    for (let item of pairs) {
      dict[item[0]] = item[1];
    }
    return dict;
  }

  function toPairs(object) {
    let res = [];
    let i = 0;
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        res[i] = [key];
        res[i].push(object[key]);
        i++;
      }
    }
    return res;
  }

  function head(arr) {
    if (!arr.length) return undefined;
    return arr[0];
  }

  function indexOf(arr, value, fromIndex = 0) {
    for (let i = fromIndex; i < arr.length; i++) {
      if (arr[i] === value) return i;
    }
    return -1;
  }

  function lastIndexOf(arr, value, fromIndex = arr.length - 1) {
    for (let i = fromIndex; i > -1; i--) {
      if (arr[i] === value) return i;
    }
    return -1;
  }

  function initial(arr) {
    return arr.slice(0, arr.length - 1);
  }

  function join(arr, separator = ',') {
    let res = '';
    separator = separator.toString();
    for (let item of arr) {
      res += item + separator;
    }
    return res.slice(0, res.length - 1);
  }

  function last(arr) {
    return arr[arr.length - 1];
  }

  function pull(arr, ...values) {
    for (let item of [...values]) {
      let i = arr.indexOf(item);
      while (i > -1) {
        arr.splice(i, 1);
        i = arr.indexOf(item);
      }
    }
    return arr;
  }

  function reverse(arr) {
    let mid = (arr.length >>> 1);
    let end = arr.length - 1;
    for (let i = 0; i < mid; i++) {
      [arr[i], arr[end]] = [arr[end], arr[i]];
      end--;
    }
    return arr;
  }

  function every(collection, predicate) {
    if (Array.isArray(predicate)) {
      let key = predicate[0], val = predicate[1];
      for (let item of collection) {
        if (item[key] !== val) return false;
      }
      return true;
    } else if (typeof predicate === 'object') {
      for (let item of collection) {
        if (!_isEqual(item, predicate)) return false;
      }
      return true;
    } else {
      if (typeof predicate === 'function') {
        for (let item of collection) {
          if (!predicate(item)) return false;
        }
      } else {
        for (let item of collection) {
          if (!item[predicate]) return false;
        }
      }
    }
    return true;
  }
  function some(collection, predicate) {
    if (Array.isArray(predicate)) {
      let key = predicate[0], val = predicate[1];
      for (let item of collection) {
        if (item[key] === val) return true;
      }
      return false;
    } else if (typeof predicate === 'object') {
      for (let item of collection) {
        if (_isEqual(item, predicate)) return true;
      }
      return false;
    } else {
      if (typeof predicate === 'function') {
        for (let item of collection) {
          if (predicate(item)) return true;
        }
        return false;
      } else {
        for (let item of collection) {
          if (item[predicate]) return true;
        }
        return false;
      }
    }
  }

  function countBy(collection, iteratee) {
    let dict = {};
    if (typeof iteratee === 'function') {
      for (let i = 0; i < collection.length; i++) {
        let key = iteratee(collection[i], i, collection);
        if (dict[key]) dict[key]++;
        else dict[key] = 1;
      }
    } else {
      for (let item of collection) {
        let key = item[iteratee];
        if (dict[key]) dict[key]++;
        else dict[key] = 1;
      }
    }
    return dict;
  }

  function groupBy(collection, iteratee) {
    let dict = {};
    if (typeof iteratee === 'function') {
      for (let i = 0; i < collection.length; i++) {
        let key = iteratee(collection[i], i, collection);
        if (dict[key]) dict[key].push(collection[i]);
        else dict[key] = [collection[i]];
      }
    } else {
      for (let item of collection) {
        let key = item[iteratee];
        if (dict[key]) dict[key].push(item);
        else dict[key] = [item];
      }
    }
    return dict;
  }

  function keyBy(collection, iteratee) {
    let res = {};
    if (typeof iteratee === 'function') {
      for (let item of collection) {
        let key = iteratee(item);
        res[key] = item;
      }
    } else {
      for (let item of collection) {
        let key = item[iteratee];
        res[key] = item;
      }
    }
    return res;
  }

  function forEach(collection, iteratee) {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iteratee(collection[i], i);
      }
    } else {
      for (let key in collection) {
        iteratee(collection[key], key);
      }
    }
  }

  function map(collection, iteratee) {

    if (Array.isArray(collection)) {
      if (typeof iteratee === 'function') {
        var res = [];
        for (let i = 0; i < collection.length; i++) {
          let temp = iteratee(collection[i], i, collection);
          res.push(temp);
        }
      } else {
        var res = [];
        for (let item of collection) {
          res.push(item[iteratee]);
        }
      }
    } else {
      var res = [];
      for (let item in collection) {
        let temp = iteratee(collection[item]);
        res.push(temp);
      }
    }
    return res;
  }

  function _isParylyEqual(obj1, obj2) {
    for (let key in obj1) {
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  }
  function filter(collection, predicate) {
    let res = [];
    for (let item of collection) {
      if (typeof predicate === 'function') {
        for (let it in item) {
          var user = it;
          break;
        }
        if (predicate(item)) {
          res.push(item[user]);
        }
      } else if (Array.isArray(predicate)) {
        for (let it in item) {
          var user = it;
          break;
        }
        let key = predicate[0], val = predicate[1];
        if (item[key] === val) res.push(item[user]);
      } else if (typeof predicate === 'object') {
        for (let it in item) {
          var user = it;
          break;
        }
        if (_isParylyEqual(predicate, item)) res.push(item[user]);
      } else {
        for (let it in item) {
          var user = it;
          break;
        }
        if (item[predicate]) res.push(item[user]);
      }
    }
    return res;
  }

  function reduceRight(collection, iteratee, accumulator = []) {
    let initial = accumulator;
    for (let i = collection.length - 1; i > -1; i--) {
      initial = iteratee(initial, collection[i]);
    }
    return initial;
  }
  function size(collection) {
    if (Array.isArray(collection)) {
      return collection.length;
    } else if (typeof collection === 'string') {
      return collection.length;
    } else {
      var i = 0;
      for (let key in collection) {
        if (collection.hasOwnProperty(key)) i++;
      }
      return i;
    }
  }

  function sortBy(collection, iteratee) {
    let res = [];
    for (let i = 0; i < collection.length; i++) {
      if (typeof iteratee[0] === 'function') {
        let key = iteratee[0](collection[i]);
        val = collection[i]['age'];
        res[i] = [key, val];
      } else {
        let key = collection[i][iteratee[0]];
        let val = collection[i][iteratee[1]];
        res[i] = [key, val];
      }
    }
    return res;
  }

  function sample(collection) {
    let idx = (Math.random() * collection.length | 0);
    return collection[idx];
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isNull(value) {
    return value === null;
  }

  function max(arr) {
    if (!arr.length) return undefined;
    if (!Array.isArray(arr)) return undefined;
    let max = -Infinity;
    for (let item of arr) {
      if (item > max) max = item;
    }
    return max;
  }
  function min(arr) {
    if (!arr.length) return undefined;
    if (!Array.isArray(arr)) return undefined;
    let min = Infinity;
    for (let item of arr) {
      if (item < min) min = item;
    }
    return min;
  }
  function maxBy(arr, iteratee) {
    let max = -Infinity;
    let temp;
    let n = 'n';
    if (typeof iteratee === 'function') {
      for (let i = 0; i < arr.length; i++) {
        if (iteratee(arr[i]) > max) {
          max = iteratee(arr[i])
          temp = arr[i];
        }
      }
      return temp;
    } else {
      for (let item of arr) {
        if (item[iteratee] > max) {
          max = item[iteratee];
          temp = item;
        }
      }
      return temp;
    }
  }
  function minBy(arr, iteratee) {
    let min = Infinity;
    let temp;
    if (typeof iteratee === 'function') {
      for (let i = 0; i < arr.length; i++) {
        if (iteratee(arr[i]) < min) {
          min = iteratee(arr[i])
          temp = arr[i];
        }
      }
      return temp;
    } else {
      for (let item of arr) {
        if (item[iteratee] < min) {
          min = item[iteratee];
          temp = item;
        }
      }
      return temp;
    }
  }


  function sumBy(arr, iteratee) {
    let key = '';
    for (let item of arr) {
      key = Object.keys(item)[0];
      break;
    }
    let res = 0;
    if (typeof iteratee === 'function') {
      for (let item of arr) {
        res += iteratee(item);
      }
    } else {
      for (let item of arr) {
        res += item[iteratee];
      }
    }
    return res;
  }

  function round(number, precision = 0) {
    let factor = Math.pow(10, precision);
    let num = number * factor;
    num = Math.round(num);
    return num / factor;
  }

  function flatMap(collection, iteratee) {
    let res = [];
    for (let i = 0; i < collection.length; i++) {
      res.push(...iteratee(collection[i], i, collection));
    }
    return res;
  }

  function flatMapDepth(collection, iteratee, depth = 1) {
    let res = collection.map(iteratee);
    return _flatten(res, depth);
  }
  function _flatten(array, depth) {
    if (depth === 0) return array;
    return array.reduce((initial, item) => {
      if (Array.isArray(item)) {
        initial.push(...flatten(item, depth - 1));
      } else {
        initial.push(item);
      }
      return initial;
    }, [])
  }


  function isEqual(value, other) {
    if (typeof value !== typeof other) return false;
    if (Array.isArray(value)) {
      if (value.length !== other.length) return false;
      else {
        for (let i = 0; i < value.length; i++) {
          if (!isEqual(value[i], other[i])) return false;
        }
        return true;
      }
    } else if (typeof value === 'object') {
      return _deepEqual(value, other);
    } else {
      return value === other;
    }
  }
  function _deepEqual(obj1, obj2) {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (var key of keys1) {
      if (!keys2.includes(key)) return false;
    }
    if (!isEqual(obj1[key], obj2[key])) return false;
    return true;
  }

  function repeat(string = '', n = 1) {
    let res = '';
    for (let i = 0; i < n; i++) {
      res += string;
    }
    return res;
  }

  //chars = _-
  //abcd, length = 2
  function padStart(string = '', length = 0, chars = ' ') {
    let res = string;
    let temp = String(chars).split('');
    let i = 0;
    if (res.length > length) return res.slice(0, length);
    while ((res.length) < length) {
      res = temp[i] + res;
      i++;
      if (temp[i] === undefined) i = 0;
    }
    return res;
  }

  function padEnd(string = '', length = 0, chars = ' ') {
    let res = string;
    let temp = String(chars).split('');
    let i = 0;
    while (res.length < length) {
      res += temp[i];
      i++;
      if (temp[i] === undefined) i = 0;
    }
    return res;
  }

  function pad(string = '', length = 0, chars = ' ') {
    let res = string.split('');
    let temp = String(chars).split('');
    let i = 0;
    while (res.length < length) {
      res.push(temp[i]);
      if (res.length === length) break;
      res.splice(i, 0, temp[i]);
      i++;
      if (temp[i] === undefined) i = 0;
    }
    return res.join('');
  }

  function keys(object) {
    if (object === null || object === undefined) return [];
    return Object.keys(object);
  }

  function values(object) {
    if (object === null || object === undefined) return [];
    return Object.values(object);
  }

  function random(lower = 0, upper = 1, floating = false) {
    if (typeof upper === 'boolean') {
      floating = upper;
      upper = lower;
      lower = 0;
    }
    if (lower > upper) [lower, upper][upper, lower];
    if (floating) {
      return Math.random() * (upper - lower) + lower;
    } else {
      return ((Math.random() * (upper - lower)) | 0) + lower;
    }
  }

  function trim(string = '', chars = ' ') {
    let res = '';
    let temp = String(chars).split('');
    for (let i = 0; i < string.length; i++) {
      if (!temp.includes(string[i])) res += string[i];
    }
    return res;
  }

  function trimStart(string = '', chars = ' ') {
    let res = '';
    let temp = String(chars).split('');
    let i = 0;
    while (temp.includes(string[i])) {
      i++;
    }
    for (; i < string.length; i++) res += string[i];
    return res;
  }

  function trimEnd(string = '', chars = ' ') {
    let res = '';
    let i = string.length - 1;
    let temp = String(chars).split('');
    while (temp.includes(string[i])) i--;
    for (; i > -1; i--) res = string[i] + res;
    return res;
  }

  function assign(object, ...args) {
    args.forEach(item => {
      if (item && typeof item === 'object') {
        for (let key in item) {
          if (item.hasOwnProperty(key)) object[key] = item[key];
        }
      }
    })
    return object;
  }

  function _isObject(arg) {
    return arg && typeof arg === 'object' && Array.isArray(arg);
  }

  function parseJSON(string) {
    let i = 0;
    return parseValue();
    function parseValue() {
      if (string[i] === '{') {
        return parseObject();
      } else if (string[i] === '[') {
        return parseArray();
      } else if (string[i] === '"') {
        return parseString();
      } else if (string[i] === 't') {
        i += 4;
        return true;
      } else if (string[i] === 'f') {
        i += 5;
        return false;
      } else if (string[i] === 'n') {
        i += 4;
        return null;
      } else {
        return parseNumber();
      }
    }

    function parseObject() {
      i++; //skip the open curly bracket
      let res = {};
      if (string[i] === '}') {
        i++; //skip the close curly bracket
        return res;
      }
      while (i < string.length) {
        var key = parseString();
        i++; //skip the colon
        var value = parseValue();
        res[key] = value;
        if (string[i] === '}') break;
        i++; //skip the comma
      }
      i++; //skip the close curly bracket
      return res;
    }

    function parseArray() {
      i++; //skip the open square bracket
      let res = [];
      if (string[i] === ']') {
        i++; //skip the close square bracket
        return res;
      }
      while (i < string.length) {
        res.push(parseValue());
        if (string[i] === ']') break;
        i++; //skip the comma
      }
      i++; //skip the close square bracket
      return res;
    }

    function parseString() {
      i++; //skip the open double qoute
      let currI = i;
      while (string[i] !== '"') i++;
      let temp = string.slice(currI, i)
      i++; //skip the close double qoute
      return temp;
    }

    function parseNumber() {
      //don't skip anything
      let currI = i;
      while (string[i] >= '0' && string[i] <= '9') i++;
      return Number(string.slice(currI, i));
    }
  }

  function stringifyJSON(value) {
    return stringifyValue(value);

    function stringifyValue(value) {
      let res = '';
      if (Array.isArray(value)) {
        res += stArray(value);
        res += ',';
      } else if (typeof value === 'object') {
        res += stObject(value);
        res += ',';
      } else if (value === null) {
        res += 'null';
      } else if (value === true) {
        res += 'true';
      } else if (value === false) {
        res += 'false';
      } else if (typeof value === 'string') {
        res += stString(value);
      } else {
        res += String(value);
      }
      return res;
    }

    function stArray(value) {
      res = '[';
      if (!value.length) {
        res += ']';
        return res;
      }
      for (let item of value) {
        res += stringifyValue(item);
        res += ',';
      }
      res = res.slice(0, res.length - 1);
      res += ']';
      return res;
    }

    function stObject(value) {
      let res = '{';
      if (!Object.keys(value).length) {
        res += '}';
        return res;
      }
      for (let key in value) {
        res += stString(key) + ':';
        res += stringifyValue(value[key]);
        res += ',';
      }
      res = res.slice(0, res.length - 1);
      res += '}';
      return res;
    }

    function stString(value) {
      let res = '"';
      res += value;
      res += '"';
      return res;
    }
  }
  function range(...args) {
    let res = [];
    if (arguments.length === 1) {
      let temp = args[0];
      if (temp > 0) {
        for (let i = 0; i < temp; i++) res.push(i);
      } else {
        for (let i = 0; i > temp; i--) res.push(i);
      }
    } else if (arguments.length === 2) {
      let temp1 = args[0];
      let temp2 = args[1];
      if (temp2 > 0) {
        for (let i = temp1; i < temp2; i++) res.push(i);
      } else {
        for (let i = temp1; i > temp2; i--) res.push(i);
      }
    } else {
      let temp1 = args[0];
      let temp2 = args[1];
      let temp3 = args[2];
      if (temp2 > 0) {
        for (let i = temp1; i < temp2; i += temp3) {
          res.push(i);
          if (res.length === temp2 - 1) break;
        }
      } else {
        temp3 = Math.abs(temp3);
        for (let i = temp1; i > temp2; i -= temp3) res.push(i);
      }
    }
    return res;
  }


  return {
    range: range,
    parseJSON: parseJSON,
    stringifyJSON: stringifyJSON,
    assign: assign,
    trimEnd: trimEnd,
    trimStart: trimStart,
    trim: trim,
    random: random,
    keys: keys,
    values: values,
    pad: pad,
    padEnd: padEnd,
    padStart: padStart,
    repeat: repeat,
    isEqual: isEqual,
    flatMapDepth: flatMapDepth,
    flatMap: flatMap,
    sumBy: sumBy,
    round: round,
    minBy: minBy,
    maxBy: maxBy,
    min: min,
    max: max,
    isNull: isNull,
    isUndefined: isUndefined,
    sample: sample,
    keyBy: keyBy,
    countBy: countBy,
    groupBy: groupBy,
    some: some,
    every: every,
    reverse: reverse,
    pull: pull,
    last: last,
    join: join,
    initial: initial,
    lastIndexOf: lastIndexOf,
    indexOf: indexOf,
    head: head,
    toPairs: toPairs,
    fromPairs: fromPairs,
    flattenDepth: flattenDepth,
    compact: compact,
    chunk: chunk,
    fill: fill,
    drop: drop,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    flatten: flatten,
    flattenDeep: flattenDeep,
    reduce: reduce,
    concat: concat,
    forEach: forEach,
    map: map,
    filter: filter,
    reduceRight: reduceRight,
    size: size,
    sortBy: sortBy,
  }

}()