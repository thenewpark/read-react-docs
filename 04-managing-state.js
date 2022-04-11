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

