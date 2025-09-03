const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`;
import { renderPage, navigateTo } from "../modules/router.js";
import { state as appState } from '../script/explorer.js';

const headerTitle = document.getElementById('header-title');
const editorTitle = document.getElementById("editor-title");
const noteEditor = document.getElementById("noteEditor"); // TextArea 영역

// 입력 대시보드 영역 항목들
const editorCard = document.querySelector(".editor-card");
const clearBtn = document.getElementById("clearBtn");

const DEFAULT_HEADER = {
    "x-username": "strangers", // 팀 고유 헤더
    "Content-Type": "application/json",
};

const APIS = {
    getTeamName() {
        return DEFAULT_HEADER["x-username"];
    },
    // 전체 문서 조회
    async getDocument() {
        return fetch(BASE_URL, { headers: DEFAULT_HEADER })
            .then(async (res) => {
                if (!res.ok)
                    throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                const data = await res.json();
                // console.log(data);
                return data;
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
    },
    // 특정 문서 조회
    async getSpecificDocument(documentId) {
        return fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "GET",
        })
            .then(async (res) => {
                if (!res.ok)
                    throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                const data = await res.json();
                // console.log(data);
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 추가
    async addDocument(data) {
        return fetch(BASE_URL, {
            headers: DEFAULT_HEADER,
            method: "POST",
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                if (!res.ok)
                    throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                const data = await res.json();
                // console.log(data);
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 수정
    async updateDocument(documentId, data) {
        return fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "PUT",
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                if (!res.ok)
                    throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                const data = await res.json();
                // console.log(data);
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 삭제
    async deleteDocument(documentId) {
        console.log("apis.deleteDoc()")
        return fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "DELETE",
        })
            .then(async (res) => {
                if (!res.ok)
                    throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                const data = await res.json();
                console.log("delete", data);
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 해당 Document 접근 시 제목,내용 표시 부분
    async open(doc) {
        if (doc) {
            console.log(doc)
            editorCard.classList.remove("disabled");
            editorTitle.disabled = false;
            noteEditor.disabled = false;
            clearBtn.disabled = false;


            // 생성된 Document 제목 부분에 Focus 추가
            editorTitle.focus();
            // Focus 영역을 제일 앞 글자앞에 배치하도록 추가
            // editorTitle.setSelectionRange(0, 0);

            if (doc.id) {
                // 모든 active 제거 후 현재 클릭한 것에 active 추가
                document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
                const currentDoc = document.querySelector(`a.nav-link[id="${doc.id}"]`);
                if (currentDoc) {
                    appState.currentDocumentId = doc.id
                    currentDoc.classList.add("active");
                    // 라우팅 업데이트
                    navigateTo(`/doc/${doc.id}`, { docId: doc.id });

                    // 문서 로드
                    try {
                        const doc = await APIS.getSpecificDocument(appState.currentDocumentId);
                        console.log("api.open() 여기 먼데?", doc)
                        if (doc) {
                            headerTitle.textContent = `${doc.title}`;
                            editorTitle.value = doc.title ?? "";
                            noteEditor.value = doc.content ?? "";
                        }
                    } catch (err) {
                        console.error(err);
                        appState.currentDocumentId = null;
                        navigateTo("", {});  // 경로 초기화 + UI 초기화
                    }

                }
            }
        }
    },

    // (구현 예정 | API 재호출 목적)
    // 트리뷰가 갱신될 필요가 있을 때마다 호출
    notifyUpdate(doc) {
        APIS.updateCallback(doc);
    },
    registerUpdate(callback) {
        APIS.updateCallback = callback;
    },
};

export default APIS;
