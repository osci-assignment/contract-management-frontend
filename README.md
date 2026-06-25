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

## 페이지 구성

| 경로 | 설명 | 권한 |
|---|---|---|
| `/login` | 로그인 + 사용자/관리자 회원가입 (탭) | 공개 |
| `/contracts/upload` | 계약서 업로드 (OCR/LLM 추출) | ADMIN |
| `/contracts` | 계약서 목록 (업체/프로젝트 하이퍼링크) | ADMIN |
| `/contracts/:id` | 계약서 상세 (업체/프로젝트 정보) | ADMIN |
| `/projects` | 프로젝트 목록 | ADMIN |
| `/projects/:id` | 프로젝트 상세 (업체 정보, 작업자 배정/해제, 수정 모달) | ADMIN |
| `/companies` | 업체 목록 (수정 모달) | ADMIN |
| `/workers` | 작업자 목록 | ADMIN |
| `/workers/:id` | 작업자 상세 (배정 프로젝트 목록, 수정 모달) | ADMIN |
| `/my/profile` | 본인 작업자 프로필 등록/수정 | 로그인 사용자 |
| `/my/projects` | 본인에게 배정된 프로젝트 목록 | 로그인 사용자 |

## 시연 흐름 예시

1. `/login`에서 "관리자 가입" 탭으로 관리자 계정 생성 (즉시 승인됨)
2. "사용자 가입" 탭으로 일반 유저 계정 생성 (관리자 승인 대기 상태)
3. 관리자로 로그인 → 계약서 업로드 → 잠시 후 계약서 목록에서 OCR 처리 결과 확인
   (업체/프로젝트 자동 생성됨)
4. (참고) 가입한 일반 유저 승인은 현재 백엔드에 목록 조회 API가 없어 Postman 등으로
   `POST /api/v1/users/{userId}/approve` 직접 호출이 필요합니다.
5. 승인된 일반 유저로 로그인 → `/my/profile`에서 이름/직책/부서 등록
6. 관리자로 다시 로그인 → `/workers`에서 작업자 ID 확인 → 프로젝트 상세 화면에서
   해당 ID로 배정
7. 작업자로 로그인 → `/my/projects`에서 배정된 프로젝트 확인
