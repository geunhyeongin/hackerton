# 해커톤 현장 툴킷
플러그인 없이 시작할 수 있는 웹 소스와 작업 도구. 시험 자료·키·회사 데이터는 넣지 않는다.
로컬 폴더 이름은 문자 그대로 "~h"이며 현장에서 clone할 경로 "~/h"와 다르다.

## 시작
현장 규정과 지정 스택/기존 프로젝트를 먼저 확인한다. 아래 소스는 기본 선택지다.
공식 안내는 Cofa Probe와 과정·결과물·이해도 평가를 명시한다. 웹 앱 필수, 사전 코드 반입 허용, 작업 180분은 공식 확정 사실이 아니다.
전체 응시 일정: 2026-10-31 10:00~14:00, 09:40 준비. 실제 구현 마감은 현장 안내로 설정한다.

~~~bash
git clone --depth 1 https://github.com/geunhyeongin/hackerton ~/h
cd /실제/시험/작업폴더
node ~/h/scripts/doctor.mjs
node ~/h/scripts/bootstrap.mjs . --web
cd web-app
node --test tests/*.test.mjs
node server.mjs
~~~
위 GitHub 저장소에 최신 파일이 반영되었는지는 사전 확인한다. 이 로컬 변경은 자동 업로드되지 않는다.
기존 AGENTS.md나 같은 대상 파일이 있으면 bootstrap은 중단한다. 기존 규칙을 읽고 필요한 부분만 병합한다.
서버는 0.0.0.0:3000에서 실행된다. Probe의 포트 미리보기를 열고 서버 터미널을 유지한다.
다른 터미널에서 Codex를 시작한다. 새 스킬 인식에는 새 세션이 필요할 수 있다.

## 무엇을 준비했나
~~~text
AGENTS.md / HANDOFF-RULES.md       작업 규칙·인수인계
boilerplates/web-workbench/       바로 실행하는 웹 앱
  domain.mjs                     입력·판정·검색·집계 (첫 수정 위치)
  server.mjs / store.mjs          API·JSON 영속 저장
  public/                        순수 HTML·CSS·JS 화면
  modules/table.mjs               선택: CSV·가중 점수
  modules/external.mjs            선택: 제한시간·명시적 폴백
  tests/ / examples/              테스트·가상 데이터
scripts/                         진단·복사·CLI 설치·패키지 스킬 배치
templates/                       인터뷰·합의·추적·검증·인계 양식
prompts/                         단계별 요청과 이해도 평가
skills/                          현장 시작·디버깅·제출·handoff
guides/
  first-10-minutes.md             현장 체크
  plugins.md                     /plugins 실패 시 터미널 명령
  troubleshooting.md             증상별 복구
  adaptation-recipes.md          문제 유형별 재사용 지도
  understand-the-code.md         코드 읽기·설명·수정 연습
  mock-exam.md                   AI 없는 자가시험
  submission.md                  제출 점검
  sources.md                     근거·확정/가정 구분
~~~
## 범위
등록·검색·상태 변경·삭제·전체 JSON 내보내기·추가 가져오기·집계·재시작 후 보존을 지원한다.
CSV/외부 API/점수 모듈은 필요한 경우에만 연결한다. 기본 UI에 연결된 기능은 JSON 가져오기/내보내기다.
인증·멀티테넌트·대용량 DB·RAG·파일 업로드 프레임워크는 기본 소스에 없다.
아는 코드부터 가져가고, 문제와 무관한 기능은 제거한다. Python/React 등이 지정되면 해당 스택을 따른다.
[현장 시작](guides/first-10-minutes.md) · [플러그인](guides/plugins.md) · [재사용 지도](guides/adaptation-recipes.md) · [코드 이해](guides/understand-the-code.md)

## 오프라인 플러그인 대안
[오프라인 스킬 묶음](offline/README.md)에 Superpowers 7.0.1과 gstack-workflows 0.1.0의 라이선스·참조 파일을 포함했다. CLI 설치가 불가능할 때 수동 스킬 경로로 사용한다. 전체 런타임 설치와는 다르다.
