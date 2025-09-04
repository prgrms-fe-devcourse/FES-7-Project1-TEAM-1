import APIS from "../modules/api.js";
import { state } from './explorer.js'

const headerTitle = document.getElementById("header-title");

const editorTitle = document.getElementById("editor-title");
const noteEditor = document.getElementById("noteEditor"); // TextArea 영역

// 내용 지우기 버튼
const clearBtn = document.getElementById("clearBtn"); // TextArea 영역의 쓰레기통 Icon ( 기능적으로는 텍스트 초기화 )

// 편집기 부분 글자수 Counting
const charCount = document.getElementById("char-count");

let DEBOUNCE_MS = 300;
let saveTimer = null; //

// 상태 출력  (저장 상태 출력)
function setStatus(text) {
    console.log("[status]", text);
}

// 내용 저장 기능 담당 (자동 저장)
async function saveNowContent(content) {
    const DOC_ID = state.currentDocumentId;
    setStatus("내용 저장 중…");

    if (content.length >= 1) {
        try {
            await APIS.updateDocument(DOC_ID, {
                title: editorTitle.value,
                content: content,
            });
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            await APIS.updateDocument(DOC_ID, {
                content: null,
            });
        } catch (err) {
            console.error(err)
        }
    }


    setTimeout(function () {
        setStatus("저장됨");
    }, DEBOUNCE_MS);
}

// 제목 저장 기능 담당 (자동 저장)
async function saveNowTitle(content) {
    const DOC_ID = state.currentDocumentId;
    setStatus("제목 저장 중…");

    if (content.length >= 1) {
        try {
            await APIS.updateDocument(DOC_ID, {
                title: content,
                content: noteEditor.value,
            });
        } catch (err) {
            console.error(err)
        }

    } else {
        try {
            await APIS.updateDocument(DOC_ID, {
                title: null,
            });
        } catch (err) {
            console.error(err)
        }

    }

    setTimeout(function () {
        setStatus("저장됨");
    }, DEBOUNCE_MS);
}

// 입력 핸들러 (textarea 영역 입력)
function onInputEditor(event) {
    var text = event.target.value;
    setStatus("저장 대기 중…");

    if (saveTimer) {
        clearTimeout(saveTimer);
    }

    saveTimer = setTimeout(function () {
        saveNowContent(text.trim());
    }, DEBOUNCE_MS);
}

// 입력 핸들러 (제목 영역 입력)
function onInputTitle(event) {
    var text = event.target.value;
    setStatus("저장 대기 중…");

    if (saveTimer) {
        clearTimeout(saveTimer);
    }

    saveTimer = setTimeout(function () {
        saveNowTitle(text.trim());
    }, DEBOUNCE_MS);
}


// 지우기 버튼 (TextArea 영역 초기화)
clearBtn.addEventListener("click", async () => {
    const DOC_ID = state.currentDocumentId;
    noteEditor.value = "";
    charCount.textContent = `${noteEditor.value.length}자`

    await APIS.updateDocument(DOC_ID, {
        content: noteEditor.value,
    });
});


// 편집기 부분 이벤트 추가 (자동 저장)
if (noteEditor) {
    noteEditor.addEventListener("keyup", onInputEditor);
}

// 편집기 부분 이벤트 추가 (텍스트 )
noteEditor.addEventListener("keyup", (ev) => {
    charCount.textContent = `${noteEditor.value.length}자`
})

if (editorTitle) {
    editorTitle.addEventListener("keyup", onInputTitle);
}
