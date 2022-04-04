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