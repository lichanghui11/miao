import { observer } from "mobx-react-lite";

import TodoItem from "./TodoItem";
import { todoStore, toggleTodo, deleteTodo } from "./store";

const TodoBody = observer(() => {
  let todoItems = todoStore.map((item, i) => {
    return (
      <TodoItem
        onClick={() => deleteTodo(i)}
        onChange={() => toggleTodo(item)}
        {...item}
        key={item.id}
      />
    );
  });

  return <ul>{todoItems}</ul>;
});
export default TodoBody;
