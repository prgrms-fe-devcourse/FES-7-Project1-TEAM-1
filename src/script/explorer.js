import APIS from "../modules/api.js";

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
    if (doc.documents){
        for (const child of doc.documents) {
            this.deleteDocument_(child);
        }
    }    
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

async function render() {
    console.log("render()");
  try {
    let personal_page = document.querySelector("#personal-page");
    personal_page.innerHTML = "";
    // 현재 팀 Document 항목들의 title 출력
    appendNodes(personal_page, await dataModel.listRoots());
  } catch (err) {
    console.error(err);
  }
}

// 문서 로드되었을 때
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await dataModel.listRoots();
    render();
  } catch (err) {
    console.error(err);
  }
});

// 새 Document 생성
const addButton = document.querySelector("#addNode");
addButton.addEventListener("click", async () => {
    try {
        let personal_page = document.querySelector("#personal-page");
        const doc = await dataModel.createDocument();
        const newNode = createNode(doc);
        personal_page.appendChild(newNode);
        // 기존 Active 영역 제거 후 새로 추가된 노드에 Active 효과 부여
        document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
        newNode.classList.add("active");
        // 새로 추가된 부분을 바로 편질 할 수 있도록 ID 재할당
        state.currentDocumentId = doc.id
        console.log(state.currentDocumentId)
        await APIS.open(doc);
    } catch (err) {
        console.error(err)
    }
});

// 문서 보기, 문서 삭제, 하위 문서 추가, 이름 변경 이벤트 처리
let personal_page = document.querySelector("#personal-page");
personal_page.addEventListener("click", async (ev) => {
  try {
    if (ev.target.id == "addDocButton") {
        try {
            const doc = await dataModel.createDocument(ev.target.parentElement.parentElement.id);
            state.currentDocumentId = doc.id;
            const parentNode = ev.target.parentElement.parentElement.parentElement;
            parentNode.appendChild(createNode(doc));
            APIS.open(doc);
        } catch (err) {
            console.error(err);
        }
    } else if (ev.target.id == "deleteDocButton") {
      state.currentDocumentId = ev.target.parentElement.parentElement.id;
      let docId = state.currentDocumentId;
      await dataModel.deleteDocument(docId);
      await render();
    } else if (ev.target.tagName == "a") {
      state.currentDocumentId = ev.target.id;
      let docId = state.currentDocumentId;
      let doc = await dataModel.getDocument(docId);
      await APIS.open(doc);
    } else {
      state.currentDocumentId = ev.target.parentElement.id;
      let docId = state.currentDocumentId;
      let doc = await dataModel.getDocument(docId);
      await APIS.open(doc);
    }
  } catch (err) {
    console.error(err);
  }
});


// 편집기 상의 문서 제목 변경 시에 트리뷰에 실시간 반영
const editorTitle = document.querySelector("#editor-title");
editorTitle.addEventListener("keyup", (ev) => {
    console.log("keyup", editorTitle.value);
    console.log("스테이트", state.currentDocumentId);
    let docNode = document.getElementById(state.currentDocumentId);
    // docNode.value = editorTitle.value;
    console.log("ediotTitle", docNode.childNodes);
    docNode.childNodes[0].childNodes[0].nodeValue = editorTitle.value;
})



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
  div.textContent = doc.title;
  docNode.appendChild(div);
  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.setAttribute("id", "addDocButton");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "-";
  deleteButton.setAttribute("id", "deleteDocButton");
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
