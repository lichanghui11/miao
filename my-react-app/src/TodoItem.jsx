import { todosAtom } from "./store"
import { useSetAtom } from "jotai"

export default function TodoItem({task}) {
  const [todo, setTodo] = useSetAtom(todosAtom);

  function toggleOneTask() {

  }
  return (
    <div>
      <input onChange={toggleOneTask} type="checkbox" />
      <span>demo text</span>
      <button>&times;</button>
    </div>
  )
}