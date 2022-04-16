/*
Reacting to Input with State

- React는 UI를 선언적으로 조작한다. <-> UI의 개별 부분들을 직접 조작한다.
- 개발자는 컴포넌트가 있을 수 있는 '상태'를 선언하고, 사용자 입력에 따라 상태를 변경한다.
*/

/*
How declarative UI compares to imperative

- UI 인터랙션을 디자인한다면, 사용자 동작에 따라 UI가 어떻게 '변하는지'를 생각해야 한다.
- 사용자가 답을 제출하도록 하는 폼을 생각해보면
  - 사용자가 무언가 폼에 입력하면, '제출' 버튼이 '활성화 된다'.
  - '제출' 버튼을 누르면, 폼과 버튼 모두 '비활성화 되고' 스피너가 '나타난다'
  - 네트워크 요청이 성공하면, 폼은 '숨겨지고' Thank you 메시지가 '나타난다'
  - 네트워크 요청이 실패하면, 에러 메시지가 '나타나고' 폼은 다시 '활성화 된다'
- 명령형 프로그래밍에서는 위 내용이 그대로 '어떻게' 인터랙션을 구현할 지가 된다. 어떤 일이 일어났는 지에 따라 정확히 어떻게 동작해야 하는 지에 대한 설명서를 쓰는 것
  - 컴퓨터에게 '어떻게how' UI를 업데이트할 지를 하나하나 명령하는 방식
  
- 명령형으로 UI를 조작하면 UI가 복잡해질수록 복잡도가 기하급수적으로 늘어나게 된다. 
  - 작은 UI 하나를 수정할 때에도 페이지에 기존에 있던 다른 모든 코드가 정상 동작하는 지를 신경써야 한다. (어떤 걸 보여주고 어떤 걸 숨길 지 등등)
- React는 이 문제를 해결하기 위해 만들어졌다.
  - React에서는 직접 UI를 조작하는 대신, '어떤 것을 보여줄 지를 선언'한다. 그러면 React가 어떻게 업데이트할 지를 결정한다.
*/

// 명령형 방식의 폼 구현

/*
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
*/
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

/*
Thinking about UI declaratively

위에서 살펴봤던 예시를 React에서 다시 구현하면 어떻게 되는지 보자
- 1 컴포넌트의 다양한 시각적 상태들을 정의한다.
- 2 어떤 게 그 상태들의 변화를 일으키는 지 결정한다.
- 3 상태를 `useState`를 사용해 표현한다.
- 4 불필요한 상태 값들은 제거한다.
- 5 상태를 설정해주기 위한 이벤트 핸들러들을 연결한다.
*/

/*
Step 1: Identify your component’s different visual states

- 먼저 사용자가 보게 되는 UI의 다양한'상태'들을 정의해야 한다.
  - 비었을 때 Empty: '제출' 버튼 비활성화
  - 입력 중일 때 Typing: '제출' 버튼 활성화 (?)
  - 제출 중일 때 Submitting: 폼 전체 비활성화. 스피너 노출.
  - 성공했을 때 Success: 'Thank you' 메시지 노출. 폼 숨기기.
  - 에러났을 때 Error: 입력 중일 때와 동일 + 에러 메시지 노출.
  
 - 그리고 디자이너가 각 경우에 해당하는 시안을 작업하듯이, 
   로직을 추가하기 전에 먼저 다양한 상태에 따른 목업을 작업한다.
*/

export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}

export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}

// 표현해야 하는 시각적 상태가 여러 가지라면, 한 페이지에 한번에 쭉 보여주는 게 편리할 수 있다.
// -> 'living styleguides' 혹은 'storybook'

import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}

function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}

/*
Step 2: Determine what triggers those state changes

- 상태 업데이트는 2종류의 입력으로 일으킬 수 있다. 
  - 1) 사용자의 입력(Human inputs) - 버튼 클릭, 입력창에 타이핑하기, 링크로 이동하기 등등
    - 사용자 입력은 대체로 이벤트 핸들러를 통해 제어된다.
  - 2) 컴퓨터의 입력(Computer inputs) - 네트워크 응답 받아오기, 타임아웃, 이미지 로드 등등
- 2종류 모두 UI 업데이트를 위해 상태값을 세팅해줘야 한다. 
- 계속 보고 있는 폼 예시에서는 
  - 텍스트 입력값을 바꾸면(human input) -> Empty 상태가 Typing 상태로 바뀌거나, Typing 상태였다가 Empty 상태로 바뀌어야 한다. 
  - 제출 버튼을 클릭하면(human input) -> Submitting 상태가 바뀌어야 한다. 
  - 네트워크 응답을 받아오는데 성공하면(computer input) -> Success 상태가 바뀌어야 한다. 
  - 네트워크 응답을 받아오는데 실패하면(computer input) -> Error 상태를 바꾸고, 알맞은 error message를 설정해야 한다.
- 이런 상태 변화를 시각화하기 위해 각 상태의 변화를 보여주는 플로우 차트를 그려보면 좋다. 
*/

/*
Step 3: Represent the state in memory with useState

- '상태'로 관리해야 하는 값들을 `useState`훅을 사용해서 관리하도록 추가한다.
- 처음부터 베스트 프랙티스로 상태값 구조를 잡으려 하지 말고, 일단 무조건 필요한 상태값들을 모두 선언해보자.
- 이후에 불필요한 것들은 합치거나 제거하는 리팩토링을 진행하면 된다.
*/

const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
// 그냥 이렇게 와장창
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);

/*
Step 4: Remove any non-essential state variables

- 상태에 대해 질문해볼 것들
  - 1) 모순을 일으키는 상태들이 있진 않은지?
    : 예를 들어, isTyping과 isSubmitting은 동시에 참일 수 없다. 
    불가능한 상태를 만드는 일이 생기지 않도록 하기 위해 두 상태를 `status`라는 상태로 합치고
    항상 'typing', 'submitting', 'success' 3가지 값 중 한 가지의 값을 가지게 하는 것으로 변경한다.
  - 2) 이미 있는 상태로 만들 수 있진 않은지?
    : isEmpty와 isTyping은 동시에 참일 수 없다. 이 두 상태를 따로 관리하면 오히려 두 상태를 계속 동기화해주어야 하는 과정에서 버그가 생길 확률이 높다.
    isEmpty 상태를 지우고, `answer.length === 0`로 체크할 수 있다.
  - 3) 다른 상태를 뒤집어서 알 수 있는 상태는 아닌지?
    : isError는 이미 `error !== null`로 확인할 수 있으니, 별도의 상태로 관리하지 않아도 된다.
*/

// 그래서 꼭 필요한 상태는 
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
