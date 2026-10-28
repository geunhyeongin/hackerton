# 설명 가능한 웹 작업대
Node.js 22+만 필요. npm install과 build 없음.
~~~bash
node --test tests/*.test.mjs
node server.mjs
~~~
http://localhost:3000 또는 원격 IDE의 3000 포트 미리보기.
Bash: PORT=3001 node server.mjs / PowerShell: $env:PORT='3001'; node server.mjs
data/items.json에 저장. DATA_FILE로 별도 경로 선택. 실제 데이터는 커밋하지 않음.

## 기본 기능
등록·검색·상태 필터·완료/재개·삭제·전체 집계·JSON 추가 가져오기·전체 내보내기.
예제: examples/items.json (합성 데이터). 가져오기는 추가 방식, 같은 파일 재업로드는 중복.
1MB 요청/가져오기 1000건 제한. 제목 1~200자, 값 0~1조, 상태 open/done.
static allowlist로 public의 3개 파일만 제공. 인증은 없으며 단일 사용자 시험용.

## 수정 지도
- domain.mjs: 업무 필드·입력·판정·집계
- server.mjs: API 요청/응답 계약
- store.mjs: JSON 보존·직렬 쓰기
- public/index.html, app.js: 입력/목록/오류 표시
- modules/: CSV·점수·외부 호출, 필요할 때만 서버/화면에 연결

기본 함수/화면을 읽고 바꾸는 연습은 ../../guides/understand-the-code.md,
문제별 조합은 ../../guides/adaptation-recipes.md를 참고.

bootstrap으로 복사한 프로젝트에서는 가이드와 프롬프트가 ../hackathon-notes/guides 및 ../hackathon-notes/prompts에 함께 들어간다.
