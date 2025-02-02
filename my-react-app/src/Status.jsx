import { useAtom } from "jotai";
import {todosAtom, statusAtom } from "./store";
import { produce } from 'immer';
export default function Status() {
  const [status, setStatus] = useAtom(statusAtom);

  const [todo, setTodo] = useAtom(todosAtom);
  const clearCompleted = () => {
    setTodo(produce(draft => {
      return draft.filter(it => it.completed === false);
    })) 
  }
  return (
    <div>
      <label>
        <input
          checked={status === "all"}
          name="all"
          onChange={() => setStatus("all")}
          type="radio"
        />
        All
      </label>
      <label>
        <input
          checked={status === "active"}
          name="active"
          onChange={() => setStatus("active")}
          type="radio"
        />
        Active
      </label>
      <label>
        <input
          checked={status === "completed"}
          name="completed"
          onChange={() => setStatus("completed")}
          type="radio"
        />
        Completed
      </label>
      <hr />
      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  );
}
