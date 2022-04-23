/*
Preserving and Resetting State
see @link https://beta.reactjs.org/learn/preserving-and-resetting-state

질문거리
- React가 컴포넌트 구조도를 보는 방식
- React는 어떤 상태를 유지하고, 어떤 상태를 새로고침할 지 어떻게 정할까
- 어떻게 컴포넌트 상태를 강제로 업데이트하게 할 수 있나?
- keys, types가 리액트 상태를 유지시키는 데 어떤 영향을 미치나
*/

/*
The UI tree

- React Component(JSX) -> React UI tree -> DOM
- React는 JSX로부터 UI tree를 만든다. 
- 그리고 React DOM이 이 UI tree와 매칭되는 브라우저의 DOM 엘리먼트를 업데이트한다.
  - RN은 특정 모바일 플랫폼에 맞는 UI 엘리먼트로 변환해준다.
*/

/*
Same component at the same position preserves state

- 부모의 상태가 변하더라도, 자식 컴포넌트가 같은 위치에서 자식 스스로 변한 게 없다면 상태를 그대로 유지한다.
  - '위치'란 UI tree에서의 위치다. JSX 마크업 상에서의 위치가 아니다!
*/

import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}

/*
Different components at the same position reset state

- 같은 위치에 다른 컴포넌트가 그려지면 -> 전체 subtree의 상태가 초기화된다.
  - React가 컴포넌트를 트리에서 삭제할 때 상태도 없애기 때문
- 이때문에 컴포넌트를 반환하는 함수를 중첩시키면 문제가 생긴다. 컴포넌트 함수는 항상 top level에 선언할 것.
*/

import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField /> 
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}

// 위 예시에서 MyComponent가 렌더 될 때마다 매번 새로운 MyTextField가 렌더된다. 
// -> 같은 위치지만 매번 다른 컴포넌트를 렌더한다.
// -> React가 그 컴포넌트 하위 트리 전체의 상태를 reset한다. = 상태 유지가 되지 않는다.

/*
Resetting state at the same position

- 같은 위치에 있어도 상태를 강제로 초기화해야 하는 경우, 사용할 수 있는 방법은 2가지가 있다.
  - 1) 컴포넌트를 다른 위치에 그려지게 만든다.
  - 2) 각 컴포넌트에 key를 지정해서 명시적으로 다른 컴포넌트임을 알 수 있게 한다.
    - key는 리스트를 그릴 때 사용하는 게 일반적이긴 하지만, 꼭 리스트 그릴 때만 사용하는 용도는 아니다! 
      React가 컴포넌트를 구분하도록 만들어주기 위한 용도로도 사용할 수 있다. 
    - 기본적으로 React는 부모를 기준으로 순서에 따라 구분한다 ex) 첫 번째 counter, 두 번째 counter ...
    - key를 붙이면 그냥 '첫 번째', '두 번째' 가 아니라 서로 다른 별개의 컴포넌트임을 알려줄 수 있다. ex) Taylor용 counter
*/

// 같은 위치
{isPlayerA ? (
  <Counter person="Taylor" />
) : (
  <Counter person="Sarah" />
)}

// 1) 다른 위치
{isPlayerA &&
  <Counter person="Taylor" />
}
{!isPlayerA &&
  <Counter person="Sarah" />
}

// 2) key 지정
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}

 /*
 Resetting a form with a key
 
 - key를 지정해서 상태를 초기화해주는 방식은 폼에서 특히 유용하다.
   - ex) 채팅 앱
   
 - 삭제된 컴포넌트의 상태도 유지하고 싶다면? 
   - 실제 채팅앱에서는 현재 선택한 대화가 아니라 다른 대화로 변경했을 때 이전에 이 대화에서 작성중이던 메시지가 살아있는 경우가 있다. 
   - 이런식으로 컴포넌트가 보이지 않는 상태여도 상태가 살아있게 하는 방법들로는..
     - 1) 모든 chat을 렌더하고 -> 현재 사용하지 않는 건 CSS로 숨긴다. React 트리에서 삭제되지 않을테니 상태도 유지된다.
       - 간단한 UI라면 이렇게 해결! 하지만 규모가 조금 커지면 DOM 노드가 너무 많아 느려지는 문제가 생긴다.
     - 2) lift the state up 을 해서, 아직 대기중인 메시지들을 chat이 아니라 부모 컴포넌트에서 공통으로 관리하게 할 수도 있다. 
       - chat 컴포넌트가 삭제되도 어차피 chat이 상태를 들고 있는 게 아니니 상관없게 된다. 요게 가장 일반적인 방식
     - 3) React state 대신 다른 곳에 메시지를 저장해둬도 된다. 만약 사용자가 페이지를 실수로 닫더라도 메시지를 유지하고 싶다면, 
         chat 컴포넌트가 초기화할 때 localStorage의 정보를 읽어오고, 초안을 작성할 때도 localStorage에 함께 저장하게 할 수 있다. 
 */
 
