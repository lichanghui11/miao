/*
1, woker计算正则 (包括分组， 零宽断言)
2, 将正则高亮
3, 还原光标位置
4, 调整title位置

5, replace
*/




// 取得元素DOM;
let testBtn = document.querySelector('.run'); //测试按钮；
let inputReg = document.querySelector('#inputReg');//正则输入；
let output = document.querySelector('.result'); //字符串输入与输出；
let flagInput = document.querySelector('.flags'); // 拿到标志位的容器;
let state = document.querySelector('div.input span.state'); //拿到匹配的状态span标签(done, processing, timeout)；
let hint = document.querySelector('div.hint'); //拿到语法错误提示元素；
let title = document.querySelector('#tips'); //浮动title;
let replace = document.querySelector('div.replaceText'); //拿到待替换文本元素框；
let finalText = document.querySelector('div.finalText'); //拿到替换后结果文本框； 

//--------事件监听区域--
testBtn.addEventListener('click', run); //监听TEST按钮； 
inputReg.addEventListener('input', run); //监听正则输入完成；
output.addEventListener('input', run); //监听文本区域输入完成；
window.addEventListener('load', run);//监听加载成功后运行run函数； 




//--------监听匹配元素漂浮元素位置----
replace.addEventListener('input', e => {
  replace.style.height = 'auto';
  replace.style.height = replace.scrollHeight + 'px';
})

console.log(output.innerHTML)

output.addEventListener('mousemove', e => {
  if (e.target.matches('u')) {
    let u = e.target;
    let uBoxes = u.getClientRects();
    let titleInfo = u.dataset.title;
    console.log(titleInfo)
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let box = getHoverBoxes(uBoxes, mouseY);
    title.textContent = titleInfo;
    title.style.display = 'block';
    title.style.top = box.top + 'px';
    title.style.left = mouseX + 'px';
  }
})

output.addEventListener('mouseleave', e => {
  if (e.target.matches('u')) {
    title.style.display = 'none';
  }
}, true)



//--------辅助函数区域---
function run() {
  hint.textContent = 'There are no errors.';
  hint.style.border = '2px green double';
  hint.style.color = 'green';

  let reString = inputReg.value;
  if (reString.length === 0) return;

  let flags = getFlags();
  let string = output.textContent;
  try {
    var re = new RegExp(reString, flags);
  } catch (e) {
    if (e instanceof SyntaxError) {
      hint.textContent = e.message.toString();
      hint.style.border = '2px red double';
      hint.style.color = 'red';
      return;
    } else {
      throw e;
    }
  }
  let done = false;
  setTimeout(() => {
    if (done === false)
      state.id = 'processing', state.textContent = 'Processing...'; // 更新状态；
  }, 500);
  getMatchesFromWorker(re, string, (matches) => {
    done = true;
    state.id = 'done', state.textContent = 'Done'; // 更新状态；

    let html = '';
    let lastLastIndex = 0;
    let matchIndex = 0;
    for (let match of matches) {
      html += string.slice(lastLastIndex, match.index);
      html += highLightMatch(match, matchIndex);
      lastLastIndex = match.index + match[0].length;
      matchIndex++;
    }
    html += string.slice(lastLastIndex);
    var cursorI = getCursorI(output);
    output.innerHTML = html;
    restoreCursorI(output, cursorI);
  }, () => {
    state.id = 'timeout', state.textContent = 'Timeout!'; // 更新状态；
  })
}

function getCursorI(node) {
  let selection = document.getSelection();
  if (selection?.anchorNode?.nodeType === document.TEXT_NODE) {
    let position = 0; //记录光标在文本中的位置； 
    traversal(node, textNode => {
      if (textNode === selection.anchorNode) {
        position += selection.anchorOffset;
        return false;
      } else {
        position += textNode.textContent.length;
      }
    })
    return position;
  }
}

function restoreCursorI(node, index) {
  let selection = document.getSelection();
  if (selection.anchorNode?.className === 'result') {
    traversal(node, textNode => {
      if (index > textNode.textContent.length) index -= textNode.textContent.length;
      else {
        selection.setPosition(textNode, index);
        return false;
      }
    })
  }
}

// 遍历DOM节点
function traversal(node, func) {
  for (let child of node.childNodes) {
    if (child.nodeType === document.TEXT_NODE) {
      if (func(child) === false) return false;
    } else if (child.nodeType === document.ELEMENT_NODE) {
      if (traversal(child, func) === false) return false;
    }
  }
}



function getHoverBoxes(boxes, y) {
  if (boxes.length === 1) return boxes[0];
  for (let box of boxes) {
    if (y >= box.top && y <= box.bottom) return box;
  }
  return boxes[0];
}

function highLightMatch(match, matchIndex) {
  //该函数将匹配的分组高亮；
  let info;
  if (match[0].length === 0) {
    info = [
      `Match ${matchIndex}`,
      `------`,
      `Group 0:`,
      `empty string`,
      `Pos: ${match.index}-${match.index}`
    ].join('\n');
    return `<u id="zero-width-assertion" data-title="${info}"></u>`
  }

  let helper = new Array(match[0].length + 1).fill('');
  let groupIndex = 0;
  for (let index of match.indices) {
    let i = index[0] - match.index;
    let j = index[1] - match.index;
    info = [
      `Match ${matchIndex + 1}`,
      `-----`,
      `Group: ${groupIndex}`,
      `Pos: ${index[0]}-${index[1]}`,
    ].join('\n')
    helper[i] += `<u data-group-index="${groupIndex}" data-title="${info}">`;
    helper[j] = '</u>' + helper[j];
    groupIndex++;
  }
  let res = '';
  for (var i = 0; i < match[0].length; i++) {
    res += helper[i] + match[0][i];
  }
  res += helper[i];
  return res;
}

let flags = ['g', 'i', 'm', 'd', 'x', 's', 'u']
function getFlags() {
  let res = '';
  let flags = flagInput.getElementsByTagName('input');
  flags = Array.from(flags);
  flags.filter((item) => {
    if (item.checked) res += item.name;
  });
  return res;
}

function getMatchesFromWorker(re, string, successFunc, failedFunc) {
  let worker = new Worker('./worker.js');
  let received = false; //是否成功接收来自worker的消息； 
  let data;

  worker.postMessage({
    re: re,
    string: string
  });

  worker.addEventListener('message', e => {
    data = e.data;
    received = true;
    worker.terminate();
    successFunc(data);
  })

  setTimeout(() => {
    if (received === false) {
      worker.terminate();
      failedFunc();
    }
  }, 2000);
}
replace.addEventListener('input', e => {
  let replacedText = e.target.textContent;
  let re = inputReg.value;
  let flags = getFlags(); 
  let flagG = flags.includes('g') ? true : false;
  let regularExp = new RegExp(re, flags);
  let string = output.textContent;
  let res = '';
  if (flagG) {
    res = string.replaceAll(regularExp, replacedText);
  } else {
    res = string.replace(regularExp, replacedText);
  }
  finalText.textContent = res; 
})

