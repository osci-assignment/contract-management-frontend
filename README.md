# 계약 관리 백오피스 - 프론트엔드

React + MUI + Zustand + React Router 기반 백오피스 화면.

## 실행 방법

```bash
npm install
npm run dev
```

기본적으로 `http://localhost:5173`에서 뜨고, `/api` 요청은 `vite.config.js`의 proxy 설정으로
`http://localhost:8080`(Spring Boot 백엔드)로 전달됩니다. 백엔드 주소가 다르면
`vite.config.js`의 `server.proxy.target`을 수정하거나, `.env`에
`VITE_API_BASE_URL`을 설정하세요.

## 인증

- `accessToken`/`refreshToken`을 Zustand(`authStore`, `persist`)로 관리해 새로고침해도 로그인이 유지됩니다.
- API 응답이 `401`이면 `refreshToken`으로 자동 재발급을 한 번 시도한 뒤 원래 요청을 재시도합니다.
  재발급도 실패하면 로그아웃되어 `/login`으로 이동합니다.

## 페이지 구성

| 경로 | 설명 | 권한 |
|---|---|---|
| `/login` | 로그인 + 사용자/관리자 회원가입 (탭) | 공개 |
| `/users` | 회원 가입 승인 관리 (대기/승인/거절 탭) | ADMIN |
| `/contracts/upload` | 계약서 업로드 — 여러 파일 동시 업로드 가능 (OCR/LLM 추출) | ADMIN |
| `/contracts` | 계약서 목록 (상태별 탭, 업체/프로젝트 하이퍼링크, 5초 자동 갱신) | ADMIN |
| `/contracts/:id` | 계약서 상세 (업체/프로젝트 정보, 원본 파일 다운로드) | ADMIN |
| `/projects` | 프로젝트 목록 | ADMIN |
| `/projects/:id` | 프로젝트 상세 (업체 정보, 작업자 검색 배정/해제, 수정 모달) | 로그인 사용자 (단, 수정·배정 버튼은 ADMIN에게만 노출) |
| `/companies` | 업체 목록 (수정 모달) | ADMIN |
| `/companies/:id` | 업체 상세 (해당 업체의 프로젝트 목록) | ADMIN |
| `/workers` | 작업자 목록 (이름 검색) | ADMIN |
| `/workers/:id` | 작업자 상세 (배정 프로젝트 목록, 수정 모달) | ADMIN |
| `/my/profile` | 본인 작업자 프로필 등록/수정 | 로그인 사용자 |
| `/my/projects` | 본인에게 배정된 프로젝트 목록 | 로그인 사용자 |

## 시연 흐름 예시

1. `/login`에서 "관리자 가입" 탭으로 관리자 계정 생성 (즉시 승인됨)
2. "사용자 가입" 탭으로 일반 유저 계정 생성 (관리자 승인 대기 상태)
   - 또는 백엔드가 최초 기동 시 자동으로 만들어둔 시드 계정(`worker1~3@osci.com` / `password1234`)을 바로 써도 됩니다.
3. 관리자로 로그인 → `/users`에서 가입 신청한 유저 승인
4. `/contracts/upload`에서 저장소에 포함된 [샘플 계약서](../sample-contracts)를 업로드 →
   잠시 후 `/contracts`에서 OCR 처리 결과 확인 (업체/프로젝트 자동 생성됨)
5. 승인된 일반 유저로 로그인 → `/my/profile`에서 이름/직책/부서 등록
6. 관리자로 다시 로그인 → `/projects/:id`에서 이름으로 작업자 검색 후 배정
7. 작업자로 로그인 → `/my/projects`에서 배정된 프로젝트 확인, 클릭해서 상세까지 조회