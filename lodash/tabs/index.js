

let nodes = document.querySelector('.parent');//仅接收外层的一个div作为参数；
tabs(nodes);

function tabs(nodes) {
  let node = Array.from(nodes.children);

  let buttonContainer = document.createElement('div');
  let tabContainter = document.createElement('div');
  let parent = document.querySelector('.parent');
  let currentI = 0;
  for (let i = 0; i < node.length; i++) {
    let child = node[i];
    tabContainter.append(child);
    let button = document.createElement('button');
    button.textContent = child.dataset.tabname;
    buttonContainer.append(button);
    button.addEventListener('click', e => {
      node[currentI].style.display = 'none';
      buttonContainer.children[currentI].style.color = 'black';

      currentI = i;

      node[currentI].style.display = 'block';
      button.style.color = 'green';
    })
    child.style.display = 'none';
    button.style.color = 'black';
  }
  parent.append(buttonContainer, tabContainter);
  node[0].style.display = 'block';
  buttonContainer.children[0].style.color = 'green';
}
