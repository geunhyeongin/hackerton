# hackerton: 범용 작업 템플릿 (Codex용)

이 저장소에는 특정 문제의 답안이나 코드, 회사 자료가 없다. 에이전트 작업 규칙과 handoff 절차, 프롬프트 모음만 있다.

## 시험 시작 직후 순서 (Codex 실행 전에 할 것)

1. 클론
   git clone --depth 1 https://github.com/geunhyeongin/hackerton ~/h
2. 작업 폴더로 이동해서 복사
   cp ~/h/AGENTS.md ~/h/HANDOFF-RULES.md .
3. 스킬 폴더가 허용되면 (선택)
   mkdir -p .agents/skills && cp -r ~/h/skills/handoff .agents/skills/
4. codex 실행 후 /status 와 /skills 로 인식 확인
   AGENTS.md는 세션 시작 때 한 번 읽는다. 파일을 놓은 뒤에 codex를 켠다.

## 폴백

| 상황 | 대응 |
|---|---|
| 클론 불가 | 짧은 버전 프롬프트를 직접 타이핑 (prompts/0-typing-fallback.md 내용을 외워 둔다) |
| 홈 디렉터리/폴더 쓰기 불가 | 작업 폴더 루트에 AGENTS.md만 둔다 |
| 스킬이 인식되지 않음 | HANDOFF-RULES.md를 따르라고 AGENTS.md에 적혀 있으므로 그대로 진행 |
| 붙여넣기 불가 | URL만 직접 타이핑하고 나머지는 에이전트가 파일을 읽게 한다 |

## 파일

- AGENTS.md: 작업 규칙, 성공 기준 칸, 진행 단계, 제출 의식
- HANDOFF-RULES.md: handoff 절차와 HANDOFF.md 형식
- skills/handoff/SKILL.md: 같은 내용을 스킬 형식으로
- prompts/: 인터뷰, 합의문, 검증, 서술형 연습, 타이핑용 짧은 프롬프트

## 주의

- 이 저장소는 공개다. 문제 내용, 답안 코드, 회사 자료, 키와 토큰을 절대 넣지 않는다.
- 시험 중 Git Push는 불가능하다. 내용은 사전에 확정해 둔다.
