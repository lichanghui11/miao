class Conway {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.world = new Array(this.height).fill(0).map(it => new Uint8Array(this.width));
    this.alive();
  }

  getNeighbors(x, y) {
    let living = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (!(i === x && j === y)) living += this.world[i]?.[j] ?? 0;
      }
    }
    return living;
  }

  next() {
    let newWorld = new Array(this.height).fill(0).map(it => new Uint8Array(this.width));
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let live = this.world[i][j];
        let neighbors = this.getNeighbors(i, j);
        if (live) {
          if (neighbors === 2 || neighbors === 3) {
            newWorld[i][j] = 1;
          }
        } else {
          if ((neighbors === 3)) {
            newWorld[i][j] = 1;
          }
        }
      }
    }

    // let hasChanged = false;
    // for (let i = 0; i < this.height; i++) {
    //   for (let j = 0; j < this.width; j++) {
    //     if (newWorld[i][j] !== this.world[i][j]) {
    //       hasChanged = true;
    //     }
    //     this.world = newWorld;
    //   }
    // }
    // return hasChanged;
    //判断前后两次的状态
    let before = this.world;
    let after = newWorld;
    if (JSON.stringify(before) === JSON.stringify(after)) return true;
    else {
      this.world = newWorld;
      return false;
    }
  }

  alive(ratio = 0.2) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (Math.random() < ratio) {
          this.world[i][j] = 1;
        } else {
          this.world[i][j] = 0;
        }
      }
    }
    return this.world;
  }

  renderInfo() {
    return this.world.map((rows, rowI) => {
      return '<div>' + rows.map((_, colI) => {
        return `<input type="checkbox" data-row="${rowI}" data-col="${colI}" ${this.world[rowI][colI] ? 'checked' : ''}>`
      }).join('') + '</div>'
    }).join('\n')
  }

  draw(x, y, sample) {
    x = +x;
    y = +y;
    for (let i = x; i < x + sample.length; i++) {
      for (let j = y; j < y + sample[0].length; j++) {
        this.world[i][j] = sample[i - x][j - y];
      }
    }
  }

  canvasify(ctx) {

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = 'black';
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.world[i][j] === 1) {
          ctx.fillRect(j, i, 1, 1);
        } 
      }
    }
  }
}
//-----------封装分割线--------------------------------------


//按钮监听
let next = document.querySelector('#next');
let autoplay = document.querySelector('#autoplay');
let container = document.querySelector('.container');
container.style.imageRendering = 'pixelated';
let ctx = container.getContext('2d');

let game = new Conway(300, 300);

container.width = game.width;
container.height = game.height;

game.canvasify(ctx);
next.addEventListener('click', () => {
  game.next();
  game.canvasify(ctx);
})

container.addEventListener('click', e => {
  if (e.target.matches('input[type="checkbox"]')) {
    let checked = e.target.checked;
    let row = e.target.dataset.row;
    let col = e.target.dataset.col;
    game.world[row][col] = checked ? 1 : 0;
  }
})

//autoplay
let playing = false;
let interval; //计时器
autoplay.addEventListener('click', e => {
  if (!playing) {
    playing = true;
    interval = setInterval(() => {
      let temp = game.next();
      if (temp) {
        clearInterval(interval);
        autoplay.textContent = 'Auto Play';
      }
      game.canvasify(ctx);
    }, 50)
    autoplay.textContent = 'Stop';
  } else {
    playing = false;
    clearInterval(interval);
    autoplay.textContent = 'Auto Play';
  }
})

//samples
let samples = {
  'glider': [[0, 0, 1], [1, 0, 1], [0, 1, 1]],
  'beacon': [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]],
  'dot': [[1]]
}
let pen = document.querySelector('#sample');
window.addEventListener('click', e => {
  if (e.target.matches('input[type="checkbox"]')) {
    let x = e.target.dataset.row;
    let y = e.target.dataset.col;
    if (pen.value === 'dot') {
      game.world[row][col] = checked ? 1 : 0;
    } else {
      game.draw(x, y, samples[pen.value]);
      game.canvasify(ctx);
    }
  }
})