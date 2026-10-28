# 트러블슈팅
항상 원래 증상과 명령·출력·원인·수정·재검증을 VERIFICATION.md에 남긴다.

| 증상 | 진단 | 해결과 우회 |
|---|---|---|
| /plugins 없음 | 채팅창인지 셸인지, codex --version과 plugin --help | plugins.md의 CLI → 패키지 스킬 → 기본 프롬프트 순서 |
| 인증 반복/키 요구 | 현장 제공 인증·계정 정책 확인, 비밀값 출력 금지 | 개인 키를 가정하지 말고 제공 Codex 사용, 외부 API 없이 기본 흐름 구현 |
| clone 불가 | git --version, 네트워크/정책 메시지 | 사전 반입이 허용된 파일 사용, 금지면 짧은 프롬프트 직접 타이핑 |
| 서버 접속 실패 | 터미널 살아 있는지, GET /api/health | 0.0.0.0 바인딩, 지정 포트 미리보기 사용 |
| EADDRINUSE | 기존 서버 탭/포트 확인 | 기존 서버 사용 또는 PORT 변경. 모르는 프로세스 종료 금지 |
| API는 되는데 화면이 빈다 | 브라우저 콘솔/Network의 app.js와 API 응답 | 스크립트 문법·경로·응답 JSON 확인, 캐시 새로고침 |
| 앱이 사라졌다 | 제출 폴더와 현재 작업 경로 확인 | 올바른 디렉터리에서 실행, 실제 저장된 파일과 편집기 저장 상태 확인 |
| 한글/이모지 깨짐 | 파일 UTF-8 및 Content-Type 확인 | 코드 저장 UTF-8, 바디는 Buffer.concat 후 한 번에 디코딩 |
| JSON 가져오기 실패 | 배열 여부·필수 title·value 숫자·1MB/1000개 | examples/items.json으로 비교. 추가 가져오기라 중복 업로드 주의 |
| 저장 파일 손상 | data/items.json의 JSON과 배열 형식 확인 | 원본을 백업하고 복구. 자동 초기화로 데이터 삭제하지 않음 |
| 저장 권한 오류 | DATA_FILE의 상위 경로/권한·로그 코드 | 쓰기 가능한 실제 경로 사용 후 저장·재시작 확인 |
| 스킬 미인식 | 새 세션 여부·SKILL.md frontmatter·실제 경로 | 경로를 직접 읽게 하고 기본 AGENTS.md/프롬프트로 계속 |
| 붙여넣기에 문자 추가 | 입력한 짧은 문자열과 실제 파일 대조 | 파일 기반 프롬프트, 짧은 직접 입력, 실행 전 구문 검사 |
| 브라우저 도구 없음 | 사용 가능한 도구 확인 | Preview에서 수동 조작. HTTP 테스트만으로 화면 검증 완료라 하지 않음 |

~~~bash
# Bash: 다른 포트
PORT=3001 node server.mjs
# Bash: 임시 연습 데이터 경로
DATA_FILE=/tmp/h-practice/items.json node server.mjs
~~~
~~~powershell
$env:PORT = '3001'
$env:DATA_FILE = 'C:\temp\h-practice\items.json'
node server.mjs
~~~
네트워크 요청: 외부 모듈은 기본 5초 제한시간. fallback 데이터는 UI에 데모/대체임을 표시한다.
서버가 저장에 실패하면 성공 메시지를 보여주지 않는다.
