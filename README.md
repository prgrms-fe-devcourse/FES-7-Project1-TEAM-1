# FE6기 7회차 1팀 Stranger

👨‍💻 팀원

- 김수연
- 이상엽
- 한성수

---

## 📌 코드 컨벤션

- 변수, 함수: `camelCase` (카멜 케이스)
- 클래스: `PascalCase` (파스칼 케이스)

---

## 📂 프로젝트 구조

```bash
project-root/
├─ .vscode/
│  └─ settings.json
├─ src/
│  ├─ modules/
│  │  └─ api.js
│  ├─ pages/
│  │  └─ dashboard.html
│  ├─ script/
│  │  └─ index.js
│  └─ style/
│     └─ main.css
├─ .gitignore
├─ CONTRIBUTING.md
├─ index.html
└─ README.md

```

---

## 📃 API 헤더 설정

```javascript
// API Header 영역에서 공통적으로 들어갈 사항
x-username: strangers, // 팀 고유 헤더
Content-Type: application/json
```

---

## 커밋 메시지 규칙

```plaintext
- [FEATURE]: 새로운 기능 추가 위주 작업 (feature)
- [FIX]: 버그 수정 위주 작업
- [DOCS]: 문서 수정 (README.md 등)
- [STYLE]: 코드 포맷팅이나 코드의 시각적 요소 수정 위주 작업
- [REFACT]: 코드 리팩토링 위주 작업
```
