import { statusAtom, todosAtom } from "./store";
import { useAtom } from "jotai";
import { produce } from "immer";
//todosAtom是一个任务数组，被atom包裹，给useAtom使用
//通过useAtom来改变数据

export default function TodoBody() {
  const [todo, setTodo] = useAtom(todosAtom);

  function deleteTodo(id) {
    setTodo((it) => it.filter((item) => item.id !== id));
  }
  function toggleTodo(id) {
    setTodo(
      produce((draft) => {
        draft[id].completed = !draft[id].completed;
      })
    );
  }
  const [status, setStatus] = useAtom(statusAtom);

  return (
    <ul className={status}>
      {todo.map((it, i) => {
        return (
          <li
            className={`status-${it.completed ? "completed" : "active"}`}
            key={it.id}
          >
            <input
              checked={it.completed}
              onChange={() => toggleTodo(i)}
              type="checkbox"
            />
            <span>{it.text}</span>
            <button onClick={() => deleteTodo(it.id)}>&times;</button>
          </li>
        );
      })}
    </ul>
  );
}
