//Parse regular expression; 
//example: re = /foo|(ba+rz{22,88}[^aeiou])/;
re = /foo|(ba+rz{22,88}[^aeiou])/;
function parseRegularExpression(string) {
  let i = 0; // record the position;
  let groupI = 1; //record the index of the captured group; 

  let branches = parseBranches();
  return {
    type: 'RegularExpression',
    start: 0,
    end: i,
    raw: string,
    branches,
  }



  function parseOnePart() {
    if (string[i] === '[') {
      // parse a character class; 
      return parseCharClass();
    } else if (string[i] === '?' || string[i] === '*' || string[i] === '+' || string[i] === '{') {
      //parse quantifiers: ? * + {2,} 
      return parseQuantifier();
    } else if (string[i] === '(') {
      // parse captured group or zero assertion etc: (xxx) (?=xxx)
      return parseCapturedGroup();
    } else if (string[i] === '\\') {
      // parse escape identifier
      return parseEscape();
    } else {
      // parse a single character;
      return parseChar();
    }
  }

  function parseQuantifier() {
    let node = {
      type: 'Quantifier',
      start: i,
      end: 0,
      min: 0,
      max: Infinity,
      raw: '',
      greedy: true,
      repeatedElement: null,
    }
    if (string[i] === '?') {
      // 0 - 1
      node.max = 1;
      i++;
    } else if (string[i] === '*') {
      // 0 - Infinity
      i++;
    } else if (string[i] === '+') {
      // 1 - Infinity
      node.min = 1;
      i++;
    } else if (string[i] === '{') {
      // {333, }    {2, 31}
      i++; // skip the open curly brace '{';
      let st = parseInteger();
      node.min = st;
      i++; //skip the comma ,
      if (string[i] === '}') {
        i++;
        node.max = Infinity;
      } else {
        let en = parseInteger();
        i++; //skip the close curly brace '}';
        node.max = en;
      }
    }
    if (string[i] === '?') {
      node.greedy = false;
      i++;
    }
    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;

    function parseInteger() {
      let temp = i;
      while (string[i] <= '9' && string[i] >= '0') i++;
      return Number(string.slice(temp, i));
    }
  }

  function parseCharClass() {
    //[abc] [^acdf] [abcd\b]
    let node = {
      type: 'CharClass',
      start: i,
      end: 0,
      raw: '',
      invert: false,
      CharClasses: [],
    }
    i++; // skip the square bracket '[';
    if (string[i] === '^') {
      node.invert = true;
      i++;
    }
    while (string[i] !== ']') {
      let temp = parseOnePart();
      node.CharClasses.push(temp);
    }
    i++; //skip the close square bracket ']';

    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;
  }

  function parseCapturedGroup() {
    // (xxx) (?=xx) (?!xx) (?<xx) (?<!xx) (?<xxx>) (?:)
    // captured group / non-captured group / zero assertion / group name 

    let node = {
      type: 'CapturedGroup',
      start: i,
      end: 0,
      raw: '',
      groups: [], // put all the branches into the group, even though there is only one branch.
      groupName: '',
      groupIndex: groupI,
      capture: true, // is it a captured group? 
      zeroWidthAssertion: false, // is it a zero width assertion?
      positive: false, // is it positive or negative? 
      lookahead: false, // is it forward or backward? 
    }

    i++; //Anyway! skip the open clurly brace: '('
    if (string[i] === '?') {
      i++; // skip the question mark: '?'
      if (string[i] === ':') {
        node.capture = false;
        i++; // skip the colon: ':'
      } else if (string[i] === '=') {
        // (?=xxx)
        node.zeroWidthAssertion = true;
        node.positive = true;
        node.lookahead = true;
      } else if (string[i] === '!') {
        // (?!xxx)
        node.zeroWidthAssertion = true;
        node.positive = false;
        node.lookahead = true;
      } else if (string[i] === '<') {
        // (?<xxx>) (?<!xxx) (?<=xxx)
        i++; // Anyway, skip the angle bracket: '<'
        if (string[i] === '=') {
          // (?<=xxx)
          node.zeroWidthAssertion = true;
          node.positive = true;
          node.lookahead = false;
          i++; // skip the equal sign: '='
        } else if (string[i] === '!') {
          // (?<!xxx)
          node.zeroWidthAssertion = true;
          node.positive = false;
          node.lookahead = false;
          i++; // skip the exclamation mark: '!'
        } else {
          // (?<xxx>)
          let groupName = parseName();
          node.groupName = groupName;
          i++; // skip the close angle bracket: '>'
        }

        function parseName() {
          let name = '';
          let start = i;
          while (string[i] !== '>') i++;
          name = string.slice(start, i);
          return name;
        }
      }
    }

    node.groups = parseBranches();
    i++; //skip the close parentheses : ')';

    //To clearify the group index;
    if (node.zeroWidthAssertion === false && node.capture === true) groupI++;
    else node.groupIndex = undefined;

    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;
  }
  function parseBranch() {
    // parse one branch
    // (xxxxxxx|yyyyyyy) (zzzzzzz)
    //  i ->   i          i ->   i
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
        if (node.elements.length === 0) throw new Error('Nothing to repeat!');
        let prevEl = node.elements.pop();
        element.repeatedElement = prevEl;
        element.start = prevEl.start;
        element.raw = string.slice(element.start, element.end);
      }
      node.elements.push(element);
    }
    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;
  }

  function parseBranches() {
    let branches = [];
    while (string[i] !== ')' && i < string.length) {
      let branch = parseBranch();
      branches.push(branch);
      if (string[i] === '|') {
        i++; //skip the vertical bar;
        continue;
      }
    }
    return branches;
  }

  function parseChar() {
    // only parse one single character; 
    let node = {
      type: 'Char',
      start: i,
      end: 0,
      raw: '',
      char: '',
    }
    node.char = string[i];
    i++;
    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;
  }

  function parseEscape() {
    // re = /abc\d/;
    let node = {
      type: 'Escape',
      start: i,
      end: 0,
      raw: '',
      escapeChar: '',
    }
    i++; //skip the backslash: '\';
    // only care about one character after the backslash;
    node.escapeChar = string[i];
    i++; //skip the only escape char; \b \d \r \n \w \s \t...

    node.end = i;
    node.raw = string.slice(node.start, node.end);
    return node;
  }
}

