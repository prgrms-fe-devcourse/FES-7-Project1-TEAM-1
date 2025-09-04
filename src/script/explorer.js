import APIS from "../modules/api.js";
import { renderPage, navigateTo, moveToLastDoc } from "../modules/router.js";

const headerTitle = document.getElementById("header-title");
const editorTitle = document.querySelector("#editor-title");

// 페이지 생성 버튼
const addButton = document.querySelector("#addNode");

// 사이드바 헤더 부분
const personal_page = document.querySelector("#personal-page");

// 입력 대시보드 영역 항목들
const editorCard = document.querySelector(".editor-card");
const noteEditor = document.getElementById("noteEditor");
const clearBtn = document.getElementById("clearBtn");

// 현재 접근중인 DocumentId 값을 관리하기 위한 변수
export const state = {
    currentDocumentId: null,
};

class DataModel {

    async listRoots() {
        let docList = await APIS.getDocument();
        console.log("listRoots", docList);
        return docList;
    }

    async deleteDocument(docId) {
        console.log("delete Doc()");
        let doc = await dataModel.getDocument(docId);
        await this.deleteDocument_(doc);

    }

    async deleteDocument_(doc) {
        if (!doc)
            return;
        if (doc.documents) {
            for (const child of doc.documents) {
                this.deleteDocument_(child);
            }
        }
        await APIS.deleteDocument(doc.id);
    }

    async createDocument(docId) {
        const doc = await APIS.addDocument({
            title: "새 페이지",
            content: "",
            parent: !docId ? null : docId,
        });
        return doc;
    }

    async updateDocument(doc) {
        const updatedDoc = await APIS.updateDocument(doc.id, doc);
        render();
        return updatedDoc;
    }

    async getDocument(docId) {
        return await APIS.getSpecificDocument(docId);
    }
}

let dataModel = new DataModel();
window.dataModel = dataModel;

function disabledInputArea() {
    if (!state.currentDocumentId) {
        editorCard.classList.add("disabled");
        clearBtn.classList.add("disabled");
        editorTitle.disabled = true;
        noteEditor.disabled = true;
        clearBtn.disabled = true;

        editorTitle.value = "";
        noteEditor.value = "";
        headerTitle.innerText = "";

    } else {
        editorCard.classList.remove("disabled");
        clearBtn.classList.remove("disabled");
        editorTitle.disabled = false;
        noteEditor.disabled = false;
        clearBtn.disabled = false;
    }
}

async function render() {
    // console.log("render()");
    try {
        let personal_page = document.querySelector("#personal-page");
        personal_page.innerHTML = "";
        // 현재 팀 Document 항목들의 title 출력
        appendNodes(personal_page, await dataModel.listRoots());

        // 만약 이미 선택된 Document가 있고 해당 항목에서 새로고침 했을 때
        // Render 과정을 통해 title 항목이 있을 경우 마지막으로 선택된 항목에 대한 active 효과 추가
        const docId = state.currentDocumentId
        console.log("DOC ID", docId)
        if (docId) {
            // console.log(document.querySelector(`a.nav-link[id="${docId}"]`))
            const currentDoc = document.querySelector(`a.nav-link[id="${docId}"]`);
            // console.log(currentDoc)
            // 삭제할 경우 없어진 항목에 대한 classList 생성 방지를 위해 조건문 선언
            if (currentDoc) {
                currentDoc.classList.add("active");
            }
        }

        disabledInputArea();

    } catch (err) {
        console.error(err);
    }
}


// 트리뷰가 갱신될 때마다 호출해야 하는 함수
/*
function updateList(doc) {
  console.log("updateList:", doc);
}
APIS.registerUpdate(updateList);
*/

