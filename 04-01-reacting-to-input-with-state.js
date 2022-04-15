/*
Reacting to Input with State

- React는 UI를 선언적으로 조작한다. <-> UI의 개별 부분들을 직접 조작한다.
- 개발자는 컴포넌트가 있을 수 있는 '상태'를 선언하고, 사용자 입력에 따라 상태를 변경한다.
*/

/*
How declarative UI compares to imperative

- UI 인터랙션을 디자인한다면, 사용자 동작에 따라 UI가 어떻게 '변하는지'를 생각해야 한다.
- 사용자가 답을 제출하도록 하는 폼을 생각해보면
  - 사용자가 무언가 폼에 입력하면, '제출' 버튼이 '활성화 된다'.
  - '제출' 버튼을 누르면, 폼과 버튼 모두 '비활성화 되고' 스피너가 '나타난다'
  - 네트워크 요청이 성공하면, 폼은 '숨겨지고' Thank you 메시지가 '나타난다'
  - 네트워크 요청이 실패하면, 에러 메시지가 '나타나고' 폼은 다시 '활성화 된다'
- 명령형 프로그래밍에서는 위 내용이 그대로 '어떻게' 인터랙션을 구현할 지가 된다. 어떤 일이 일어났는 지에 따라 정확히 어떻게 동작해야 하는 지에 대한 설명서를 쓰는 것
  - 컴퓨터에게 '어떻게how' UI를 업데이트할 지를 하나하나 명령하는 방식
  
- 명령형으로 UI를 조작하면 UI가 복잡해질수록 복잡도가 기하급수적으로 늘어나게 된다. 
  - 작은 UI 하나를 수정할 때에도 페이지에 기존에 있던 다른 모든 코드가 정상 동작하는 지를 신경써야 한다. (어떤 걸 보여주고 어떤 걸 숨길 지 등등)
- React는 이 문제를 해결하기 위해 만들어졌다.
  - React에서는 직접 UI를 조작하는 대신, '어떤 것을 보여줄 지를 선언'한다. 그러면 React가 어떻게 업데이트할 지를 결정한다.
*/

// 명령형 방식의 폼 구현

/*
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
*/
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

/*
Thinking about UI declaratively

위에서 살펴봤던 예시를 React에서 다시 구현하면 어떻게 되는지 보자
- 1 컴포넌트의 다양한 시각적 상태들을 정의한다.
- 2 어떤 게 그 상태들의 변화를 일으키는 지 결정한다.
- 3 상태를 `useState`를 사용해 표현한다.
- 4 불필요한 상태 값들은 제거한다.
- 5 상태를 설정해주기 위한 이벤트 핸들러들을 연결한다.
*/
