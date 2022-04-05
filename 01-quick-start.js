// Quick Start
// see @link https://beta.reactjs.org/learn

/*
Creating and nesting components

- React Component는 '마크업을 리턴하는 함수'다
- React Component의 이름은 항상 대문자로 시작해야 한다.
*/

function MyButton() {
    return (
        <button>
            Click Me
        </button>
    );
}

export default function MyApp() {
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton />
        </div>
    );
}

/*
Writing markup with JSX

- JSX는 HTML보다 조금 더 까다로운 규칙들이 있다.
  - br 같은 태그는 반드시 닫아줘야 한다. <br />
  - Component는 여러 개의 JSX 태그를 리턴할 수 없다. 반드시 하나의 태그로 감싸야 하며, 별도 태그로 감싸져 있지 않다면 빈 태그로라도 감싸야 한다. <></>
*/

function AboutPage() {
    return (
        <>
            <h1>About</h1>
            <p>Hello there.<br />How do you do?</p>
        </>
    );
}

/*
Adding styles

- React에서는 class 대신 className을 쓴다. 
    <img className="avatar" />
- HTML의 class 어트리뷰트와 동일하다.
*/

/*
Conditional rendering

- 1) js 로직과 동일하게
- 2) conditaional operator(?)를 사용해서
- 3) 혹은 logical(&&) 쓸 수 있다. 
*/
function Component() {
    let content;
    if (isLoggedIn) {
        content = <AdminPanel />;
    } else {
        content = <LoginForm />;
    }
    return (
        <div>
            {content}
        </div>
    );
}

function Component() {
    return (
        <div>
            {isLoggedIn ? (<Admin />) : (<Login />)}
        </div>
    );
}

function Component() {
    return (
        <div>
            {isLoggedIn && <Admin />}
        </div>
    );
}

/*
Rendering lists
- <li>는 각각 유니크한 key값을 가지고 있어야 한다.
    - 보통 이 key는 기존 데이터에서 가지고 온다.(DB ID등)
    - React는 이 key를 가지고 어떤 아이템이 추가되고, 삭제되고, 순서가 바뀌었는 지 등을 확인한다.
*/
const products = [
    { title: 'Cabbage', id: 1 },
    { title: 'Garlic', id: 2 },
    { title: 'Apple', id: 3 },
];

function List() {
    const listItems = products.map(product =>
        <li key={product.id}>
            {product.title}
        </li>
    );

    return (
        <ul>{listItems}</ul>
    );
}

/*
Responding to events

- 컴포넌트 내에 이벤트 핸들러 함수를 선언해서 이벤트를 처리하게 할 수 있다.
- 이벤트 핸들러 함수를 '호출'하지 않는다. 그저 '내려준다'
*/

function Button() {
    function handleClick() {
        alert('You clicked me!');
    }

    return (
        <button onClick={handleClick}>
            Click me
        </button>
    );
}

/*
Updating the screen

- 컴포넌트가 어떤 정보를 '기억'했다가 보여주는 게 필요할 수 있다.
    - 예를 들어, 버튼이 몇 번이나 눌렸는 지를 세고 싶다거나? (이 예시는 좀 별로인걸)
- 이를 위해 컴포넌트에 '상태'를 추가할 수 있다.
    - 1 먼저 `useState`를 import한다.
    - 2 컴포넌트 내에서 사용할 상태 변수(state variable)를 선언한다.
*/

import { useState } from 'react';

function CountingButton() {
    // useStae는 2가지를 반환해준다.
    // - 현재 상태 (count)
    // - 그 상태를 업데이트할 수 있는 함수 (setCount)
    // - 이름은 마음대로 지어도 되지만, 컨벤션은 이렇다. [something, setSomething]
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    // 버튼이 처음 표시될 때 count는 0이다. useState에 전달한 값이 0이기 때문에. 
    // 버튼을 한번 클릭하면 
    // -> 이벤트 핸들러가 호출되고 
    // -> 그 안에서 setCount가 되고 
    // -> React는 이 컴포넌트 함수를 다시 부른다. 
    // -> 이제 count는 1이다.
    return (
        <button onClick={handleClick}>
            Clicked {count} times
        </button>
    );
}

// 이 버튼을 아래와 같이 여러 개 렌더하면, 각 버튼은 자기만의 '상태'를 갖는다.
export default function App() {
    return (
        <div>
            <CountingButton />
            <CountingButton />
        </div>
    );
}

/*
Using Hooks

- `use-`로 시작하는 함수를 `Hooks`라고 부른다. 
- `useState`는 React에서 제공하는 built-in Hook이다.
    - 또다른 built-in Hook들은 https://beta.reactjs.org/apis 에서 찾아볼 수 있다.
    - 물론, 새로운 Hook을 작성할 수도 있다.
- Hook은 보통의 함수보다 엄격한 규칙을 가지고 있다. 
    - Hook은 컴포넌트(또는 또다른 Hook)의 top level에서 호출해야만 한다.
        - 조건절이나 반복문 같은 곳에서 useState와 같은 Hook을 사용할 수 없다는 뜻이다.
*/

/*
Sharing data between components

- 컴포넌트 간에 상태를 공유해야 한다면: 'lifting state up'
    - 각 컴포넌트에 있던 '상태를 위로' 올린다. (공유하는 가장 가까운 부모 컴포넌트로)
    - 올린 '상태'를 다시 각 컴포넌트에 '핸들러와 함께' '내려준다'.
        - 이렇게 내려주는 정보들을 `props`라고 부른다.
*/

function CountingButton({ count, onClick }) {
    return (
        <button onClick={onClick}>
            Clicked {count} times
        </button>
    );
}

export default function MyApp() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>Counters that update together</h1>
            <CountingButton count={count} onClick={handleClick} />
            <CountingButton count={count} onClick={handleClick} />
        </div>
    );
}