import APIS from "../modules/api.js";

// 문서 로드되었을 때
document.addEventListener("DOMContentLoaded", async () => {
    try {
        let sidebar = document.querySelector(".sidebar-nav");
        const documentTitle = await APIS.getDocument();

        // 현재 팀 Document 항목들의 title 출력
        documentTitle.forEach(element => {
            console.log(element.title)
            const docNode = document.createElement("a");
            docNode.textContent = element.title;
            docNode.classList.add("nav-link");
            // docNode.classList.add("active");
            sidebar.appendChild(docNode);

        });
    } catch (err) {
        console.error(err)
    }

});

// 새 Document 생성
const addButton = document.querySelector("#addNode");
addButton.addEventListener("click", async() => {
    try {
        console.log("addButton");
        let sidebar = document.querySelector(".sidebar-nav");
        const data = await APIS.addDocument({
            "title": "문서3",
            "content": "문서3의 내용입니당",
            "parent": null
          })
        const docNode = document.createElement("a");
        docNode.textContent = data.title;
        docNode.classList.add("nav-link");
        
        sidebar.appendChild(docNode);
    } catch (err) {
        console.error(err)
    }
});

// 폴더 접기/펼치기