import APIS from "../modules/api.js"; // 경로는 실제 파일 위치에 맞게 수정


const noteEditor = document.getElementById("noteEditor");
const charCount = document.querySelector(".char-count");
const clearBtn = document.getElementById("clearBtn");
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

// 임시 기능
const saveBtn = document.getElementById("saveBtn");

// 사이드바 상태 관리 (false = 접힘, true = 펼침)
let sidebarOpen = true;

// 노트 입력 이벤트
noteEditor.addEventListener("input", () => {
    // charCount.textContent = `${noteEditor.value.length}자`;
});

// 지우기 버튼
clearBtn.addEventListener("click", () => {
    noteEditor.value = "";
    // charCount.textContent = "0자";
});

// 해당 영역은 textarea 영역에 존재하는 내용을 가져오는 기능을 위해 임시 도입
saveBtn.addEventListener("click", async () => {
    console.log(`${noteEditor.value}`)

    try {
        const result = await APIS.updateDocument(155598,
            {
                "title": "제목 수정 123",
                "content": `${noteEditor.value.trim()}`
            }
        )
    } catch (err) {
        console.error(err)
    }
});


// 사이드바 토글
const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
        sidebar.classList.remove("collapsed");
        mainContent.classList.remove("sidebar-collapsed");
    } else {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("sidebar-collapsed");
    }

    // 접근성 속성 업데이트
    menuButton.setAttribute("aria-expanded", sidebarOpen.toString());
};

// 메뉴 버튼 클릭 시 실행
menuButton.addEventListener("click", toggleSidebar);


document.addEventListener("DOMContentLoaded", () => {
    APIS.getDocument();
    APIS.getSpecificDocument(155598)
    // console.log(APIS.getSpecificDocument(155598))
});