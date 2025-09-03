import APIS from "../modules/api.js";

let noteEditor = document.getElementById("noteEditor");
// let saveStatus = document.getElementById("saveStatus");

// 임시 기능 (전체 지우기는 유지, 저장 기능은 임시)
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn"); // TextArea 영역의 쓰레기통 Icon ( 기능적으로는 텍스트 초기화 )

let DOC_ID = 156086;
let DEBOUNCE_MS = 500;
let saveTimer = null; //

// 상태 출력  (저장 상태 출력)
function setStatus(text) {
    console.log("[status]", text);
}

// 실제 저장 기능 담당 (자동 저장)
async function saveNow(content) {
    setStatus("저장 중…");

    try {
        await APIS.updateDocument(DOC_ID, {
            title: "제목",
            content: content,
        });
    } catch (err) {
        console.error(err)
    }


    setTimeout(function () {
        setStatus("저장됨");
    }, DEBOUNCE_MS);
}

// 입력 핸들러 (textarea 영역 입력)
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

// 지우기 버튼 (TextArea 영역 초기화)
clearBtn.addEventListener("click", async () => {
    noteEditor.value = "";

    await APIS.updateDocument(DOC_ID, {
        title: "제목",
        content: noteEditor.value,
    });
});

// (임시) 해당 영역은 textarea 영역에 존재하는 내용을 가져오는 기능을 위해 도입
saveBtn.addEventListener("click", async () => {
    console.log(`${noteEditor.value}`)

    try {
        await APIS.updateDocument(DOC_ID, {
            "content": `${noteEditor.value.trim()}`
        })
    } catch (err) {
        console.error(err)
    }
});
