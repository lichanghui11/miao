在 StackBlitz 上通过 `<script>` 标签使用 CDN 引入 MobX 并创建一个 TodoList 项目是完全可行的。下面是一个详细的步骤指南，帮助你完成这个任务。

## 1. 创建一个新的 StackBlitz 项目

1. **访问 [StackBlitz](https://stackblitz.com/) 网站**。
2. **选择 "JavaScript" 模板**，因为我们将使用原生 JavaScript 和 React。
3. **创建一个新的项目**，命名为例如 `mobx-todo-app`。

## 2. 设置项目结构

假设我们使用一个简单的 HTML 文件来包含所有内容：

```
mobx-todo-app/
├── index.html
├── script.js
├── styles.css
```

## 3. 在 `index.html` 中引入必要的库

在你的 `index.html` 文件中，通过 `<script>` 标签引入 React、ReactDOM、MobX 和 MobX React Lite 的 CDN。以下是一个示例：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>MobX Todo List</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="root"></div>

  <!-- 引入 React 和 ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

  <!-- 引入 MobX 和 MobX React Lite -->
  <script src="https://unpkg.com/mobx@6.9.0/dist/mobx.umd.development.js" crossorigin></script>
  <script src="https://unpkg.com/mobx-react-lite@3.4.0/dist/mobxreactlite.umd.development.js" crossorigin></script>

  <!-- 引入你的自定义脚本 -->
  <script src="script.js" type="text/javascript"></script>
</body>
</html>
```

**说明：**

- **React 和 ReactDOM**：用于构建和渲染 React 组件。
- **MobX**：用于状态管理。
- **MobX React Lite**：将 MobX 与 React 集成，提供 `observer` 函数。

## 4. 编写 `script.js` 文件

在 `script.js` 中，我们将：

1. 创建一个 MobX store 来管理 TodoList 的状态。
2. 创建 React 组件来显示和操作 TodoList。
3. 使用 `observer` 使组件响应 MobX 状态的变化。

以下是完整的 `script.js` 示例：

```javascript
// 从全局变量中获取 MobX 和 MobX React Lite 的 API
const { makeAutoObservable } = mobx;
const { observer } = mobxReactLite;

// 1. 创建 MobX Store
class TodoStore {
  todos = [];
  filter = "";

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(title) {
    if (title.trim() === "") return;
    this.todos.push({ id: Date.now(), title, completed: false });
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  setFilter(filter) {
    this.filter = filter;
  }

  get filteredTodos() {
    if (this.filter === "") {
      return this.todos;
    }
    return this.todos.filter((todo) =>
      todo.title.toLowerCase().includes(this.filter.toLowerCase())
    );
  }
}

const todoStore = new TodoStore();

// 2. 创建 React 组件

// TodoList 组件
const TodoList = observer(() => {
  const [newTodo, setNewTodo] = React.useState("");

  const handleAdd = () => {
    todoStore.addTodo(newTodo);
    setNewTodo("");
  };

  const handleFilterChange = (e) => {
    todoStore.setFilter(e.target.value);
  };

  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h1', null, 'MobX Todo List'),

      // 输入新待办事项
      React.createElement('div', { className: 'input-group' },
        React.createElement('input', {
          type: 'text',
          value: newTodo,
          onChange: (e) => setNewTodo(e.target.value),
          placeholder: '添加新的待办事项'
        }),
        React.createElement('button', { onClick: handleAdd }, '添加')
      ),

      // 过滤输入框
      React.createElement('div', { className: 'input-group' },
        React.createElement('input', {
          type: 'text',
          value: todoStore.filter,
          onChange: handleFilterChange,
          placeholder: '过滤待办事项'
        })
      ),

      // 待办事项列表
      React.createElement('ul', null,
        todoStore.filteredTodos.map((todo) =>
          React.createElement('li', { key: todo.id, className: 'todo-item' },
            React.createElement('input', {
              type: 'checkbox',
              checked: todo.completed,
              onChange: () => todoStore.toggleTodo(todo.id)
            }),
            React.createElement('span', {
              style: { textDecoration: todo.completed ? 'line-through' : 'none' }
            }, todo.title)
          )
        )
      )
    )
  );
});

