# /plugins가 안 될 때: 터미널에서 설치
확인일 2026-10-28. 로컬 Codex 0.164.0의 plugin --help에서 add/list/marketplace/remove 지원 확인.
현장 버전·계정·관리 정책·네트워크는 다르므로 현장에서 다시 확인한다.

## 1. 채팅 명령과 셸 명령 구분
Codex 채팅창: /plugins (복수형).
이 명령이 없거나 작동하지 않으면 Codex 서버 터미널을 닫지 말고 별도 Bash/PowerShell 탭을 연다.
아래는 모두 셸 명령이다. Claude Code의 /plugin install을 Codex에 그대로 보내지 않는다.

~~~bash
codex --version
codex plugin --help
codex plugin marketplace list --json
codex plugin list --available --json
node /path/to/h/scripts/install-plugins.mjs
~~~

목록에서 실제 name과 marketplaceName을 확인한 뒤 정확한 조합을 넣는다:
~~~bash
codex plugin add NAME@MARKETPLACE --json
# 또는 두 플러그인을 실제 목록의 식별자로 명시
node /path/to/h/scripts/install-plugins.mjs SUPERPOWERS_NAME@MARKETPLACE GSTACK_NAME@MARKETPLACE
codex plugin list --json
~~~
NAME 등의 대문자 값은 자리표시자이며 그대로 실행하지 않는다.
PATH에 codex가 없으면 which codex / Get-Command codex로 확인하거나 제공된 실행 파일 절대경로를 사용한다.
보조 스크립트에는 CODEX_BIN 환경변수로 실행 파일 경로를 전달할 수 있다.
설치 후 새 Codex 세션에서 스킬을 직접 요청하고 실제 인식 여부를 확인한다. 기존 세션의 종료 전 HANDOFF.md를 저장한다.

## 2. marketplace가 없는 경우
출처와 형식을 확인한 마켓플레이스만 추가한다. 일반 Git 저장소라고 마켓플레이스인 것은 아니다.
~~~bash
codex plugin marketplace add /path/to/prepared-marketplace --json
codex plugin list --available --json
~~~
Git 소스가 허용되면 공식 marketplace URL과 고정 ref를 확인한 뒤:
~~~bash
codex plugin marketplace add VERIFIED_GIT_URL --ref VERIFIED_REF --json
~~~
원본 Superpowers README의 Codex CLI 경로는 공식 마켓플레이스다.
gstack-workflows(Codex용 배포본)와 garrytan/gstack(원본 런타임)은 별개다. 같은 이름으로 간주하지 않는다.

## 3. plugin 하위 명령 자체가 없는 구버전
시험 중 무조건 업데이트하지 않는다. 환경 제공 도구를 우선하고 수동 스킬 경로로 진행한다.
사전에 검토한 Superpowers 패키지 전체(일치하는 LICENSE·skills·참조 파일 포함)를 준비한다.
~~~bash
node /path/to/h/scripts/copy-skills.mjs /path/to/superpowers /path/to/project superpowers
~~~
프로젝트 .agents/skills/superpowers 아래에 패키지 전체를 보존한다. 새 세션에서 하위 스킬 발견 여부 확인.
미발견 시 필요한 SKILL.md의 실제 경로를 직접 읽도록 요청한다.
스킬 문서 배치는 plugin/hooks/MCP/브라우저 런타임 설치와 같지 않다.
동일 기능의 플러그인과 수동 스킬을 중복 등록하지 않는다.

## 4. gstack 원본의 Codex 설치 경로 (선택)
사전 연습용이며 현장 필수 단계가 아니다. 네트워크와 Bun 등 의존성을 먼저 확인한다.
~~~bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/gstack
cd ~/gstack
# 실제 사용 버전은 사전에 검증한 commit/ref로 고정한다.
./setup --host codex
./setup --status
~~~
원본 README는 Codex를 experimental로 표시한다. Bash 명령이며 PowerShell에 그대로 넣지 않는다.
전체 런타임 설치가 막히면 이 툴킷의 디버깅·검증·인계 스킬로 진행한다.
브라우저 도구가 없으면 직접 Preview에서 수동 검증하고 결과를 기록한다.

## 5. 완전 오프라인/붙여넣기 불가
허용되는 방식으로 사전에 툴킷 파일과 검토한 패키지를 가져온다. .env/auth.json/개인 데이터를 묶지 않는다.
반입이나 Git clone이 금지되면 prompts/0-typing-fallback.md의 짧은 요청을 직접 입력한다.
API 키 구매·개인 계정 로그인·권한 해제부터 시도하지 말고 현장 제공 인증/도구를 따른다.

근거: [Codex CLI](https://learn.chatgpt.com/docs/cli/reference),
[Superpowers 원본](https://github.com/obra/superpowers),
[gstack 원본](https://github.com/garrytan/gstack).
실제 외부 설치는 여기서 실행하지 않았고 스크립트/절차를 준비했다.

## 이 툴킷에 포함한 오프라인 묶음
네트워크 없이 바로 쓸 수 있는 packages와 명령은 [offline/README.md](../offline/README.md)를 참조한다. 현장 설치 전에 snapshot-manifest.json의 버전과 LICENSE를 확인한다.
