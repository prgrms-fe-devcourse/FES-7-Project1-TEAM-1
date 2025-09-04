import APIS from "../modules/api.js"; // 경로는 실제 파일 위치에 맞게 수정
import { navigateTo } from "../modules/router.js";
import { state } from './explorer.js'

import { renderPage } from "../modules/router.js";

// 팀 이름 관리
const teamName = document.getElementById("teamName") // 팀 이름

// 사이드바 영역 변수
const sidebar = document.getElementById("sidebar"); // Side-Bar 영역
const sidebarNav = document.getElementById("sidebar-nav"); // Side-Bar 영역
const menuButton = document.getElementById("menuButton"); // Side-Bar 영역의 메뉴 버튼 ( Toggle )

// 메인 컨텐츠 영역 변수
const mainContent = document.getElementById("mainContent"); // 메인 컨텐츠 영역

// 사이드바 상태 관리 (false = 접힘, true = 펼침)
let sidebarOpen = true;

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


// 동적으로 받아온 Document 리스트 항목들에 대한 이벤트 추가
sidebarNav.addEventListener("click", async (e) => {
    // <div id="personal-page"> 안에 존재하는 add/delete 버튼 클릭은 제외
    if (e.target.closest("#addDocButton") || e.target.closest("#deleteDocButton")) {
        return; // 아래 코드 실행 안 함
    }

    const link = e.target.closest(".nav-link");
    if (!link) return; // nav-link가 아닌 곳 클릭 시 무시
    // e.preventDefault();

    // 모든 active 제거 후 현재 클릭한 것에 active 추가
    document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
    link.classList.add("active");

    state.currentDocumentId = link.id
    // console.log("index.js", state.currentDocumentId)
    if (state.currentDocumentId) {
        navigateTo(`/doc/${state.currentDocumentId}`, { docId: state.currentDocumentId });
    }
})

// 해당 페이지 접근 시 실행
document.addEventListener("DOMContentLoaded", async () => {
    try {

        // 팀 이름 부여 (사이드바 영역)
        teamName.innerText = `#1 ${APIS.getTeamName()} Notion`

        // 메뉴 버튼 Toggle 이벤트 리스너 추가
        // menuButton.addEventListener("click", toggleSidebar);

        const path = location.hash.slice(1) || ""; // #/doc/state.currentDocumentId 부분에서 # 제거
        renderPage(path, history.state || {});

    } catch (err) {
        console.error(err)
    }
});