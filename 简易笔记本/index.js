let list = document.querySelector('#list');
function addToList(name) {
  let option = document.createElement('option');
  option.textContent = name;
  list.appendChild(option);
}
let notes = JSON.parse(localStorage.getItem('notes')) || { 'Shopping list': '' };
for (let name in notes) {
  if (notes.hasOwnProperty(name)) addToList(name);
}

function saveToStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('selectedNote', list.value);
}

let current = document.querySelector('#currentNote');
//list.value即笔记对象的属性名称；
list.value = localStorage.getItem('selectedNote') ?? list.value;
current.value = notes[list.value];


list.addEventListener('change', () => {
  current.value = notes[list.value];
  localStorage.setItem('selectedNote', list.value);
})
current.addEventListener('input', () => {
  notes[list.value] = current.value;
  saveToStorage();
})

window.addEventListener('storage', e => {
  let changedKey = e.key; 
  console.log(changedKey);
  if (changedKey === 'notes') {
    notes = JSON.parse(localStorage.getItem('notes'));
    current.value = notes[list.value];
  }
})
function addNote() {
  let name = prompt('Note name', '')
  if (!name) return;
  if (!notes.hasOwnProperty(name)) {
    notes[name] = '';
    addToList(name);
    saveToStorage();
  }
  list.value = name;
  current.value = notes[name];
}

let btnInput = document.querySelector('.导入');

let input = document.querySelector('#fileInput');
btnInput.addEventListener('click', () => {
  input.click();
})

let output = document.querySelector('.导出');
output.addEventListener('click', e => {
  let blob = new Blob([JSON.stringify(notes)], { type: 'application/json' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = 'note.json';
  a.click();
  URL.revokeObjectURL(url);
})
