const BASE_URL = `https://kdt-api.fe.dev-cos.com/documents`;

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
    return fetch(`${BASE_URL}/${documentId}`, {
      headers: DEFAULT_HEADER,
      method: "DELETE",
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
  open(doc) {
    const title = document.querySelector("#editor-title");
    title.innerText = doc.title ?? "";

    const noteEditor = document.querySelector("#noteEditor");
    noteEditor.value = doc.content ?? "";
  },
  // 트리뷰가 갱신될 필요가 있을 때마다 호출
  notifyUpdate(doc) {
    APIS.updateCallback(doc);
  },
  registerUpdate(callback) {
    APIS.updateCallback = callback;
  },
};

export default APIS;
