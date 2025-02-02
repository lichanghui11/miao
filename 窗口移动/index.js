
let startX;
let startY;
//startX, startY 为元素的初始位置； 
let moveWin;
let winStyle;
let win;

let mouseStartX;
let mouseStartY;
//鼠标起始位置；

let startWidth;
let startHeight;
//元素的初始宽度；
let maxIndex = 5;
window.addEventListener('mousedown', e => {
  if (e.target.matches('.win > h1')) {
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    //鼠标起始位置；

    moveWin = e.target.closest('.win');
    maxIndex++;
    moveWin.style.zIndex = maxIndex;

    startX = parseFloat(moveWin.style.left);
    startY = parseFloat(moveWin.style.top);
    // 元素起始位置；

    window.addEventListener('mousemove', move);
  }
  if (e.target.matches('.win .resizer')) {
    win = e.target.closest('.win');
    win.style.zIndex = maxIndex++;

    mouseStartX = e.clientX;
    mouseStartY = e.clientY;

    startWidth = parseFloat(win.style.width);
    startHeight = parseFloat(win.style.height);
    window.addEventListener('mousemove', resize);
  }
})


function resize(e) {
  if (e.which === 0 || e.buttons === 0) {
    window.removeEventListener('mousemove', resize);
  } else {
    let mouseMoveX = e.clientX;
    let mouseMoveY = e.clientY;
    let endX = mouseMoveX - mouseStartX;
    let endY = mouseMoveY - mouseStartY;


    win.style.width = endX + startWidth + 'px';
    win.style.height = endY + startHeight + 'px';
    window.addEventListener('mousemove', e => {

    })
  }
}


function move(e) {
  if (e.which === 0 || e.buttons === 0) {
    window.removeEventListener('mousemove', move);
  } else {

    let mouseMoveX = e.clientX - mouseStartX;
    let mouseMoveY = e.clientY - mouseStartY;
    //mousemove事件触发后鼠标的位置；

    let endX = startX + mouseMoveX;
    let endY = startY + mouseMoveY;

    if (endX < 20) endX = 0;
    if (endY < 20) endY = 0;
    if (endX > window.innerWidth - moveWin.offsetWidth - 20) endX = window.innerWidth - moveWin.offsetWidth;
    if (endY > window.innerHeight - moveWin.offsetHeight - 20) endY = window.innerHeight - moveWin.offsetHeight;
    moveWin.style.left = endX + 'px';
    moveWin.style.top = endY + 'px';

    // localStorage.setItem('positionX', endX);
    // localStorage.setItem('positonY', endY);
    // window.addEventListener('mousemove', e => {
    //   newX = localStorage.getItem('positionX');
    //   newY = localStorage.getItem('positionY');
    //   moveWin.style.left = newX + 'px';
    //   moveWin.style.top = newY + 'px';
    // })
  }
}

