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
    let temp = [];
    let j = 0;
    while (j < arr.length) {
      for (let i = 0; i < size; i++) {
        temp.push(arr[i]);
        j++;
        if (j >= arr.length) break;
      }
      res.push(temp);
      temp = [];
    }
    return res;
  }

  function fill(arr, val, start = 0, end = arr.length) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      if (i >= start && i < end) {
        res.push(val);
      } else {
        res.push(arr[i]);
      }
    }
    return res;
  }

  function drop(arr, n = 1) {
    let res = [];
    for (let i = n; i < arr.length; i++) {
      res.push(arr[i]);
    }
    return res;
  }

  function findIndex(arr, predicate = val => val, fromIndex = 0) {
    let len = arr.length;
    let start = fromIndex < 0 ? Math.max((len - fromIndex), 0) : fromIndex;

    if (typeof predicate === 'function') {
      for (let i = start; i < len; i++) {
        if (predicate(arr[i], i, arr)) return i;
      }
    } else if (typeof predicate === 'string') {
      for (let i = start; i < len; i++) {
        if (arr[i][predicate]) {
          return i;
        }
      }
    } else if (Array.isArray(predicate)) {
      let [key, val] = predicate;
      for (let i = start; i < len; i++) {
        if (arr[i][key] === val) return i;
      }
    } else if (typeof predicate === 'object') {
      let match = true;
      for (let i = start; i < len; i++) {
        for (let key in predicate) {
          if (arr[i][key] !== predicate[key]) {
            match = false;
            break;
          }
        }
        if (match) return i;
        match = true;
      }
    }
  }

  function findLastIndex(arr, predicate = val => val, fromIndex = arr.length) {
    if (!Array.isArray(arr)) throw new Error('Expected an array...');
    let len = arr.length;
    let start = fromIndex > 0 ? Math.min((len - 1), fromIndex) : Math.max((len + fromIndex), 0);

  }
  return {
    findIndex: findIndex,
    compact: compact,
    chunk: chunk,
    fill: fill,
    drop: drop,
  }
}()


var users = [
  { 'user': 'barney', 'active': false },
  { 'user': 'fred', 'active': false },
  { 'user': 'pebbles', 'active': true }
];