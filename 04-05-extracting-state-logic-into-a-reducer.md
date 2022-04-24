# Extracting State Logic into a Reducer

- state 여러 개를 관리해서 이벤트 핸들러 여러 개 곳곳에 상태 관리 로직이 퍼져있는 컴포넌트라면,     
  상태 로직을 **컴포넌트 바깥의 단일 함수(`reducer`)**로 추출해낼 수 있다.

**생각해볼 질문들**
- reducer function이 무엇인지
- `useState`를 `useReducer`로 리팩터링하는 법
- reducer를 언제 쓸지
- 어떻게 하면 reducer를 잘 쓸 수 있을지

## Consolidate state logic with a reducer
- 투두 앱의 예시로도 reducer를 사용하는 경우를 생각해볼 수 있다.    
  아래 코드에서는 할 일을 추가, 삭제, 편집하는 3가지 다른 이벤트 핸들러에서 모두 `tasks` 상태 배열에 접근하고 있다.
  
```jsx
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([...tasks, {
      id: nextId++,
      text: text,
      done: false
    }]);
  }

  function handleChangeTask(task) {
    setTasks(tasks.map(t => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTask(taskId) {
    setTasks(
      tasks.filter(t => t.id !== taskId)
    );
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

- 이렇게 여기저기로 퍼지는 상태 업데이트 로직들을 한 군데로 모아주기 위해 사용하는 함수가 `reducer`다.
- 아래 3단계를 거쳐 `useState`를 `useReducer`로 변경할 수 있다.
  - 1) state를 setting 하는 로직을 -> action을 dispatch하도록 바꾼다.
  - 2) reducer function을 작성한다.
  - 3) 컴포넌트에서 reducer를 사용한다.

### Step 1: Move from setting state to dispatching actions

### Step 2: Write a reducer function

### Step 3: Use the reducer from your component

## Comparing useState and useReducer

## Writing reducers well  

## Comments
- Context + useReducer 조합 vs Redux
- 단계별 접근방식으로 꾸준히 서술하는 거 좋다.
- 각 개념별로 필요성을 확인할 수 있는 '버그가 있는' 예시 


