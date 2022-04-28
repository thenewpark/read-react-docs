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
