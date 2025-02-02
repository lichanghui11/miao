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
      quantifier: '',
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
      node.quantifier += string[i];
      node.max = 1;
      i++;
    } else if (string[i] === '*') {
      // 0 - Infinity
      node.quantifier += string[i];
      i++;
    } else if (string[i] === '+') {
      // 1 - Infinity
      node.quantifier += string[i];
      node.min = 1;
      i++;
    } else if (string[i] === '{') {
      // {333, }    {2, 31}
      i++; // skip the open curly brace '{';
      let st = parseInteger();
      node.min = st;
      i++; //skip the comma ,
      if (string[i] === '}') {
        node.quantifier += string[i];
        i++;
        node.max = Infinity;
      } else {
        let en = parseInteger();
        node.quantifier += string[i];
        i++; //skip the close curly brace '}';
        node.max = en;
      }
    }
    if (string[i] === '?') {
      node.greedy = false;
      node.quantifier += string[i];
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
      branches: [], // put all the branches into the group, even though there is only one branch.
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

    if (node.zeroWidthAssertion === false && node.capture === true) groupI++;
    else node.groupIndex = undefined;

    node.branches = parseBranches();
    i++; //skip the close parentheses : ')';

    //To clearify the group index;

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



let svg = document.querySelector('svg');

let display = document.querySelector('button.display');
let downloadButton = document.querySelector('label');
display.addEventListener('click', run)
downloadButton.addEventListener('click', download)

function download() {
  let text = '<?xml version="1.0"?>' + svg.outerHTML;
  let blob = new Blob([text], { type: 'image/svg+xml;charset=;utf-8' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'railway.svg';
  a.click();
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
  svg.append(el);
  return el;
}

function run() {
  svg.innerHTML = '';
  let input = document.querySelector('div.reg-exp');
  let regExp = input.textContent;
  regExp = regExp.trim();
  let regExpTree = parseRegularExpression(regExp);
  console.log(regExpTree)
  let padding = 10;
  let roadGraph;

  drawRegExpRoad(regExpTree);
  //画图开始： s
  svg.style.height = roadGraph.height + padding * 2 + 'px';

  // drawRegExpRoad(regExpTree);
  //regExpTree
  function drawRegExpRoad(regExpTree) {
    let graphs = regExpTree.branches.map(drawGraph);
    let g = elt('g');
    let width = Math.max(...graphs.map(it => it.width)) + padding * 4;
    let height = graphs.map(it => it.height).reduce((a, b) => a + b) + (graphs.length - 1) * padding;

    //这个rect用来撑宽g元素；
    let rect = elt('rect', {
      width,
      height,
      fill: 'none',
    })
    g.append(rect);

    let temp = padding;
    let temp2 = 0;
    for (let graph of graphs) {
      graph.g.setAttribute('transform', `translate(${(width - graph.width) / 2}, ${temp - padding})`)
      temp += graph.height + padding;

      let path = elt('path', {
        d: `
        M 0 ${height / 2} 
        C ${padding} ${height / 2} 
          ${padding} ${temp2 + graph.height / 2} 
          ${padding * 2} ${temp2 + graph.height / 2}
        L ${(width - graph.width) / 2} ${temp2 + graph.height / 2}

        M ${graph.width + (width - graph.width) / 2} ${temp2 + graph.height / 2}
        L ${width - padding * 2} ${temp2 + graph.height / 2}

        M ${width} ${height / 2}
        C ${width - padding} ${height / 2}
          ${width - padding} ${temp2 + graph.height / 2}
          ${width - padding * 2} ${temp2 + graph.height / 2}
      `,
        'stroke-width': 2,
        stroke: 'black',
        fill: 'none',
      })
      temp2 += graph.height + padding;
      g.append(path);
      g.append(graph.g);
    }

    //这里是最后画两侧圆圈的部分； 
    let widthFinal = width + padding * 4;
    let heightFinal = height + padding * 2;
    let gFinal = elt('g');
    gFinal.append(g);
    g.setAttribute('transform', `translate(${padding * 2}, ${padding})`);
    let pathFinal1 = elt('path', {
      d: `
      M 0 ${heightFinal / 2} 

      M ${padding} ${heightFinal / 2}
      l ${padding} 0

      M ${widthFinal - padding * 2} ${heightFinal / 2}
      l ${padding} 0
    `,
      stroke: 'black',
      'stroke-width': 2,
      fill: 'grey',
    });

    let circle1 = elt('circle', {
      cx: padding / 2,
      cy: heightFinal / 2,
      r: padding / 2,
      fill: 'grey',
      stroke: 'black',
      'stroke-width': 2,
    })
    gFinal.append(circle1);

    let circle2 = elt('circle', {
      cx: widthFinal - padding / 2,
      cy: heightFinal / 2,
      r: padding / 2,
      fill: 'grey',
      stroke: 'black',
      'stroke-width': 2,
    })
    gFinal.append(circle2);

    gFinal.append(pathFinal1);
    let windowWidth = window.innerWidth;
    let box = gFinal.getBBox();
    gFinal.setAttribute('transform', `translate(${(windowWidth / 2) - box.width / 2 - padding * 2}, ${padding})`);


    roadGraph = {
      width: box.width,
      height: box.height,
      g: gFinal,
    }
    return roadGraph;
  }


  // drawCharGroup(regExpTree.branches[0].elements[0])
  function drawCharGraph(node) {
    if (node.type === 'Escape') return drawEscapeGraph(node);
    let g = elt('g');
    let text = elt('text', {
      x: padding / 4,
      y: padding,
      'dominant-baseline': 'middle',
    }, '"', node.char, '"');

    let size = text.getBBox();

    let background = elt('rect', {
      rx: 3,
      ry: 3,
      fill: '#dae9e5',
      width: size.width + padding / 2,
      height: size.height,
    });
    g.append(background, text);
    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  //node: regExpTree.branches[0].elements[0]
  // drawEscapeGraph(regExpTree.branches[0].elements[0])
  function drawEscapeGraph(node) {
    let g = elt('g');
    let char = '';

    //判断转译符类型： 
    if (node.escapeChar === 'd') char = 'digit';
    if (node.escapeChar === 'b') char = 'word boundary';
    if (node.escapeChar === 'w') char = 'word';
    if (node.escapeChar === 's') char = 'white-space';
    if (node.escapeChar === 'r') char = 'carriage-return';
    if (node.escapeChar === 'n') char = 'line-feed';
    if (node.escapeChar === 'B') char = 'non-word boundary';
    if (node.escapeChar === 'W') char = 'non-word';
    if (node.escapeChar === 'D') char = 'non-digit';
    if (node.escapeChar === 'S') char = 'non-white space';
    if (node.escapeChar === 't') char = 'tab';

    let text = elt('text', {
      x: padding / 4,
      y: padding + padding / 4,
      'dominant-baseline': 'middle',
      fill: '#1f1c1c',
    }, char)

    let size = text.getBBox();
    let rect = elt('rect', {
      rx: 3,
      ry: 3,
      fill: '#bada55',
      width: size.width + padding / 2,
      height: size.height + padding / 2,
    })
    g.append(rect, text);
    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  // drawCharClassGraph(regExpTree.branches[0].elements[0])
  function drawCharClassGraph(nodes) {
    let invert = nodes.invert ? 'None of:' : 'One of:';
    let g = elt('g');
    let classes = nodes.CharClasses.map(drawCharGraph);
    let width = Math.max(...classes.map(it => it.width)) + padding;
    let height = classes.map(it => it.height).reduce((a, b) => a + b) + (padding / 2) * (classes.length + 1);

    //文字描述：
    let textOneOf = elt('text', {
      'dominant-baseline': 'hanging',
      y: padding / 3,
      'font-size': 10,
    }, invert)
    let textOneOfBox = textOneOf.getBBox();
    let textheight = textOneOfBox.height;

    let rect = elt('rect', {
      width,
      height,
      fill: '#cbcbba',
      rx: 3,
      ry: 3,
      y: textheight,
    })

    //rect是一个底色框； 
    g.append(textOneOf, rect);

    let temp = padding / 2;
    for (let item of classes) {
      item.g.setAttribute('transform', `translate(${(width - item.width) / 2},  ${temp + textheight})`)
      temp += item.height + padding / 2;

      g.append(item.g);
    }
    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  // drawBranchGraph(regExpTree.branches[0])
  //这里传入一个分支
  function drawBranchGraph(nodes) {
    let g = elt('g');
    let graphs = nodes.elements.map(drawGraph);
    let height = Math.max(...graphs.map(it => it.height)) + padding * 2;
    let width = graphs.map(it => it.width).reduce((a, b) => a + b) + padding * (graphs.length + 1);

    //用一个rect撑开整个g标签
    let rect = elt('rect', {
      width,
      height,
      fill: 'none',
    })
    g.append(rect);

    let line = elt('line', {
      x1: 0,
      y1: height / 2,
      x2: padding,
      y2: height / 2,
      'stroke-width': 2,
      'stroke': 'black',
    })
    g.append(line);

    let temp = padding;
    for (let graph of graphs) {
      graph.g.setAttribute(`transform`, `translate(${temp}, ${(height - graph.height) / 2})`);
      temp += graph.width + padding;
      let line = elt('line', {
        x1: temp - padding,
        y1: height / 2,
        x2: temp,
        y2: height / 2,
        'stroke-width': 2,
        'stroke': 'black',
      });
      g.append(graph.g);
      g.append(line);
    }
    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  // debugger;
  // drawBranchesGraph(regExpTree.branches);
  function drawBranchesGraph(nodes) {
    //这里的nodes是一个数组
    let graphs = nodes.map(it => drawGraph(it));
    let g = elt('g');
    let width = Math.max(...graphs.map(it => it.width)) + padding * 4;
    let height = graphs.map(it => it.height).reduce((a, b) => a + b) + (graphs.length - 1) * padding;

    //这个rect用来撑宽g元素；
    let rect = elt('rect', {
      width,
      height,
      fill: 'none',
    })
    g.append(rect);

    let temp = padding;
    let temp2 = 0;
    for (let graph of graphs) {
      graph.g.setAttribute('transform', `translate(${(width - graph.width) / 2}, ${temp - padding})`)
      temp += graph.height + padding;

      let path = elt('path', {
        d: `
        M 0 ${height / 2} 
        C ${padding} ${height / 2} 
          ${padding} ${temp2 + graph.height / 2} 
          ${padding * 2} ${temp2 + graph.height / 2}
        L ${(width - graph.width) / 2} ${temp2 + graph.height / 2}

        M ${graph.width + (width - graph.width) / 2} ${temp2 + graph.height / 2}
        L ${width - padding * 2} ${temp2 + graph.height / 2}

        M ${width} ${height / 2}
        C ${width - padding} ${height / 2}
          ${width - padding} ${temp2 + graph.height / 2}
          ${width - padding * 2} ${temp2 + graph.height / 2}
      `,
        'stroke-width': 2,
        stroke: 'black',
        fill: 'none',
      })
      temp2 += graph.height + padding;
      g.append(path);
      g.append(graph.g);
    }

    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  // debugger;
  // drawCapturedGroupGraph(regExpTree.branches);
  function drawCapturedGroupGraph(nodes) {
    let groupI = nodes.groupIndex;
    let graphs = drawBranchesGraph(nodes.branches);
    let g = elt('g');
    let width = graphs.width + padding * 2;
    let height = graphs.height + padding * 2;

    //分组编号：
    let text = elt('text', {
      'dominant-baseline': 'hanging',
      x: padding / 3,
      y: padding / 3,
      'font-size': 14,
    }, `group #${groupI}`)
    g.append(text);
    // 撑开g元素;
    let rect = elt('rect', {
      width,
      height,
      fill: 'none',
    })
    g.append(rect);

    let borderRect = elt('rect', {
      width,
      height,
      rx: 3,
      ry: 3,
      fill: 'none',
      stroke: '#918c83',
      'stroke-width': 2,
      'stroke-dasharray': '4 4',
    })
    g.append(borderRect);
    graphs.g.setAttribute('transform', `translate(${padding}, ${padding})`)
    g.append(graphs.g);

    let paddingLine = elt('path', {
      d: `
      M 0 ${height / 2}
      L ${padding} ${height / 2} 

      M ${width - padding} ${height / 2}
      L ${width} ${height / 2}
    `,
      fill: 'none',
      stroke: 'black',
      'stroke-width': 2,
    })
    g.append(paddingLine);
    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }

  }

  //regExpTree.branches[0].elements[0]
  function drawQuantifierGraph(nodes) {
    let graph = drawGraph(nodes.repeatedElement);
    let g = elt('g');
    let width = graph.width + padding * 4;
    let height = graph.height + padding * 2;

    let rect = elt('rect', {
      width,
      height,
      fill: 'none',
    })
    g.append(rect);
    graph.g.setAttribute('transform', `translate(${padding * 2}, ${padding})`)
    g.append(graph.g);
    let path = elt('path', {
      d: `
      M 0 ${height / 2} 
      L ${padding * 2} ${height / 2}
      M ${width - padding * 2} ${height / 2}
      L ${width} ${height / 2}
    `,
      stroke: 'black',
      'stroke-width': 2,
    })
    g.append(path);

    // let lineAbove = elt('path', {
    //   //没有箭头
    //   d: `
    //     M 0 ${height / 2}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
    //     L ${padding} ${padding}
    //     a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
    //     L ${width - padding * 2} 0
    //     a ${padding} ${padding} 0 0 1 ${padding} ${padding}
    //     L ${width - padding} ${(height / 2) - padding}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${padding}
    //   `,
    //   stroke: 'black',
    //   'stroke-width': 2,
    //   fill: 'none',
    // })

    //---------------------------------------------------

    // let lineAboveWithArrow = elt('path', {
    //   //有箭头
    //   d: `
    //     M 0 ${height / 2} 
    //     a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
    //     L ${padding} ${padding}
    //     a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
    //     L ${width - padding * 2} 0
    //     a ${padding} ${padding} 0 0 1 ${padding} ${padding}
    //     L ${width - padding} ${(height / 2) - padding}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${padding}

    //     M ${padding} ${height / 4} 
    //     l ${-padding / 3} ${padding / 3}
    //     M ${padding} ${height / 4} 
    //     l ${padding / 3} ${padding / 3}
    //   `,
    //   stroke: 'black',
    //   'stroke-width': 2,
    //   fill: 'none',
    // })
    //----------------------------------------------------
    // let lineBellow = elt('path', {
    //   //没有箭头
    //   d: `
    //     M ${padding * 2} ${height / 2} 
    //     a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
    //     L ${padding} ${height - padding}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${padding}
    //     L ${width - padding * 2} ${height}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
    //     L ${width - padding} ${height / 2 + padding}
    //     a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
    //   `,
    //   stroke: 'black',
    //   'stroke-width': 2,
    //   fill: 'none',
    // })

    // let lineBellowWithArrow = elt('path', {
    //   //有箭头
    //   d: `
    //     M ${padding * 2} ${height / 2} 
    //     a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
    //     L ${padding} ${height - padding}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${padding}
    //     L ${width - padding * 2} ${height}
    //     a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
    //     L ${width - padding} ${height / 2 + padding}
    //     a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

    //     M ${width - padding} ${(height / 4) * 3}
    //     l ${-padding / 3} ${-padding / 3}
    //     M ${width - padding} ${(height / 4) * 3}
    //     l ${padding / 3} ${-padding / 3}
    //   `,
    //   stroke: 'black',
    //   'stroke-width': 2,
    //   fill: 'none',
    // })

    let quantifier = nodes.quantifier;
    //判断量词的类型：
    //  ?---||---??
    //  +---||---+?
    //  *---||---*?
    //  }---||---}?
    if (quantifier === '?') {
      let lineAbove = elt('path', {
        //没有箭头
        d: `
        M 0 ${height / 2}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${padding} ${padding}
        a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
        L ${width - padding * 2} 0
        a ${padding} ${padding} 0 0 1 ${padding} ${padding}
        L ${width - padding} ${(height / 2) - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineAbove);

    } else if (quantifier === '??') {
      let lineAboveWithArrow = elt('path', {
        //有箭头
        d: `
        M 0 ${height / 2}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${padding} ${padding}
        a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
        L ${width - padding * 2} 0
        a ${padding} ${padding} 0 0 1 ${padding} ${padding}
        L ${width - padding} ${(height / 2) - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}

        M ${padding} ${height / 4}
        l ${-padding / 3} ${-padding / 3}
        M ${padding} ${height / 4}
        l ${padding / 3} ${-padding / 3}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineAboveWithArrow);

    } else if (quantifier === '+') {

      let lineBellowWithArrow = elt('path', {
        //有箭头
        d: `
        M ${padding * 2} ${height / 2}
        a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
        L ${padding} ${height - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
        L ${width - padding * 2} ${height}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${width - padding} ${height / 2 + padding}
        a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

        M ${width - padding} ${(height / 4) * 3}
        l ${-padding / 3} ${-padding / 3}
        M ${width - padding} ${(height / 4) * 3}
        l ${padding / 3} ${-padding / 3}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineBellowWithArrow);
    } else if (quantifier === '+?') {

      let lineBellow = elt('path', {
        //没有箭头
        d: `
        M ${padding * 2} ${height / 2}
        a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
        L ${padding} ${height - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
        L ${width - padding * 2} ${height}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${width - padding} ${height / 2 + padding}
        a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineBellow);
    } else if (quantifier === '*') {
      let lineAbove = elt('path', {
        //没有箭头
        d: `
        M 0 ${height / 2}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${padding} ${padding}
        a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
        L ${width - padding * 2} 0
        a ${padding} ${padding} 0 0 1 ${padding} ${padding}
        L ${width - padding} ${(height / 2) - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })

      let lineBellowWithArrow = elt('path', {
        //有箭头
        d: `
        M ${padding * 2} ${height / 2}
        a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
        L ${padding} ${height - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
        L ${width - padding * 2} ${height}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${width - padding} ${height / 2 + padding}
        a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

        M ${width - padding} ${(height / 4) * 3}
        l ${-padding / 3} ${-padding / 3}
        M ${width - padding} ${(height / 4) * 3}
        l ${padding / 3} ${-padding / 3}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineAbove, lineBellowWithArrow);

    } else if (quantifier === '*?') {

      let lineAboveWithArrow = elt('path', {
        //有箭头
        d: `
        M 0 ${height / 2}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${padding} ${padding}
        a ${padding} ${padding} 0 0 1 ${padding} ${-padding}
        L ${width - padding * 2} 0
        a ${padding} ${padding} 0 0 1 ${padding} ${padding}
        L ${width - padding} ${(height / 2) - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}

        M ${padding} ${height / 4}
        l ${-padding / 3} ${padding / 3}
        M ${padding} ${height / 4}
        l ${padding / 3} ${padding / 3}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })

      let lineBellow = elt('path', {
        //没有箭头
        d: `
        M ${padding * 2} ${height / 2}
        a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
        L ${padding} ${height - padding}
        a ${padding} ${padding} 0 0 0 ${padding} ${padding}
        L ${width - padding * 2} ${height}
        a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
        L ${width - padding} ${height / 2 + padding}
        a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
      `,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'none',
      })
      g.append(lineAboveWithArrow, lineBellow);

    } else if (quantifier === '}') {
      if (nodes.min === 1 && nodes.max === Infinity) {
        // a{1,}
        let lineBellowWithArrow = elt('path', {
          //有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

          M ${width - padding} ${(height / 4) * 3}
          l ${-padding / 3} ${-padding / 3}
          M ${width - padding} ${(height / 4) * 3}
          l ${padding / 3} ${-padding / 3}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        g.append(lineBellowWithArrow);
      } else if (nodes.min > 1 && nodes.max === Infinity) {
        //a{2,} //--> 1+times
        let min = nodes.min;
        let lineBellowWithArrow = elt('path', {
          //有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

          M ${width - padding} ${(height / 4) * 3}
          l ${-padding / 3} ${-padding / 3}
          M ${width - padding} ${(height / 4) * 3}
          l ${padding / 3} ${-padding / 3}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })

        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `${min - 1}+ times`)
        g.append(lineBellowWithArrow, description);
      } else if (nodes.min === 1 && nodes.max !== Infinity) {
        //a{1,22} //--> at most 21 times
        let min = nodes.min, max = nodes.max;
        let lineBellowWithArrow = elt('path', {
          //有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

          M ${width - padding} ${(height / 4) * 3}
          l ${-padding / 3} ${-padding / 3}
          M ${width - padding} ${(height / 4) * 3}
          l ${padding / 3} ${-padding / 3}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `at most ${max - 1} times`)
        g.append(lineBellowWithArrow, description);
      } else if (nodes.min > 1 && nodes.max !== Infinity) {
        //a{2,22} //--> 1...21 times
        let min = nodes.min, max = nodes.max;
        let lineBellowWithArrow = elt('path', {
          //有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}

          M ${width - padding} ${(height / 4) * 3}
          l ${-padding / 3} ${-padding / 3}
          M ${width - padding} ${(height / 4) * 3}
          l ${padding / 3} ${-padding / 3}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `${min - 1}...${max - 1} times`)

        g.append(lineBellowWithArrow, description);
      }
    } else if (quantifier === '}?') {
      if (nodes.min === 1 && nodes.max === Infinity) {
        let lineBellow = elt('path', {
          //没有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        g.append(lineBellow);
      } else if (nodes.min > 1 && nodes.max === Infinity) {
        let min = nodes.min, max = nodes.max;
        let lineBellow = elt('path', {
          //没有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `${min - 1}+ times`)

        g.append(lineBellow, description);
      } else if (nodes.min === 1 && nodes.max !== Infinity) {
        let min = nodes.min, max = nodes.max;
        let lineBellow = elt('path', {
          //没有箭头
          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `at most ${max - 1} times`)
        g.append(lineBellow, description);
      } else if (nodes.min > 1 && nodes.max !== Infinity) {
        let min = nodes.min, max = nodes.max;
        let lineBellow = elt('path', {
          //没有箭头

          d: `
          M ${padding * 2} ${height / 2}
          a ${padding} ${padding} 0 0 0 ${-padding} ${padding}
          L ${padding} ${height - padding}
          a ${padding} ${padding} 0 0 0 ${padding} ${padding}
          L ${width - padding * 2} ${height}
          a ${padding} ${padding} 0 0 0 ${padding} ${-padding}
          L ${width - padding} ${height / 2 + padding}
          a ${padding} ${padding} 0 0 0 ${-padding} ${-padding}
        `,
          stroke: 'black',
          'stroke-width': 2,
          fill: 'none',
        })
        let description = elt('text', {
          'dominant-baseline': 'hanging',
          'font-size': 8,
          'font-size': 7,
          x: padding * 1.5,
          y: height - padding,
        }, `${min - 1}...${max - 1} times`)
        g.append(lineBellow, description);
      }
    }

    let box = g.getBBox();
    return {
      width: box.width,
      height: box.height,
      g,
    }
  }

  function drawGraph(node) {
    if (node.type === 'Char') {
      return drawCharGraph(node);

    } else if (node.type === 'Quantifier') {
      return drawQuantifierGraph(node);

    } else if (node.type === 'Escape') {
      return drawEscapeGraph(node);

    } else if (node.type === 'Branch') {
      return drawBranchGraph(node);

    } else if (node.type === 'CapturedGroup') {
      return drawCapturedGroupGraph(node);

    } else if (node.type === 'CharClass') {
      return drawCharClassGraph(node);
    }

  }
}