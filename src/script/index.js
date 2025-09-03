import APIS from "../modules/api.js"; // 경로는 실제 파일 위치에 맞게 수정

// 팀 이름 관리
const teamName = document.getElementById("teamName") // 팀 이름

// 사이드바 영역 변수
const sidebar = document.getElementById("sidebar"); // Side-Bar 영역
const sidebarNav = document.getElementById("sidebar-nav"); // Side-Bar 영역
const menuButton = document.getElementById("menuButton"); // Side-Bar 영역의 메뉴 버튼 ( Toggle )

// Textarea 영역 변수
const noteEditor = document.getElementById("noteEditor"); // TextArea 영역
const charCount = document.querySelector(".char-count"); // TextArea 영역의 글자 수 Count 변수
const clearBtn = document.getElementById("clearBtn"); // TextArea 영역의 쓰레기통 Icon ( 기능적으로는 텍스트 초기화 )

// 메인 컨텐츠 영역 변수
const mainContent = document.getElementById("mainContent"); // 메인 컨텐츠 영역

// 임시 기능
const saveBtn = document.getElementById("saveBtn");

// 사이드바 상태 관리 (false = 접힘, true = 펼침)
let sidebarOpen = true;

// 노트 입력 이벤트
noteEditor.addEventListener("input", () => {
    // charCount.textContent = `${noteEditor.value.length}자`;
});

// 지우기 버튼 (TextArea 영역 초기화)
clearBtn.addEventListener("click", () => {
    noteEditor.value = "";
    // charCount.textContent = "0자";
});

// 해당 영역은 textarea 영역에 존재하는 내용을 가져오는 기능을 위해 임시 도입
saveBtn.addEventListener("click", async () => {
    console.log(`${noteEditor.value}`)

    try {
        const result = await APIS.updateDocument(testDocumentId,
            {
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


document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 현재 팀 Document 데이터 안에 존재하는 모든 항목 출력
        const documentTitle = await APIS.getDocument();
        console.log(documentTitle)

        // 현재 팀 Document 항목들의 title 출력
        documentTitle.forEach(element => {
            console.log(element.title)
        });
    } catch (err) {
        console.error(err)
    }

    // APIS.getSpecificDocument(155598)
    // console.log(APIS.getSpecificDocument(155598))
});