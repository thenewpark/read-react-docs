/*
Your First Component
see @link https://beta.reactjs.org/learn/your-first-component
*/

/*
Components: UI building blocks

- React는 마크업, CSS, JavaScript를 하나로 묶어서 '컴포넌트'로 만들 수 있게 한다. 
- 컴포넌트 = 재사용 가능한 UI element
  - <TableOfContents /> 와 같이 custom element를 만들 수 있다.
  - 물론 내부적으로는 동일한 HTML tag들
- cf) Chakra UI, Material UI
*/

/*
Defining a component

- React component는 마크업을 뿌려주는 JS function
  - step1: export the component - `export default` 
  - step2: define the function - `function Profile() {}`
    - React component는 그냥 JS function이지만, 이름은 대문자로 시작해야 한다. 아니면 동작하지 않으니 주의!
  - step3: add markup
    - JSX 문법으로 작성된 마크업을 리턴해준다.
*/

export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}

/*
Using a component
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
