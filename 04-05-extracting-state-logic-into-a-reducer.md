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
state를 setting 하는 로직을 -> action을 dispatch하도록 바꾼다.
- AS-IS: 이벤트 핸들러가 state를 setting해서 'React가 무엇을 할지'를 구체적으로 지정해준다.
  ```javascript
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
  ```
- TO-BE
  - 이벤트 핸들러에서 'action'을 dispatch해서 -> React에게 '사용자가 방금 어떤 행동을 했는지'를 알려준다.
  - 그러니까 구체적으로 상태값을 조작하는 게 아니라, 사용자가 어떤 액션을 하고자 했는지를 선언한다.
  ```javascript
  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }
  ```
  - dispatch에 넘겨주는 이 object를 'action'이라는 이름으로 부른다. 특별히 정해진 규칙 없이 일반적인 JS Object지만, '어떤 일이 일어났는지'에 대한 최소한의 정보를 담는 용도로 사용한다.
    - 하지만 보통 어떤 일이 일어났는지를 설명하는 `type` 문자열은 포함하는 것이 일반적인 컨벤션이다. 그 외 필드는 자유롭게 추가한다. 
    - action은 컴포넌트에 한정되기 때문에 단순히 'added' 같이 일반적인 형식으로 써도 문제없다. 


### Step 2: Write a reducer function
- reducer function은 상태 로직을 담는 곳이다. 
- [Input] 현재 상태, action object를 받아서 -> [Output] 다음 상태 를 리턴해준다.
```javascript
function yourReducer(state, action) {
  // return next state for React to set
}
```
- Step1 에서 제거했던 상태 로직을 여기에 넣는다.
  - 1) 현재 상태를 첫 번재 인자에 넣는다.
  - 2) action object를 두 번째 인자에 넣는다.
  - 3) action에 따라 React가 세팅해야 하는 다음 상태를 리턴해준다.
  ```javascript
  function tasksReducer(tasks, action) {
    if (action.type === 'added') {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    } else if (action.type === 'changed') {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    } else if (action.type === 'deleted') {
      return tasks.filter(t => t.id !== action.id);
    } else {
      throw Error('Unknown action: ' + action.type);
    }
  }
  ```
  - 보통 reducer에서는 switch 문을 사용하는 것이 일반적인 컨벤션이다. 여러 action에 따라 다른 동작을 수행하는 로직이 반복되므로, switch문이 일반적인 if/else보다 가독성이 좋기 때문
  ```javascript
  function tasksReducer(tasks, action) {
    switch (action.type) {
      case 'added': {
        return [...tasks, {
          id: action.id,
          text: action.text,
          done: false
        }];
      }
      case 'changed': {
        return tasks.map(t => {
          if (t.id === action.task.id) {
            return action.task;
          } else {
            return t;
          }
        });
      }
      case 'deleted': {
        return tasks.filter(t => t.id !== action.id);
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  ```

### Step 3: Use the reducer from your component
이제 만들어둔 `tasksReducer`를 컴포넌트에서 가져다 사용할 수 있다. React에서 제공해주는 `useReducer`훅을 사용해 둘을 연결해줄 수 있다. 
```javascript
import { useReducer } from 'react';

// const [tasks, setTasks] = useState(initialTasks);
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```
- `useReducer` 훅은
  - [Input] 2가지 인자를 받아서
    - 1) reducer function
    - 2) 초기 상태 
  - [Output] 2가지를 리턴해준다.
    - 1) 상태 값
    - 2) dispatch function(reducer에게 사용자의 action을 dispatch해주는 용도) 

- reducer를 별도의 파일로 분리할 수도 있다.
  - reducer를 만드는 건 '관심사의 분리' 컴포넌트의 이벤트 핸들러는 '무슨 일이 일어났는지'만 action을 dispatch해서 신경쓰고, 그 action이 일어났을 때 '상태state가 어떻게 업데이트 되어야 하는지'는 reducer function이 신경을 쓰도록 분리하는 것이다. 

## Comparing useState and useReducer 
- reducer가 무조건 좋은 건 (당연히) 아니다!
- 코드량: 보통 `useReducer`를 쓰면 `useState`를 쓰는 것보다 코드량이 늘어난다. 대신, 상태를 비슷하게 처리해야 하는 이벤트 핸들러가 여러 개인 경우는 오히려 불필요하게 반복되는 코드를 줄일 수도 있다.
- 가독성: 간단하게 상태를 관리할 때는 `useState`가 읽고 파악하기에도 좋다. 하지만 복잡해진다면 `useReducer`를 쓰는 게 로직의 'how'와 'what happened'를 깔끔하게 분리하는 방법일 수 있다.
- 디버깅: `useState`를 쓰는 경우, 어디에서 state를 잘못 세팅해주고 있는지를 추적하기가 어렵다. `useReducer`를 쓴다면, reducer 함수 내에 콘솔 로그를 찍어보았을 때 상태가 어떻게 업데이트되고 있으며 어떤 이유에서(어떤 action에서 트리거됐는지)인지를 파악하기 쉽다. 하지만, 쉬운 것과 별개로 useState보다 useReducer가 항상 조금 더 타고타고 들어가야 파악할 수 있는 코드가 될 수밖에 없다.
- 테스트: reducer는 순수함수로 컴포넌트에 의존적이지 않다. 이 말은 독립적으로 export해서 테스트하기 쉽다는 뜻이기도 하다. 보통 컴포넌트는 실제 환경에서 쓰이는 그대로 테스트하는 게 좋긴 하지만, 복잡한 상태 업데이트 로직같은 경우는 로직만 따로 떼어내서 테스트하는 것도 좋은 방법이다.
- 개인적인 선호: 사람마다 reducer 선호도는 다르다. useState와 useReducer는 항상 호환 가능하다. 

## Writing reducers well  

## Comments
- Context + useReducer 조합 vs Redux
- 단계별 접근방식으로 꾸준히 서술하는 거 좋다.
- 각 개념별로 필요성을 확인할 수 있는 '버그가 있는' 예시 


