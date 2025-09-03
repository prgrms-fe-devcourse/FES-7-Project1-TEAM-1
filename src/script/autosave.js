import APIS from "../modules/api.js";
import { state } from './explorer.js'


const editorTitle = document.getElementById("editor-title");
const noteEditor = document.getElementById("noteEditor"); // TextArea 영역

// let saveStatus = document.getElementById("saveStatus");

// 임시 기능 (전체 지우기는 유지, 저장 기능은 임시)
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn"); // TextArea 영역의 쓰레기통 Icon ( 기능적으로는 텍스트 초기화 )

let DEBOUNCE_MS = 300;
let saveTimer = null; //

// 상태 출력  (저장 상태 출력)
function setStatus(text) {
    console.log("[status]", text);
}

// 실제 저장 기능 담당 (자동 저장)
async function saveNowContent(content) {
    const DOC_ID = state.currentDocumentId;

    setStatus("내용 저장 중…");

    try {
        await APIS.updateDocument(DOC_ID, {
            content: content,
        });
    } catch (err) {
        console.error(err)
    }


    setTimeout(function () {
        setStatus("저장됨");
    }, DEBOUNCE_MS);
}

async function saveNowTitle(content) {
    const DOC_ID = state.currentDocumentId;

    setStatus("제목 저장 중…");

    try {
        await APIS.updateDocument(DOC_ID, {
            title: content,
        });
    } catch (err) {
        console.error(err)
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

if (noteEditor) {
    noteEditor.addEventListener("input", onInputEditor);
}
if (editorTitle) {
    editorTitle.addEventListener("input", onInputTitle);
}

// 지우기 버튼 (TextArea 영역 초기화)
clearBtn.addEventListener("click", async () => {
    const DOC_ID = state.currentDocumentId;
    noteEditor.value = "";

    await APIS.updateDocument(DOC_ID, {
        title: "제목",
        content: noteEditor.value,
    });
});

// // (임시) 해당 영역은 textarea 영역에 존재하는 내용을 가져오는 기능을 위해 도입
// saveBtn.addEventListener("click", async () => {
//     const DOC_ID = state.currentDocumentId;
//     console.log(`${noteEditor.value}`)

//     try {
//         await APIS.updateDocument(DOC_ID, {
//             "content": `${noteEditor.value.trim()}`
//         })
//     } catch (err) {
//         console.error(err)
//     }
// });
