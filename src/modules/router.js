// router.js
import APIS from "../modules/api.js";
import { state as appState } from '../script/explorer.js';

const headerTitle = document.getElementById("header-title");
const editorTitle = document.getElementById("editor-title");
const noteEditor = document.getElementById("noteEditor");

// 입력 대시보드 영역 항목들
const clearBtn = document.getElementById("clearBtn");

// 페이지 생성 버튼
const addButton = document.querySelector("#addNode");

// 사이드바 헤더 부분
const personal_page = document.querySelector("#personal-page");

// 입력 대시보드 영역 항목들
const editorCard = document.querySelector(".editor-card");

// 최근 방문 문서 관리용 변수
const visitedDocArr = [];

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


export async function renderPage(path, routeState = {}) {

    const docId = routeState.docId ?? docIdFromPath(path) ?? appState.currentDocumentId;

    // if (path.startsWith("/doc/") && docId) {
    //     // 참조중인 Document 아이디 변경 (동기화 작업)
    //     appState.currentDocumentId = docId;

    //     // 사이드바 active 동기화
    //     document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
    //     const link = document.getElementById(String(docId));
    //     if (link) link.classList.add("active");
    // }

    if (path.startsWith("/doc/") && docId) {
        try {

            const previousDoc = Number(visitedDocArr[visitedDocArr.length - 1])
            // 방문 스택 업데이트
            if (previousDoc !== Number(docId)) {
                visitedDocArr.push(docId);
            }

            appState.currentDocumentId = docId;

            // active 표시
            document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            const link = document.getElementById(String(docId));
            if (link) link.classList.add("active");

        } catch (err) {
            console.error("문서 로드 실패:", err);
        }
    }

}

// 브라우저 뒤/앞으로 가기
window.addEventListener("popstate", (event) => {
    const norm = normalizePath(location.pathname); // '/index.html/doc/123' -> '/doc/123' 변환 작업
    renderPage(norm, event.state || {});
});


// URL 업데이트 시 발생하는 이벤트
window.addEventListener("hashchange", async () => {
    const path = location.hash.slice(1) || "";
    renderPage(path, history.state || {});

    // 디버깅용 출력
    console.log("뒤로가기/앞으로가기 발생:", appState.currentDocumentId);

    if (appState.currentDocumentId) {
        try {
            navigateTo(`/doc/${appState.currentDocumentId}`, { docId: appState.currentDocumentId });

            const doc = await APIS.getSpecificDocument(appState.currentDocumentId);
            console.log("index, 여기 먼데?", doc);

            if (doc) {
                headerTitle.textContent = `${doc.title}`;
                editorTitle.value = doc.title ?? "";
                noteEditor.value = doc.content ?? "";

                editorCard.classList.remove("disabled");
                editorTitle.disabled = false;
                noteEditor.disabled = false;
                clearBtn.disabled = false;
            } else {
                // 문서가 삭제가 되거나 없을 경우 참조 되는 Document, Route 초기화
                appState.currentDocumentId = null;
                headerTitle.textContent = "";
                editorTitle.value = "";
                noteEditor.value = "";

                navigateTo("", {});
            }
        } catch (err) {
            console.error("문서 로드 실패:", err);

            // 문서가 삭제가 되거나 없을 경우 참조 되는 Document, Route 초기화
            appState.currentDocumentId = null;
            headerTitle.textContent = "";
            editorTitle.value = "";
            noteEditor.value = "";

            navigateTo("", {});

        }
    }

});

// 삭제 후 이동 처리 함수
export function moveToLastDoc(docId) {
    const targetId = Number(docId);

    // 1. 모든 항목을 number로 통일
    for (let i = 0; i < visitedDocArr.length; i++) {
        visitedDocArr[i] = Number(visitedDocArr[i]);
    }

    // console.log(visitedDocArr, targetId)

    // 마지막 방문한 곳 확인
    const lastId = visitedDocArr[visitedDocArr.length - 1];

    if (lastId === targetId) {
        visitedDocArr.pop(); // 동일하면 제거
    }

    // 마지막으로 방문한 곳으로 이동
    const lastDocId = visitedDocArr.pop(); // 마지막 값 꺼내기
    if (lastDocId && lastDocId !== -1) {
        navigateTo(`/doc/${lastDocId}`, { docId: lastDocId });
    } else {
        // fallbackId가 없거나 -1이면 대시보드로 이동
        navigateTo("", {});
    }
}


// 새로고침 시 실행
document.addEventListener("DOMContentLoaded", () => {
    const path = location.hash.slice(1) || "";
    renderPage(path, history.state || {});

    console.log("페이지 새로고침:", appState.currentDocumentId);

    if (appState.currentDocumentId) {
        APIS.getSpecificDocument(appState.currentDocumentId)
            .then(doc => {
                if (doc) {
                    headerTitle.textContent = `${doc.title}`;
                    editorTitle.value = doc.title ?? "";
                    noteEditor.value = doc.content ?? "";

                    editorCard.classList.remove("disabled");
                    editorTitle.disabled = false;
                    noteEditor.disabled = false;
                    clearBtn.disabled = false;
                } else {
                    // 없는 문서 → 초기화
                    appState.currentDocumentId = null;
                    headerTitle.textContent = "";
                    editorTitle.value = "";
                    noteEditor.value = "";
                    navigateTo("", {});
                }
            })
            .catch(err => {
                console.error("문서 로드 실패:", err);
                appState.currentDocumentId = null;
                headerTitle.textContent = "";
                editorTitle.value = "";
                noteEditor.value = "";
                navigateTo("", {});
            });
    }
});
