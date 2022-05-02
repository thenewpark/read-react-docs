# [Scaling Up with Reducer and Context](https://beta.reactjs.org/learn/scaling-up-with-reducer-and-context)

- reducer는 컴포넌트의 상태 업데이트 로직을 한 군데로 모을 수 있게 해준다.
- context는 정보를 여러 뎁스 아래로 전달하기 편리하게 해준다.
- 이 둘을 합쳐서 복잡한 화면에서의 상태 관리를 하는 데 사용할 수 있다.

*대답해볼 질문들*
- reducer와 context를 어떻게 합치는지
- state를 넘겨주고 props로 dispatch하는 걸 어떻게 안할 수 있는지
- context와 상태 로직을 별개의 파일로 어떻게 분리할지

## Combining a reducer with context

- state와 dispatch 함수를 함쳐서 context에 넣을 수 있다. 
  - 이러면 이 context 하위에 있는 어떤 컴포넌트에서든 'prop drilling' 없이 state와 dispatch action을 읽을 수 있다.
- 아래 3단계를 거쳐서 reducer와 context를 합쳐보자.
  - 1) context를 만든다.
  - 2) state와 dispatch를 context에 넣는다.
  - 3) context를 아무데서나 사용한다.

### Step 1: Create the context

- Context 2개를 만든다.
  - state를 위한 Context
  - dispatch를 위한 Context
```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TaskDispatchContext = createContext(null);
```

### Step 2: Put state and dispatch into context

- 이제 `useReducer`에서 돌려준 state와 dispatch 함수를 context에 넣어준다.
```js
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

### Step 3: Use context anywhere in the tree

- 이려면 이제 props를 매 단계마다 전달해줄 필요가 없다.

```js
// AS-IS
<>
  <h1>Day off in Kyoto</h1>
  <AddTask
    onAddTask={handleAddTask}
  />
  <TaskList
    tasks={tasks}
    onChangeTask={handleChangeTask}
    onDeleteTask={handleDeleteTask}
  />
</>

// TO-BE
<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>Day off in Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

- Context 하위에서 state를 사용하고 싶다면 이렇게, 
```js
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

- dispatch 함수를 사용하고 싶다면
```js
const dispatch = useContext(TasksDispatchContext);
```

