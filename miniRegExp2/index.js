let button = document.querySelector('button');
let input = document.querySelector('input');
let resultArea = document.querySelector('.tested-text');
let stringArea = document.querySelector('.original-text');

let string = stringArea.value;
resultArea.addEventListener('scroll', () => {
  stringArea.scrollTop = resultArea.scrollTop;
})
stringArea.addEventListener('scroll', () => {
  resultArea.scrollTop = stringArea.scrollTop;
})

button.addEventListener('click', run);                                                  
input.addEventListener('keyup', run);

function run() {
  let flag = getFlag();

  let re = new RegExp(input.value, flag); 
  let res = '';
  let match; 
  let lastLastIndex = 0; 
  let matchIndex = 1; 
  while (match = re.exec(string, flag)) {
    res += string.slice(lastLastIndex, match.index); 
    res += drawMatch(match, matchIndex);
    lastLastIndex = re.lastIndex;
    matchIndex++;
  }
  res += string.slice(lastLastIndex);
  resultArea.innerHTML = res; 
}

function getFlag() {
  let flags = ['d', 'g', 's', 'i', 'u', 'm', 's']; 
  let res = '';
  let flagNodes = document.querySelectorAll('label input');
  for (let i = 0; i < flags.length; i++) {
    if (flagNodes[i].checked) res += flags[i];
  }
  return res;
}

function drawMatch(match, matchIndex) {
  let array = new Array(match[0].length + 1).fill('');
  //下面的循环在固定的位置加上分组的标签； 

  let groupI = 0;
  for (let item of match.indices) {
    let start = item[0] - match.index; 
    let end = item[1] - match.index; 
    let info = [
      `Match ${matchIndex}`,
      `-------`,
      `Group ${groupI}: ${match[groupI]}`,
      `Pos: ${item[0]}-${item[1]}`
    ].join('\n');
    array[start] = array[start] + `<b data-group="${groupI}" title="${info}">`;
    array[end] += '</b>';
    groupI++;
    matchIndex++;
  }
  //下面的循环将每个字符放入固定的位置； 
  let res = ''
  for (var i = 0; i < match[0].length; i++) {
    res += array[i]; 
    res += match[0][i]; 
  }
  res += array[i]
  return res;
} 

