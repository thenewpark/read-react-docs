/*
Adding Interactivity
see @link https://beta.reactjs.org/learn/adding-interactivity

- 사용자가 뭔가 입력할 때, 업데이트 되어야 하는 것들이 있다.
- React에서, 시간에 따라 변하는 데이터를 '상태state'라고 부른다.
- 어떤 컴포넌트든 상태를 가질 수 있고, 필요할 때 업데이트할 수 있다.
  - 인터랙션을 처리하는 컴포넌트를 작성하고
  - 컴포넌트의 '상태'를 업데이트하고
  - 그에 따라 다른 결과를 화면에 보여주는 작업을 할 수 있도록 안내한다.
  
이 주제와 관련해 알아야 할 것 = 질문들
- 사용자가 발생시키는 이벤트를 핸들링하는 법
- 컴포넌트가 정보를 '기억'할 수 있게 하기 : state
- React가 UI를 업데이트하는 2단계
- 왜 state를 변경해도 바로 업데이트되지 않는지
- 여러 상태 업데이트를 어떻게 쌓아서 처리하는지
- state에 있는 object를 업데이트하는 법
- state에 있는 array를 업데이트하는 법
*/

/*
Responding to events
*/

export default function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

export default function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  )
}

export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing')}
      onUploadImage={() => alert('Uploading')}
    />
  );
}

/*
State: a component’s memory

- 컴포넌트는 종종 무언가를 '기억'해야 한다.
  - 지금 클릭한 이미지가 무엇인지
  - 지금 장바구니에 담은 상품이 무엇인지
- React에서는 이런 식으로 컴포넌트에 한정된 메모리를 '상태state'라고 부른다. 

- 컴포넌트에 상태를 추가하기 위해 `useState` Hook을 사용한다.
  - 초기 상태값을 받아서 -> 2개 값을 반환한다 = (1) 현재 상태값 (2) 그 상태값을 업데이트 하기 위한 setter function. 
*/

const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);

/*
Render and commit

- 컴포넌트가 실제로 화면에 그려지기 전에, React에서 render하는 과정이 필요하다.
- 컴포넌트는 요리사, React는 웨이터라고 할 때,
  UI를 요청받아서 서빙하는 과정은 3단계를 거친다.
  - Trigger
  - Render
  - Commit
*/

/*
State as a snapshot

- React의 state는 JS에서의 단순 변수와는 달리, 'snapshot'처럼 동작한다.
  - React state을 setting 하면 리렌더링이 trigger된다. 
*/

/*
Queueing a series of state changes
*/

// 이렇게 써도 업데이트가 1번만 된다.
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);
  
  function increment() {
    setScore(score + 1);
  }
  
  return (
    <>
      <button onClick={ () => {
        increment();
        increment();
        increment();
      }}  
      >+3</button>
      <h1>Score: {score}</h1>
    </>
  );
}

// 왜 그런가?
// state을 set하면 -> re-render를 요청하게 된다.
// 하지만 아직 코드가 실행중이라면 변경이 적용되지 않는다.
// 의도한대로 동작시키려면 상태를 설정할 때 updater function을 넘겨주어야 한다. 

import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);
  
  function increment() {
    setScore(s => s + 1);
  }
  
  return (
    <>
      <button onClick={ () => {
        increment();
        increment();
        increment();
      }}  
      >+3</button>
      <h1>Score: {score}</h1>
    </>
  );
}

/*
Updating objects/arrays in state

- state에 object/array가 있다면, object/array를 직접 바꿔서 업데이트해서는 안된다.
  - 대신, 새로운 object/array를 만들거나, 기존 상태의 복사본을 만들어서 그걸로 업데이트할 것
  - 이때 주로 전개 연산자spread syntax `...`를 사용하게 된다. 
(왜 에 대한 부분이 없는디, 상세 목차에 있으려나)
*/
