import APIS from "../modules/api.js";

// 문서 로드되었을 때
document.addEventListener("DOMContentLoaded", async () => {
    try {
        let sidebar = document.querySelector(".sidebar-nav");
        const documentTitle = await APIS.getDocument();

        // 현재 팀 Document 항목들의 title 출력
        documentTitle.forEach(element => {
            console.log(element.title)
            const docNode = document.createElement("div");
            docNode.textContent = element.title;
            sidebar.appendChild(docNode);

        });
    } catch (err) {
        console.error(err)
    }

    // APIS.getSpecificDocument(155598)
    // console.log(APIS.getSpecificDocument(155598))
});

// 새 Document 생성
addButton.addEventListener("click", async() => {
    try {
    } catch (err) {
        console.error(err)
    }
});

// 폴더 접기/펼치기