let input = document.querySelector('div.reg-exp');
let regExp = input.textContent;
let regExpTree = parseRegularExpression(regExp);
console.log(regExpTree)

function drawRegExpRoad(regExpTree) {
  let tree = regExpTree.branches
  tree.forEach(item => {
    item.map(it => drawOnePart(it));
  });
  for (let item of tree) {

  }
}

function elt(tagName, attributes = {}, ...args) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  if (attributes) {
    for (let key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  }
  for (let item of args) {
    if (typeof item === 'string') {
      let child = document.createTextNode(item);
      el.append(child);
    }
  }
  return el;
}

let padding = 10;
let winWidth = window.innerWidth;
let svg = document.querySelector('svg');
function drawEscapeGraph(escapeNode) {
  let escapeChar = escapeNode.escapeChar;
  let g = elt('g');
  if (escapeChar === 'b') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'word boundary');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 90 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'w') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'word');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 35 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'd') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'digit');


    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 35 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 's') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'white-space');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 90 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'r') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'carriage-return');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 90 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'n') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'line-feed');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 90 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'B') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'non-word boundray');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 130 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);

  }

  if (escapeChar === 'W') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'non-word');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 65 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);

  }

  if (escapeChar === 'D') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'non-digit');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 60 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 't') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'tab');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 20 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  if (escapeChar === 'S') {
    let text = elt('text', {
      x: padding + (padding / 2), // 15
      y: padding * 3, // 20
      width: 100,
      height: 40,
      // 'text-anchor': 'middle',
      // 'dominant-baseline': 'middle',
    }, 'non-white space');

    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      width: 105 + padding, // 5 + 5
      height: 28 + (padding / 2), // 2.5 + 2.5
      x: padding,
      y: padding,
      fill: '#bada55',
    })
    g.append(rect);
    g.append(text);
  }

  svg.append(g);
  let width = g.getBBox().width;
  let height = g.getBBox().height;
  return {
    g, width, height,
  }
}


function drawCharGraph(charNode) {
  let g = elt('g');
  let rect = elt('rect', {
    width: padding * 3 - 3,
    height: padding * 2,
    x: padding,
    y: padding,
    fill: '#dae9e5',
    rx: 3,
    ry: 3,
  })
  g.append(rect);

  let text = elt('text');

  let tspan1 = elt('tspan', {
    x: padding + padding / 2,
    y: padding * 2,
    'dominant-baseline': 'middle',
    fill: '#918c83',
  }, '"');
  text.append(tspan1);

  let char = charNode.char;
  let tspan2 = elt('tspan', {
    x: padding + padding,
    y: padding * 2,
    'dominant-baseline': 'middle',
    fill: 'black',
  }, char);
  text.append(tspan2);

  let tspan3 = elt('tspan', {
    x: padding + padding * 1.5,
    y: padding * 2,
    'dominant-baseline': 'middle',
    fill: '#918c83',
  }, '"');
  text.append(tspan3);

  g.append(text);
  console.log(g.getBBox())
  svg.append(g);

  let width = g.getBBox().width;
  let height = g.getBBox().height;
  return {
    g, width, height,
  }
}


function drawOnePart(onePart) {
  if (onePart.type === 'Escape') {
    return drawEscapeGraph(onePart);

  } else if (onePart.type === 'Char') {
    return drawCharGraph(onePart);

  } else if (onePart.type === 'Quantifier') {
    return drawQuantifierGraph(onePart);

  } else if (onePart.type === 'CapturedGroup') {
    return drawCapturedGroupGraph(onePart);
  }




}

