import APIS from "../src/modules/api.js";

let noteEditor = document.getElementById("noteEditor");
let saveStatus = document.getElementById("saveStatus");

let DOC_ID = 156086;
let DEBOUNCE_MS = 700;
let saveTimer = null; //

// 상태 출력
function setStatus(text) {
  if (saveStatus) {
    saveStatus.textContent = text;
  } else {
    console.log("[status]", text);
  }
}

// 실제 저장
function saveNow(content) {
  setStatus("저장 중…");

  APIS.updateDocument(DOC_ID, {
    title: "제목",
    content: content,
  });

  setTimeout(function () {
    setStatus("저장됨");
  }, 500);
}

// 입력 핸들러
function onInput(event) {
  var text = event.target.value;
  setStatus("저장 대기 중…");

  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(function () {
    saveNow(text.trim());
  }, DEBOUNCE_MS);
}

if (noteEditor) {
  noteEditor.addEventListener("input", onInput);
}
