# CodexClaw 해커톤 현장 가이드

CodexClaw가 제공된 환경에서 요구사항 정리부터 시연 점검까지 활용하는 빠른 안내다. 현장 규정과 지정 도구가 우선이며, 플러그인 설치나 인터넷 사용이 허용되는지 확인한다. 스킬이 없어도 아래 자연어 요청으로 같은 목적을 진행할 수 있다.

## 시작 전

Codex에서 사용 가능한 스킬 목록에 `codexclaw`가 있는지 확인한다. 환경마다 설치 여부와 버전이 다르며 이 툴킷이 CodexClaw를 제공한다고 가정하지 않는다. 목록에 없다면 설치에 시간을 쓰기 전에 현장 규정을 확인하고 자연어 요청으로 진행한다. 개인 API 키나 실제 업무 데이터를 임의로 입력하지 않는다.

스킬 이름을 지정할 때는 예를 들어 `$codexclaw:cxc-interview`처럼 사용한다. 목록에 없는 이름은 해당 환경에서 호출할 수 없으므로 비슷한 목적을 자연어로 요청한다.

## 현장 흐름

| 순서 | 스킬 | 복사해서 쓸 요청 |
|---|---|---|
| 문제 정리 | `cxc-interview` | `$codexclaw:cxc-interview 사용자, 해결할 문제, 제약, 성공 기준을 확인하고 MVP 범위를 좁혀줘.` |
| 구현 계획 | `cxc-pabcd` | `$codexclaw:cxc-pabcd 남은 시간에 맞춰 시연 가능한 최소 흐름과 검증 순서를 정리해줘.` |
| 기능 구현 | `cxc-dev` | `$codexclaw:cxc-dev 기존 코드를 확인하고 합의한 핵심 흐름을 작게 구현한 뒤 실행 결과를 보여줘.` |
| 오류 해결 | `cxc-dev-debugging` | `$codexclaw:cxc-dev-debugging 이 오류를 재현하고 원인을 확인한 다음 수정과 검증을 해줘.` |
| 시연 점검 | `cxc-qa` | `$codexclaw:cxc-qa 발표 시나리오대로 실제 화면을 실행하고 실패 지점과 근거를 알려줘.` |
| 제출 전 검토 | `cxc-dev-code-reviewer` | `$codexclaw:cxc-dev-code-reviewer 시연 실패, 데이터 손실, 설명하기 어려운 부분을 중심으로 검토해줘.` |

처음에는 입력 → 처리 → 결과가 이어지는 한 가지 흐름을 완성한다. 남은 시간과 현장 공지에 맞춰 기능 동결과 제출 시간을 정하고, 발표자가 직접 실행과 코드 설명을 연습한다.

## 상황별 선택

| 상황 | 스킬 | 활용 |
|---|---|---|
| 낯선 코드 | `cxc-repo-map` | 구조와 주요 코드 위치 파악 |
| 새 프로젝트 | `cxc-dev-scaffolding` | 기존 규칙을 확인하고 뼈대 구성 |
| 화면 구현 | `cxc-dev-frontend` | 화면, 반응형, 접근성 구현 |
| 화면 구성 | `cxc-dev-uiux-design` | 정보 배치와 사용 흐름 개선 |
| 서버와 API | `cxc-dev-backend` | API, 데이터 접근과 오류 처리 |
| 데이터 처리 | `cxc-dev-data` | 데이터 변환과 품질 검증 |
| 테스트 | `cxc-dev-testing` | 핵심 흐름과 회귀 테스트 |
| 배포 | `cxc-dev-devops` | 실행 환경, 컨테이너와 배포 점검 |
| 보안 | `cxc-dev-security` | 인증, 입력과 비밀정보 점검 |
| 의존성 문제 | `cxc-dev-architecture` | 모듈 경계와 순환 참조 확인 |
| 자료 조사 | `cxc-search` | 최신 문서와 근거 확인 |
| 발표 자료 | `cxc-dev-visualizer`, `cxc-kwrite` | 시각 설명과 한국어 문장 다듬기 |
| 이전 대화 | `cxc-recall` | 이전 결정과 작업 맥락 검색 |
| 큰 작업 지속 | `cxc-loop` | 범위와 종료 조건을 정해 여러 단계 진행 |
| 구조 기반 코드 검색 | `cxc-ast-grep` | 코드 구조를 기준으로 검색·변경 |
| 작업 공간 관리 | `cxc-worktree-guardian` | 워크트리 상태 확인 |
| 메신저 연결 | `cxc-remote` | 허용된 환경에서 원격 연결 설정 |
| 병렬 웹 탐색 | `cxc-lunasearch` | 사용 가능한 환경에서 병렬 자료 탐색 |

위 목록은 설치 버전에 따라 달라질 수 있다. `cxc-goalplan`, `cxc-orchestrate`, `cxc-skill-hub`, `cxc-dev-diagram-viewer`는 이 가이드 작성 시점에 대체 대상으로 표시되어 각각 `cxc-loop`, `cxc-pabcd`, `cxc-dev`, `cxc-dev-visualizer`를 사용한다.

## 스킬이 없을 때

스킬 이름을 빼고 목적과 완료 조건을 구체적으로 적는다. 예: “핵심 사용자와 성공 기준을 질문으로 확인하고, 1개 시연 흐름으로 범위를 줄여줘.” 또는 “발표 순서대로 브라우저에서 실행하고 실패 화면과 재현 방법을 기록해줘.”

마지막에는 [제출 점검](submission.md)과 [코드 이해 연습](understand-the-code.md)을 확인한다. AI가 만든 결과도 실제 실행 결과와 본인의 설명으로 검증한다.
