import { makeObservable, action } from "mobx";
interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [
  {
    id: 1,
    text: "freeeen",
    completed: false,
  },
  {
    id: 2,
    text: "beckyyyyyy",
    completed: true,
  },
  {
    id: 3,
    text: "sarah watttters",
    completed: false,
  },
  {
    id: 4,
    text: "harry poooooter",
    completed: false,
  },
];

let todoStore = makeObservable(todos);
let toggleTodo = action((todo: Todo) => {
  todo.completed = !todo.completed;
});
let deleteTodo = action((i: number) => {
  console.log("store", i);
  console.log(todos)
  todoStore.splice(i, 1)
});

export { todoStore, toggleTodo, deleteTodo };
