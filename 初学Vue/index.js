let app = new Vue({
  el: '#app',
  data() {
    return {
      todos: [
        {
          text: 'haha',
          completed: true,
        }, {
          text: 'hehe',
          completed: false,
        }, {
          text: 'hehe',
          completed: false,
        }, {
          text: 'hehe',
          completed: false,
        }, {
          text: 'hehe',
          completed: false,
        }, {
          text: 'hehe',
          completed: false,
        }
      ],
      activeCategory: 'all',
      showAll: true,
    }
  },

  methods: {
    addTodo(e) {
      if (e.key === 'Enter') {
        let text = e.target.value.trim();
        if (text) {
          let todo = {
            text,
            completed: false,
          }
          this.todos.push(todo);
          e.target.value = '';
        }
      }
    },

    deleteTodo(idx) {
      this.todos.splice(idx, 1);
    },

    toggleAll() {
      let temp = this.todos.every(it => it.completed === true);
      if (temp) {
        this.todos.forEach(it => it.completed = false);
      } else {
        this.todos.forEach(it => it.completed = true);
      }
    },

    clearCompleted() {
      this.todos = this.todos.filter(it => it.completed === false)
    },

    all() {
    },

    active() {
      this.todos = this.todos.filter(it => it.completed === false);
    },

    completed() {
      this.todos = this.todos.filter(it => it.completed === true);
    }
  },
})