// 3. 渲染 React 组件
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(TodoList, null)
);
```

**说明：**

- **`TodoStore` 类**：
  - 使用 `makeAutoObservable` 将类的属性和方法转化为可观察的状态和动作。
  - `todos`：存储待办事项列表。
  - `filter`：用于过滤待办事项。
  - `addTodo`：添加新的待办事项。
  - `toggleTodo`：切换待办事项的完成状态。
  - `setFilter`：设置过滤条件。
  - `filteredTodos`：计算属性，根据 `filter` 返回过滤后的待办事项。

- **`TodoList` 组件**：
  - 使用 `observer` 包装，使其响应 MobX 状态的变化。
  - 使用 React 的 `useState` 管理输入框的本地状态。
  - 通过 `todoStore` 访问和修改 MobX 状态。

- **渲染组件**：
  - 使用 `ReactDOM.createRoot` 渲染 `TodoList` 组件到页面上。

## 5. 添加样式（可选）

为了让应用看起来更美观，可以在 `styles.css` 中添加一些基本样式：

```css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  padding: 20px;
}

.container {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.input-group {
  display: flex;
  margin-bottom: 10px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  font-size: 16px;
}

.input-group button {
  padding: 8px 16px;
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.todo-item span {
  margin-left: 10px;
}
```

## 6. 完整项目结构

```
mobx-todo-app/
├── index.html
├── script.js
├── styles.css
```

## 7. 最终效果

打开 StackBlitz 项目后，你应该会看到一个简单的 Todo List 应用，具备以下功能：

- **添加待办事项**：在输入框中输入内容，点击 "添加" 按钮，将新待办事项添加到列表中。
- **过滤待办事项**：在过滤输入框中输入内容，动态过滤显示的待办事项。
- **切换完成状态**：通过勾选复选框，可以切换待办事项的完成状态，完成的事项会有删除线。

## 8. 进一步优化

### 8.1. 使用 ES6 模块和更现代的 React 语法

如果你希望使用更现代的 React 语法（如 JSX），建议使用 Babel 转译器。但在使用纯 `<script>` 标签的环境下，这可能会增加复杂性。以下是一个简化的例子，展示如何在不使用 JSX 的情况下编写 React 组件：

```javascript
// 使用 React.createElement 替代 JSX
const TodoList = observer(() => {
  // ...与之前相同
});
```

### 8.2. 使用 Babel 来支持 JSX

如果你希望在 `<script>` 标签中直接使用 JSX，可以引入 Babel 并设置 `type="text/babel"`。以下是一个示例：

**更新 `index.html`：**

```html
<!-- 引入 Babel -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- 更新你的自定义脚本 -->
<script src="script.js" type="text/babel"></script>
```

**更新 `script.js` 使用 JSX：**

```jsx
// 现在可以使用 JSX 语法

const { makeAutoObservable } = mobx;
const { observer } = mobxReactLite;

class TodoStore {
  // ...与之前相同
}

const todoStore = new TodoStore();

const TodoList = observer(() => {
  const [newTodo, setNewTodo] = React.useState("");

  const handleAdd = () => {
    todoStore.addTodo(newTodo);
    setNewTodo("");
  };

  const handleFilterChange = (e) => {
    todoStore.setFilter(e.target.value);
  };

  return (
    <div className="container">
      <h1>MobX Todo List</h1>

      <div className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加新的待办事项"
        />
        <button onClick={handleAdd}>添加</button>
      </div>

      <div className="input-group">
        <input
          type="text"
          value={todoStore.filter}
          onChange={handleFilterChange}
          placeholder="过滤待办事项"
        />
      </div>

      <ul>
        {todoStore.filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => todoStore.toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <TodoList />
);
```

**注意：** 使用 Babel 会在浏览器中实时转译 JSX，可能会影响性能，尤其是在大型项目中。对于学习和小型项目，这是可行的，但在生产环境中，建议使用构建工具（如 Vite、Webpack 等）进行预编译。

### 8.3. 使用 `Provider` 和 `useContext` 提供 Store

对于更复杂的应用，可能需要将 Store 提供给多个组件，可以使用 React 的 `Context` 来实现。但在这个简单的 TodoList 项目中，直接引入 `todoStore` 是足够的。

## 9. 结论

通过上述步骤，你已经成功在 StackBlitz 上通过 `<script>` 标签使用 CDN 引入 MobX，并创建了一个功能齐全的 TodoList 应用。这种方式适合快速原型开发和学习，但对于更复杂的项目，建议使用模块打包工具（如 Vite）来管理依赖和模块。

如果你有任何进一步的问题或需要更详细的解释，请随时提问！