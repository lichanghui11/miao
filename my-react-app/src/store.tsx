import { atom, useAtom } from 'jotai'

export const statusAtom = atom('all');
type Todo = {
  id: string | number,
  text: String, 
  completed: Boolean,
}


export const todosAtom = atom<Todo[]>([
  {
    id: '11',
    text: 'freen don\'t be sad',
    completed: false,
  },
  {
    id: '22',
    text: 'becky rebecca',
    completed:true, 
  },
  {
    id: '223',
    text: 'Esti Wee',
    completed: false,
  },
  {
    id: '4444',
    text: 'life is hard',
    completed: false,
  },
])
export const countLeftAtom = atom((get) => {
  const todos = get(todosAtom); 
  return todos.filter(it => it.completed === false).length; 
})


export const isAllCompletedAtom = atom((get) => {
  const todos = get(todosAtom);
  return todos.every((it) => it.completed);
});
