
const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`

const DEFAULT_HEADER = {
    'x-username': 'strangers', // 팀 고유 헤더
    'Content-Type': 'application/json'
}

const APIS = {
    // 전체 문서 조회
    getDocument() {
        fetch(BASE_URL, { headers: DEFAULT_HEADER })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                return res.json().then((data) => {
                    console.log(data)
                })
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 특정 문서 조회
    getSpecificDocument(documentId) {
        fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "GET",
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                return res.json().then((data) => {
                    console.log(data)
                })
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 추가
    addDocument() {
        fetch(BASE_URL, { headers: DEFAULT_HEADER })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                return res.json().then((data) => {
                    console.log(data)
                })
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 수정
    updateDocument(documentId, data) {
        fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "PUT",
            body: JSON.stringify(data)
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                return res.json().then((data) => {
                    console.log(data)
                })
            })
            .catch((err) => {
                console.error(err);
            });
    },
    // 문서 삭제
    deleteDocument(documentId) {
        fetch(`${BASE_URL}/${documentId}`, {
            headers: DEFAULT_HEADER,
            method: "DELETE"
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ERROR ${res.status} - ${res.statusText}`);
                return res.json().then((data) => {
                    console.log(data)
                })
            })
            .catch((err) => {
                console.error(err);
            });
    },
}

export default APIS;