/*
Sharing State Between Components

see @link https://beta.reactjs.org/learn/sharing-state-between-components
*/

/*
Lifting State Up

- 1) 자식 컴포넌트에서 상태 제거
- 2) 부모 컴포넌트에서 하드코딩된 값을 내려주도록 추가
- 3) 상태로 관리하도록 공통 부모에 추가 + 이 상태를 제어하는 핸들러를 자식에 같이 내려준다.
*/

/*
A single source of truth for each state

- 각각의 유니크한 상태는 관련된 하나의 컴포넌트에서 일관되게 관리되도록 한다.
  - 여러 컴포넌트에서 같은 상태를 복사해서 공유하지 않는다! 
  - 공유해야 한다면 위에서 본 것처럼 lifting state up 해서 state로 관리되는 소스는 1개로 만들고, 필요한 곳에 props로 내려주도록 한다.
  - 구체적은 예시는 [Thinking in React](https://beta.reactjs.org/learn/thinking-in-react)를 참고
  
*/
