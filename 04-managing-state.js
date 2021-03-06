/*
Managing State
see @link https://beta.reactjs.org/learn/managing-state

이 주제와 관련해 알아야 할 것 = 질문들 
- 변하는 state에 따라 UI가 어떻게 변경되는 지
- state를 잘 구조화하는 법
- 컴포넌트 간에 state를 공유하기 위해 'lift state up'하는 법
- state를 유지하거나 리셋하는 법
- 함수에서 복잡한 상태 로직을 통합해서 다루는 법
- prop drilling 없이 정보를 전달하는 법
- 앱의 규모가 커지면서 어떻게 상태 관리 방법도 수정해나갈 지
*/

/*
Reacting to input with state

- React에서는 '버튼 비활성화 시키기', '성공 메시지 보여주기'와 같은 명령형을 사용하지 않는다.
- 대신, 각각 다른 상태state에 따라 어떤 UI가 보일 지를 선언해둔다. '비활성화 상태'일 땐 이 UI, '성공 상태'일 땐 이 UI같은 것 
  - 어찌보면 디자이너가 UI를 바라보는 시각과 비슷하다.
*/

import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }
  
  /*
  Choosing the state structure
  
  - 상태를 잘 구조화한다면 이후에 수정하거나 디버깅할 때 편리해질 수 있다.
  - 가장 중요한 원칙: 상태state가 중복된 정보나 불필요한 정보를 가지고 있지 않게 한다.
    - 불필요한 상태는 업데이트를 까먹기 쉽고, 이게 결국 버그를 일으킨다.
  */
  
  // 불필요한 상태란 이 예시에서의 `fullName`같은 거
  
  import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

// `fullName`은 `firstName`, `lastName`만 있으면 어차피 알 수 있다. 그냥 계산하자.
// 생각보다 다양한 React 앱 개발 중 버그가 이런 식으로 해결할 수 있다.

import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

/*
Sharing state between components 

- 컴포넌트 2개가 항상 함께 바뀌어야 한다면?
  - lifting state up: 상태를 각 컴포넌트에서 제거해 가장 가까운 공통 부모 컴포넌트로 옮기고 -> props로 내려준다
*/

import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}

/*
Preserving and resetting state 
: 상태의 lifecycle과 그걸 제어하는 법

- 컴포넌트를 rerender할 때, React는 트리의 어떤 부분을 유지할 지/업데이트할 지/다시 생성해야 할 지를 결정해야 한다.
- 기본적으로 React는 이전에 렌더된 컴포넌트 트리와 일치하는(match up) 부분을 그대로 유지한다.
- 대부분의 경우, React가 알아서 어떤 컴포넌트를 변경할 지 잘 결정해준다. 
- 하지만 가끔 이렇게 알아서 해주는 방식이 의도한 대로의 동작이 아니라면?
*/

import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];

// 다른 key를 내려주어서 React가 기본 동작을 덮어씌우고, 강제로 컴포넌트의 상태를 재설정하게 만들 수 있다.
// key를 다르게 준다는 건 React에게 이 컴포너트가 달라졌으니, '다른' 컴포넌트로 취급하라고 말하는 일이다.

import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];

/*
Extracting state logic into a reducer

- 컴포넌트에서 여러 가지 상태 업데이트를 여러 이벤트 핸들러에 걸쳐서 하면 제어가 어려워질 수 있다.
- 이 경우, 이런 상태 업데이트 로직들을 별도의 함수로 만들어서 컴포넌트 밖으로 뺄 수 있다.
  - 이 함수를 'reducer'라고 부른다.
- 이렇게 분리하면 컴포넌트에 있는 이벤트 핸들러는 사용자의 'action'에만 집중할 수 있게 된다. 
- 결론적으로, reducer 함수는 각 action에 대해 상태가 어떻게 업데이트되어야 하는 지를 정의해둔 것이라 할 수 있다. 
*/

import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    taskReducer,
    initialTasks
  );
  
  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];

/*
Passing data deeply with context

- 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 정보를 props로 내려준다.
- 하지만 여러 컴포넌트를 거쳐서 계속 props를 내려주는 건 불편
- `context`는 부모 컴포넌트가 props로 명시적으로 내려주지 않아도 
  자기 아래 트리에 속한 어떤 컴포넌트에서든 필요한 정보에 자유롭게 접근할 수 있게 해준다. 
- 
*/

/*
Scaling up with reducer and context

- Reducer는 컴포넌트의 상태 업데이트 로직들을 모아둘 수 있게 해주고
- Context는 하위 컴포넌트들에 깊이에 상관없이 정보를 전달할 수 있게 해준다.
- Reducer와 Context의 조합으로 복잡한 화면에서의 상태 관리를 할 수 있다. 
  - 부모 컴포넌트가 복잡한 상태 관리 로직을 reducer 로 들고 있고
  - 하위 트리에 있는 자식 컴포넌트들은 어디서든 그 상태를 context에서 읽어서 사용하거나 / 상태 업데이트를 위해 action을 dispatch한다.
*/





      
