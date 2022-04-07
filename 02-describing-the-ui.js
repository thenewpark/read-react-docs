/*
Your first component

- React 앱은 'component'라고 부르는 독립적인 UI 조각으로 이루어지다.
- React component는 마크업을 뿌려주는 JavaScript function이다.
*/

function Profile() {
    return (
        <img
            src="https://i.imgur.com/MK3eW3As.jpg"
            alt="Katherine Johnson"
        />
    );
}

export default function Gallery() {
    return (
        <section>
            <h1>Amazing scientists</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}

/*
Importing and exporting components
*/

import Profile from './Profile.js';

export default function Gallery() {
    return (
        <section>
            <h1>Amazing scientists</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}

/*
Writing markup with JSX

- React component에서 마크업을 쓸 때는 JSX라는 syntax extension을 사용한다.
*/
export default function TodoList() {
    return (
        <>
            <h1>Hedy Lamarr's Todos</h1>
            <img
                src="https://i.imgur.com/yXOvdOSs.jpg"
                alt="Hedy Lamarr"
                className="photo"
            />
            <ul>
                <li>Invent new traffic lights</li>
                <li>Rehearse a movie scene</li>
                <li>Improve spectrum technology</li>
            </ul>
        </>
    );
}

/*
JavaScript in JSX with curly braces
- JSX에서는 {} 를 사용해 마크업에서 js를 사용할 수 있게 해준다.

Passing props to a component
- React component는 서로 통신하기 위해 props를 사용한다.
    - object, array, function을 포함해 어떤 JS값이든 props가 될 수 있으며, 심지어는 JSX도 가능하다.
*/

/*
Keeping components pure

- 컴포넌트는 pure function으로 만들어라
    - pure function은 호출되기 전의(해당 함수 바깥의) 객체나 변수를 변경하지 않는다.
    - pure function은 같은 인풋이 들어오면 항상 같은 값을 리턴해줘야 한다.
*/

// impure한 예
let guest = 0;

function Cup() {
    guest = guest + 1; // Cup 함수가 불리기 전에 이미 있는 값을 변경한다.
    return <h2>Tea cup for guest #{guest}</h2>;
}

// (약간 반복되는 내용들이 많긴 한데, 처음 보는 입장에서는 괜찮은 흐름이려나)
