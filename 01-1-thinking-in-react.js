// Thinking in React
// see @link https://beta.reactjs.org/learn/thinking-in-react

/*
Start with the mockup
*/

/*
Step 1: UI -> 컴포넌트 위계도

- 목업의 컴포넌트/하위컴포넌트에 박스 그리기부터
- 하나의 박스는
    - 하나의 역할만 하도록(SRP)
    - css class selector를 뭘로 지정할 지 고려해보고
    - 디자인의 레이어들을 어떻게 정리할 지를 고려해서
*/

/*
Step 2: Build a static version in React

- static version 먼저 -> 이후에 interaction 추가하기
    - static 버전을 만들 때는 state를 잊기. props로만 구성
- top down으로 하거나, bottom up으로 하거나
    - 보통 top down이 보통 더 쉽고, 규모가 조금 크다면 bottom up이 상대적으로 더 쉬워진다.
*/

/*
Step 3: Find the minimal but complete representation of UI state

- state는 최소로 사용한다.
    - state들로 계산해낼 수 있는 값은 굳이 따로 state로 만들지 않고, state로부터 계산해서 사용한다.
    - 상품 목록을 state로 관리한다면, 상품 개수는 굳이 따로 state로 관리하지 않는다. 그냥 상품 목록의 길이를 읽기
- 데이터가 '상태'로 취급되어야 하는지 결정하는 기준들
  : 아래 3가지가 아닌 데이터가 있다면 그게 state
    - 시간이 지나면서 변하지 않는가? -> 그렇다면 state가 아니다
    - 부모로부터 props로 내려받는가? -> 그렇다면 state가 아니다
    - 기존에 있는 state나 props로부터 계산할 수 있나? -> 절대 state가 아니다!
*/

/*
Step 4: Identify where your state should live

- 최소 세트의 state 데이터들을 정했다면, 그 state들을 어떤 컴포넌트가 가지고 있을 지 정해야 한다.
- 아래 순서를 따른다.
    - 1 state에 따라 render되어야 하는 모든 컴포넌트를 리스트업
    - 2 그 컴포넌트들의 공통 부모들이 있는지 찾기
    - 3 state를 가지고 있을 곳 결정
        - 공통 부모에서 바로 가지고 있거나
        - 공통 부모보다 위 어딘가에서 가지고 있거나
        - 만약 기존의 공통 부모들이 가지고 있기 애매하면 상태를 들고 있기 위한 새로운 컴포넌트를 만들 수도 있다.
        - (...? 뭔가 처음 보는 입장이면 뭐든 할 수 있다로 보일 것 같은데 도움되는 가이드인가ㅋㅋ)
    
*/

/*
Step 5: Add inverse data flow

- React는 기본적으로 one-way data flow
- 이벤트 핸들러를 내려주어서 반대 방향으로의 데이터 업데이트가 가능하게 한다.
*/