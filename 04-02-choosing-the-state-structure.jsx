/*
Choosing the State Structure
see @link https://beta.reactjs.org/learn/choosing-the-state-structure
*/

/*
Principles for structuring state

- 1 관련있는 상태들은 그룹핑하기
  - 두 가지 이상의 상태를 항상 함께 업데이트하게 된다면, 걔네들을 하나로 합쳐서 관리할 방법을 고민해보자
- 2 서로 반대되는 상태를 만들지 말자
- 3 불필요한 상태를 만들지 말자
  - props나 기존의 상태들을 조합해서 알 수 있는 값이라면 굳이 상태로 만들지 말자. 괜히 버그만 만든다.
- 4 중복된 상태를 만들지 말자
  - 여러 상태에서 같은 정보를 동일하게 들고 있다면, 상태 간에 싱크를 맞추기가 어렵고 결국 버그가 생긴다. 가능하면 중복된 상태가 생기지 않도록 하자.
- 5 너무 겹겹이 쌓인 상태를 만들지 말자
  - 상태에 계층이 늘어날 수록 업데이트가 까다로워진다. 가능하면 플랫하게 유지하자.
- 이 모든 원칙의 목표: 실수 없이 상태를 쉽게 업데이트할 수 있게 할 것
*/

/*
1 Group related state

- 항상 함께 업데이트되어야 하는 상태라면 하나로 묶는 것을 고려해본다.
  - ex) 좌표의 x, y 값
- 상태에 어떤 게 들어올 지 정확히 알 수 없는 상태라면 객체나 배열로 묶어두는 것을 고려해본다.
  - ex) 사용자 입력 폼의 필드들
*/

// 상태를 하나의 변수로만 관리해야 할지, 여러 개로 관리해야 할지 고민될 수 있다.
// 아래와 같은 경우, 문제가 있는 건 아니다.
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// 하지만 항상 함께 변경되어야 한다면, 하나의 변수로 합치는 게 싱크를 맞추는 걸 깜빡해서 버그를 만드는 일을 방지할 수 있다.
const [position, setPosition] = useState({
  x: 0,
  y: 0
});

/*
2 Avoid contradictions in state

- `isSending`과 `isSent`같은 상태 2가지를 함께 사용하면, 
  - setIsSent, setIsSending을 같이 호출하지 않을 경우에 `isSending`과 `isSent`이 둘 다 true인 있을 수 없는 불가능한 상황이 발생하게 된다. 
  - 이런 상황이 애초에 생기지 않도록, `status`라는 하나의 상태 변수를 두고 3가지 가능한 상태만을 가질 수 있게 수정할 수 있다. 'typing', 'sending', 'sent'같이. 
*/

import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}

/*
3 Avoid redundant state

- 컴포넌트의 props나 이미 있는 상태 변수들로부터 계산할 수 있는 정보라면, 별도의 컴포넌트 상태로 관리하지 말 것
- props로 내려받은 값을 다시 컴포넌트의 state에 재할당하지 말 것! (mirroring props)
  - props가 업데이트되어도, 컴포넌트의 지역 상태는 업데이트되지 않는다. 
    - 의도적으로 모든 업데이트를 무시하기 위한 용도라면 사용한다. 초기값만 props로 받는다거나.
        function Message({ initialColor }) {
          const [color, setColor] = useState(initialColor);
  - 만약 이름을 더 알맞게 바꾸고 싶은 거라면, 그냥 const를 사용해서 이름만 바꾸기.
    function Message({ messageColor }) {
      const color = messageColor;
*/

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
4 Avoid duplication in state
*/

/*
5 Avoid deeply nested state
*/
