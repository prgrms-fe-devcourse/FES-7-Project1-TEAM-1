const noteEditor = document.getElementById("noteEditor");
const charCount = document.querySelector(".char-count");
const clearBtn = document.getElementById("clearBtn");
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

// 사이드바 상태 관리 (false = 접힘, true = 펼침)
let sidebarOpen = true;

// 노트 입력 이벤트
noteEditor.addEventListener("input", () => {
    charCount.textContent = `${noteEditor.value.length}자`;
});

// 지우기 버튼
clearBtn.addEventListener("click", () => {
    noteEditor.value = "";
    charCount.textContent = "0자";
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
