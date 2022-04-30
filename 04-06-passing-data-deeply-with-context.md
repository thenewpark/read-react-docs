# [Passing Data Deeply with Context](https://beta.reactjs.org/learn/passing-data-deeply-with-context)

- 보통 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달할 때에는 props를 통해 전달한다.
- 하지만 여러 단계를 거치게 될수록 중간에 있는 컴포넌트들에서는 굳이 사용하지도 않는 정보들을 단순히 넘겨주기만 하는 불필요한 코드가 늘어나게 됟나.
- Context를 사용하면 얼마나 깊이 있는 곳까지 정보를 내려주어야 하든 상관없이 Context 하위의 어디에서나 정보를 사용할 수 있게 만들어줄 수 있다.

답해볼 질문
- 'prop drilling'이 무엇인지
- 반복적으로 props를 넘겨주는 걸 context로 어떻게 바꿀 수 있는지
- context를 사용하는 일반적인 사용 예시들
- context를 대체할 방법

## The problem with passing props 

- 'lifting state up'은 종종 'prop drilling'으로 이어진다.
  - 공통의 부모 컴포넌트가 생각보다 위로 많이 타고타고 올라가야 할 수 있기 때문.
  - 이 prop drilling 현상을 해결해주기 위해 context가 등장했다. 

## Context: an alternative to passing props

- context 는 부모 컴포넌트가 자신의 하위에서 데이터를 사용할 수 있게 만들어준다. 
  - 그러니까 자식 입장에서 어딘가 UI 트리 위에 데이터를 물어볼 수 있는 방법이 필요하다.

```javascript
// 이렇게 하나하나 props를 지정해줘야 하는 걸
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>

// 이렇게 바꿀 수 없나?
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

### context 적용 3단계
- 1) create: context 만들기 ex) `LevelContext`
- 2) use: 데이터를 써야 하는 컴포넌트에서 context 사용하기 ex) `<Header>`가 `LevelContext`를 **사용**
- 3) provide: 데이터를 제공해주는 컴포넌트에서 context 제공해주기 ex) `<Section>`이 `LevelContext`를 **제공**

## Step 1: Create the context 

- 일단, context를 만든다.
  - 인자로 context의 기본값을 받는다.
  - 기본값은 객체를 포함해 어떤 값이든 가능하다.
- component가 사용할 수 있도록 해주기 위해 만든 context를 export한다.

```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

## Step 2: Use the context

- 만든 context를 `useContext`훅을 통해 사용한다.

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  // useContext(LevelContext) = Heading 컴포넌트가 LevelContext를 읽어올거야~
  const level = useContext(LevelContext);
}
```
- 이러면 이제 `Heading`컴포넌트에 `level`값을 props로 내려줄 필요가 없다.

```jsx
// AS-IS
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>

// TO-BE
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

- 지금 상태에서는 level값이 4로 적용되지 않는다! context를 '사용'만 하고, '제공'하는 코드를 쓰기 전이기 때문. React는 context를 어디에서 가져와야 하는지 아직 모른다.
  - 이 경우, context의 기본값을 사용한다. 

## Step 3: Provide the context

- context를 사용할 곳을 context provider로 감싸준다.
  - context를 사용하는 컴포넌트에서는 UI 트리에서 가장 가까운 `<LevelContext.Provider>`가 제공하는 값을 사용한다. 

```js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      /* "React야, Section 컴포넌트 안에 있는 컴포넌트가 LevelContext를 달라고 하면, 이 level값을 줘라" */
      <LevelContext.Provider value={level}> 
        {children}
      </LevelContext.Provider>
    </section>
  );
}

```

### Using and providing context from the same component

위의 예시를 이렇게 개선해볼 수도 있다. 
```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

그러면 이렇게 직접 level값을 일일이 지정해주지 않아도, 컴포넌트를 중첩시킨 정도에 따라 알아서 level이 결정된다.
```
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}

```

## Before you use context

- 정보를 여러 단계를 걸쳐서 내려줘야 한다고 무조건 context를 사용하는 게 좋은 건 아니다.
- context를 사용하기 전에, 아래와 같은 점을 고려해보자
  - 1) props를 내려주는 것으로 해결된다면 그렇게 하자. props를 계속 내려주는 게 번거로울 수는 있지만, 어떤 컴포넌트가 어떤 데이터를 사용하는지를 더 명시적으로 드러내는 방법일 수 있다.
  - 2) 컴포넌트를 추출해서 `childern`으로 JSX를 넘겨주는 방법을 고려해보자. 만약 데이터를 내려주는 중간에 해당 데이터를 사용하지는 않는 컴포넌트들이 여러 개 있다면, 중간에 어느정도 추출해낼 컴포넌트들이 있다는 신호일 수 있다. 컴포넌트를 추출해서, 데이터를 전달해줘야 하는 레이어의 수를 줄일 수는 없는지 고려해보자.
  - 이 둘이 모두 적합하지 않다면, 그 다음에야 context를 고려한다.
