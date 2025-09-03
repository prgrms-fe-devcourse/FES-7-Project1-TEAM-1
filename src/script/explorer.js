import APIS from "../modules/api.js";

// 

class DataModel {
    #docList;
    
    async listRoots() {
        this.#docList = await APIS.getDocument();
        console.log("독리스트", this.#docList);
    }

    async deleteDocument(docId) {
        for (const idx in this.#docList) {
            if (this.#docList[idx].id == docId) {
                delete this.#docList[idx];
            }
        }
        await APIS.deleteDocument(docId);
    }
    async createDocument() {
        const doc = await APIS.addDocument({
            "title": "새 페이지",
            "content": "",
            "parent": null
          })
          this.#docList.push(doc);
        return doc;
    }

    async updateDocument(doc) {
        const updatedDoc = await APIS.updateDocument(doc.id, doc);
        await this.listRoots();
        render();
        return updatedDoc;
    }

    forEachRoot(func) {
        this.#docList.forEach(func);
    }

    getDocument(docId) {
        return APIS.getSpecificDocument(docId);
    }
};

let dataModel = new DataModel();

function render() {
    try {
        let personal_page = document.querySelector("#personal-page");
        personal_page.innerHTML = "";
        // 현재 팀 Document 항목들의 title 출력
        dataModel.forEachRoot(doc => {
            personal_page.appendChild(createNode(doc));

        });
    } catch (err) {
        console.error(err)
    }
}

// 문서 로드되었을 때
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataModel.listRoots();
        render();
    } catch (err) {
        console.error(err)
    }

});

// 새 Document 생성
const addButton = document.querySelector("#addNode");
addButton.addEventListener("click", async () => {
    try {
        let personal_page = document.querySelector("#personal-page");
        const doc = await dataModel.createDocument();
        personal_page.appendChild(createNode(doc));
        APIS.open(doc);
    } catch (err) {
        console.error(err)
    }
});


// 문서 보기, 문서 삭제, 하위 문서 추가, 이름 변경 이벤트 처리
let personal_page = document.querySelector("#personal-page");
personal_page.addEventListener("click", async (ev) => {
    try {
        // console.log(ev.target.parentElement.innerText);
        // console.log(ev.target.parentElement.id);
        // console.log("아이디", ev.target.id);
        if (ev.target.id === "addDocButton") {

        } else if (ev.target.id === "deleteDocButton") {
            let docId = ev.target.parentElement.id;
            await dataModel.deleteDocument(docId);
            render();
        } else {
            let docId = ev.target.id;
            let doc = await dataModel.getDocument(docId);
            APIS.open(doc);
        }
    } catch (err) {
        console.error(err)
    }
});

// 트리뷰가 갱신될 때마다 호출해야 하는 함수
function updateList(doc) {
    console.log("updateList:", doc);
}

APIS.registerUpdate(updateList);

function createNode(doc) {
    const docNode = document.createElement("a");
    docNode.classList.add("nav-link");
    const div = document.createElement("div");
    div.textContent = doc.title;
    div.setAttribute("id", doc.id);
    docNode.appendChild(div);
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.setAttribute("id", "addDocButton");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.setAttribute("id", "deleteDocButton");
    div.appendChild(addButton);
    div.appendChild(deleteButton);

    return docNode;
}

// 폴더 접기/펼치기