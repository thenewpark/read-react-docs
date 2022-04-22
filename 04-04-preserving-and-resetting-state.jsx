/*
Preserving and Resetting State

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
