// router.js
import APIS from "../modules/api.js";
import { state as appState } from '../script/explorer.js';

const headerTitle = document.getElementById("header-title");
const editorTitle = document.getElementById("editor-title");
const noteEditor = document.getElementById("noteEditor");


function normalizePath(pathname) {
    return pathname.replace(/^\/?index\.html/, "") || "";
}

// URL에 있는 /doc/${id} 를 파싱 (popstate에서 state가 없을 때 대비)
function docIdFromPath(path) {
    const m = path.match(/\/doc\/(\d+)/);
    return m ? Number(m[1]) : null;
}

export function navigateTo(path, state = {}) {
    location.hash = path;
    renderPage(path, state);
}

// 초기 로드 + 해시 변경 감지
window.addEventListener("hashchange", () => {
    const path = location.hash.slice(1) || "";
    renderPage(path, history.state || {});
});

export async function renderPage(path, routeState = {}) {

    const docId = routeState.docId ?? docIdFromPath(path) ?? appState.currentDocumentId;

    if (path.startsWith("/doc/") && docId) {
        // 참조중인 Document 아이디 변경 (동기화 작업)
        appState.currentDocumentId = docId;

        // 사이드바 active 동기화
        document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
        const link = document.getElementById(String(docId));
        if (link) link.classList.add("active");
    }
}

// 브라우저 뒤/앞으로 가기
window.addEventListener("popstate", (event) => {
    const norm = normalizePath(location.pathname); // '/index.html/doc/123' -> '/doc/123' 변환 작업
    renderPage(norm, event.state || {});
});
