import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useTodoStore = defineStore("todos", () => {
  const tasks = ref([
    {
      id: "Tom",
      text: "do a laundry",
      completed: false,
    },
    {
      id: "Gentleman",
      text: "read FINGER SMITH",
      completed: true,
    },
    {
      id: "Sarah Waters",
      text: "Write a book",
      completed: false,
    },
    {
      id: "Miss Lister",
      text: "write diaries",
      completed: false,
    },
  ]);

  const countLeft = computed(() => {
    console.log("count 更新了");
    return tasks.value.filter((it) => it.completed === false).length;
  });

  const isPlura = computed(() => {
    console.log("复数切换了");
    let temp = countLeft.value > 1 ? "s" : "";
    //主动使用store里面的数据都需要自行加上.value;
    return temp;
  });

  const deleteTodo = (todo) => {
    let i = tasks.value.findIndex((it) => it.id === todo.id);
    tasks.value.splice(i, 1);
  };

  const addTodo = (todo) => {
    tasks.value.push(todo);
    //不使用ref监控输入的字符串时， 这个push方法不能监控更新；
    //push方法不能触发countLeft的computed 重计算，改用下面的方法；



    //使用ref监控输入的字符串时， 下面的表达式不能监控更新
    // tasks.value = [...tasks.value, todo];
  };

  const upDatedTodo = (id) => {
    let todo = tasks.value.find((it) => it.id === id);
    if (todo) todo.completed = !todo.completed;
  };

  const toggleAll = () => {
    let temp = tasks.value.every((it) => it.completed === true);
    if (temp) {
      tasks.value.forEach((it) => (it.completed = false));
    } else {
      tasks.value.forEach((it) => (it.completed = true));
    }
  };
  const clearCompleted = computed(() => {
    tasks.value = tasks.value.filter((it) => it.completed === false);
  });

  const isVisible = ref('all');

  const isAllDone = computed(() => {
    return tasks.value.every(it => it.completed === true);
  })
  

  return {
    isAllDone,
    clearCompleted,
    upDatedTodo,
    countLeft,
    isPlura,
    tasks,
    deleteTodo,
    addTodo,
    toggleAll,
    isVisible,
  };
});
