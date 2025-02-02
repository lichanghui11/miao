//解析正则表达式； 
let re = /foo|(bar|ba+z{2,5}[^aeoi])/;
function parseRegularExpression(string) {
  let i = 0; //全局指针， 依次遍历字符串的每个位置； 
  let groupI = 1; //捕获分组的编号； 

  let branches = parseBranches(); 
  return {
    type: 'RegularExpression', 
    start: 0, 
    end: i, 
    branches,
  }

  function parseOnePart() {
    //解析一个部分， 可以是分组、量词组、中括号组等； 
    if (string[i] === '[') {
      return parseCharClass(); 
    } else if (string[i] === '(') {
      return parseCapturedGroup(); 
    } else if (string[i] === '?' || string[i] === '*' || string[i] === '{' || string[i] === '+') {
      return parseQuantifier();
    } else if (string[i] === '\\') {
      //此处只考虑一个反斜杠后面只跟随一个字母； 
      return parseEscape();
    } else {
      return parseChar();
    }
  }

  function parseCharClass() {
    let node = {
      type: 'CharClass', 
      start: i, 
      end: 0, 
      raw: '',
      invert: false, //这里表示字符集是否取反： ^
      charClass: [],
    }
    
    i++; //跳过中括号： [
    if (string[i] === '^') {
      node.invert = true;
      i++; //跳过取反符号：^
    }

    // 只考虑这些符号： [^abca-z0-9\d]
    while (string[i] !== ']') {
      let part = parseOneClass();
      node.charClass.push(part)
    }
    i++; //跳过中括号： ']'
    node.end = i; 
    node.raw.slice(node.start, node.end);
    return node;
  }

  function parseOneClass() {
    if (string[i] === '\\') return parseEscape();
    else return parseChar();
  }


  function parseCapturedGroup() {
    let node = {
      type: 'CapturedGroup', 
      start: i, 
      end: 0, 
      raw: '', 
      groupIndex: groupI, // 分组编号；  
      capture: true, //是否为捕获分组， (?:)为非捕获分组， 
      zeroAssertion: false, //是否为零宽断言， 如果为零宽断言， 以下属性就有意义， (?=xxx) (?!xxx) (?<=xxx) (?<!xxx)
      positive: true, 
      lookahead: true, 
      groupName: null, //具名分组中存在分组名称； 
      branches: [], //捕获分组中即使没有管道符｜， 也是一个分支（branch）
    }  

    i++; //跳过括号：( 
    if (string[i] === '?') {
      //?后面可能是零宽断言、非捕获分组；
      i++; //跳过这个问号: ?
      if (string[i] === ':') {
        //(?:)
        i++; //跳过冒号：:
        node.capture = false;
      } else if (string[i] === '=') {
        //(?=xxx)
        node.zeroAssertion = true;
        node.positive = true;
        node.lookahead = true;
        i++; // 跳过等于： =
      } else if (string[i] === '!') {
        //(?!xxx)
        node.zeroAssertion = true;
        node.positive = false; 
        node.lookahead = true;
        i++; //跳过感叹号： !
      } else if (string[i] === '<') {
        //可能是零宽断言的后行断言， 也可能是具名分组； 
        i++; //先跳过这个符号： <
        if (string[i] === '=') {
          //(?<=xxx)
          i++; //跳过等于符号： =
          node.zeroAssertion = true;
          node.positive = true; 
          node.lookahead = false;
        } else if (string[i] === '!') {
          //(?<!xxx)
          i++; //跳过感叹号： ！
          node.zeroAssertion = true; 
          node.positive = false; 
          node.lookahead = false;
        } else {
          //这里是具名分组： (?<xxx>)
          let name = parseGroupName(); 
          node.groupName = name; 
          i++; //跳过尖括号：>
        }
      }
      node.branches = parseBranches(); 
      i++; //跳过括号：)
      if (node.zeroAssertion === false && node.capture === true) groupI++;
      else node.groupIndex = undefined;

      node.end = i;
      node.raw = string.slice(node.start, node.end); 
      return node;
    }
  }

  function parseBranches() {
    let branches = []; 
    while (string[i] !== ')' && i < string.length) {
      let branch = parseBranch();
      branches.push(branch);
      if (string[i] === '|') {
        i++; //跳过管道符； 
        continue;
      }
    }
    return branches;
  }

  function parseBranch() {
    //解析一个分支； 
    let node = {
      type: 'Branch', 
      start: i, 
      end: 0, 
      raw: '', 
      elements: [],
    }
    while (string[i] !== '|' && string[i] !== ')' && i < string.length) {
      let element = parseOnePart();
      if (element.type === 'Quantifier') {
        //如果是零宽断言或者非捕获分组， 就抛出错误
        if (node.elements.length === 0) throw new SyntaxError('Quantifier: Nothing to repeat!');

        let prevElement = node.elements.pop();
        element.repeatingSection = prevElement;
        element.start = prevElement.start;
        element.raw = string.slice(element.start, element.end);
      }
      node.elements.push(element);
    }

    node.end = i; 
    node.raw = string.slice(node.start, node.end);
    return node;
  }

  function parseGroupName() {
    let start = i; 
    while (string[i] !== '>') i++; 
    return string.slice(start, i);
  }

  function parseQuantifier() {
    let node = {
      type: 'Quantifier', 
      start: i, 
      end: 0, 
      raw: '', 
      min: 0, 
      max: Infinity, 
      greedy: true, //判断是否贪婪匹配， 默认为贪婪匹配； 
      repeatingSection: null, //记录需要重复的部分； 
    }

    if (string[i] === '?') {
      node.max = 1; 
      i++;
    } else if (string[i] === '+') {
      node.min = 1;
      i++; 
    } else if (string[i] === '*') {
      node.max = Infinity; 
      i++; 
    } else if (string[i] === '{') {
      i++; // 先跳过起始花括号： {
      let start = parseInteger(); 
      i++; //跳过逗号： ,
      if (string[i] === '}') {
        node.max = Infinity; //{2,} 
        i++;
      } else {
        let end = parseInteger(); 
        node.max = end;
        i++;
      }

      if (string[i] === '?') {
        i++; 
        node.greedy = false;
      }

      node.end = i; 
      node.raw = string.slice(node.start, node.end);
      return node;
    }

    function parseInteger() {
      //解析开放式量词的重复次数： {2, 5}
      let start = i; 
      while (string[i] >= '0' && string[i] <= '9') {
        i++;
      }
      let num = Number(string.slice(start, i)); 
      return num;
    }
  }

  function parseEscape() {
    let node = {
      type: 'Escape', 
      start: i, 
      end: 0, 
      raw: '', 
      escape: '',
    }
    i++; //跳过转译符； 
    node.escape = string[i]; 
    i++; //跳过被转译的符号； 

    node.end = i; 
    node.raw = string.slice(node.start, node.end);
    return node;
  }

  function parseChar() {
    let node = {
      type: 'Char', 
      start: i, 
      end: 0,
      raw: '',
      char: string[i],
    }

    i++; //跳过被解析的单个字符； 
    node.end = i; 
    node.raw = string.slice(node.start, node.end);
    return node; 
  }

}