function createNode(doc) {
    const ancestorDiv = document.createElement("div"); // 자손 노드 포함
    const docNode = document.createElement("a");
    ancestorDiv.appendChild(docNode);
    docNode.classList.add("nav-link");
    docNode.setAttribute("id", doc.id);
    const div = document.createElement("div");
    // div.textContent = doc.title;
    div.innerHTML = `<span style ="width: 70%; overflow: hidden; min-height: 28px; font-size:14px; align-content: center"> ${doc.title}</span>`
    docNode.appendChild(div);
    const addButton = document.createElement("button");
    // addButton.textContent = "+";
    addButton.id = "addDocButton";
    addButton.className = "icon-btn";
    addButton.innerHTML = `<img src="./src/svg/plus_icon.svg" alt="추가">`;
    const deleteButton = document.createElement("button");
    // deleteButton.textContent = "-";
    deleteButton.setAttribute("id", "deleteDocButton");
    deleteButton.setAttribute("class", "icon-btn");
    deleteButton.innerHTML = `<img src="./src/svg/minus_icon.svg" alt="삭제">`;
    div.appendChild(addButton);
    div.appendChild(deleteButton);

    return ancestorDiv;
}

function appendNodes(parentNode, docList) {
    if (!docList || docList.length == 0) {
        return;
    }
    for (const idx in docList) {
        let doc = docList[idx];
        const node = createNode(doc);
        appendNodes(node, doc.documents);
        parentNode.appendChild(node);
    }
}

// 폴더 접기/펼치기

// 문서 로드되었을 때
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // await dataModel.listRoots();
        render();
    } catch (err) {
        console.error(err);
    }
});

// 편집기 상의 문서 제목 변경 시에 트리뷰에 실시간 반영
editorTitle.addEventListener("keyup", (ev) => {
    console.log("keyup", editorTitle.value);
    console.log("스테이트", state.currentDocumentId);
    let docNode = document.getElementById(state.currentDocumentId);

    // docNode.value = editorTitle.value;
    // console.log("ediotTitle", docNode.childNodes);
    // docNode.childNodes[0].childNodes[0].childNodes[0].nodeValue = editorTitle.value;
    if (docNode) {
        const titleSpan = docNode.querySelector("span");
        if (titleSpan) {
            titleSpan.textContent = editorTitle.value;
        }
    }

    headerTitle.textContent = editorTitle.value;
})

// 문서 보기, 문서 삭제, 하위 문서 추가, 이름 변경 이벤트 처리
personal_page.addEventListener("click", async (ev) => {
    const addBtn = ev.target.closest("#addDocButton");
    const deleteBtn = ev.target.closest("#deleteDocButton");

    try {
        if (addBtn) {
            const parentElement = addBtn.closest("a.nav-link"); // 상위 a 찾기
            const parentId = parentElement.id;

            const document = await dataModel.createDocument(parentId);
            state.currentDocumentId = document.id;

            const parentNode = parentElement.parentElement; // a의 상위 div 선택
            parentNode.appendChild(createNode(document));

            APIS.open(document);

        } else if (deleteBtn) {
            const parentElement = deleteBtn.closest("a.nav-link");
            const docId = parentElement.id;

            await dataModel.deleteDocument(docId);
            state.currentDocumentId = null
            // 라우트 관리 (삭제)
            moveToLastDoc(docId)
            await render();
        }

    } catch (err) {
        console.error(err);
    }
});

// 새 Document 생성
addButton.addEventListener("click", async () => {
    try {
        let personal_page = document.querySelector("#personal-page");
        const doc = await dataModel.createDocument();
        const newNode = createNode(doc);
        personal_page.appendChild(newNode);
        // 기존 Active 영역 제거 후 새로 추가된 노드에 Active 효과 부여
        document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));

        // newNode.classList.add("active");
        // 새로 추가된 부분을 바로 편질 할 수 있도록 ID 재할당
        state.currentDocumentId = doc.id
        // console.log(state.currentDocumentId)

        const createDocNode = document.getElementById(state.currentDocumentId);
        // console.log(createDocNode)
        createDocNode.classList.add('active')
        // 사이드바 헤더 부분에 존재하는 추가 버튼 클릭 시 라우팅 업데이트
        // navigateTo(`/doc/${document.id}`, { docId: document.id });
        await APIS.open(doc);

    } catch (err) {
        console.error(err)
    }
});
