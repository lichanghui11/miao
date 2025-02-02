import { useAtom } from "jotai";
import { todosAtom, isAllCompletedAtom } from "./store";
import { produce } from "immer";

export default function TodoHeader() {
  const [isAllCompleted] = useAtom(isAllCompletedAtom);
  const [, setTodo] = useAtom(todosAtom);

  const toggleAll = () => {
    setTodo(
      produce((draft) => {
        draft.forEach((it) => (it.completed = !isAllCompleted));
      })
    );
  };
  const addTodo = (e) => {
    if (e.key === 'Enter') {
      let text = e.target.value.trim(); 
      if (text) {
        e.target.value = '';
        setTodo(produce(draft => {
          draft.push({
            id: Math.random(), 
            text,
            completed: false,
          })
        }))
      }
    }
  }
  return (
    <div>
      <input checked={isAllCompleted} onChange={toggleAll} type="checkbox" />
      <input onKeyUp={addTodo} type="text" />
    </div>
  );
}
