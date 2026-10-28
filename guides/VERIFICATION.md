# 툴킷 자체 검증 — 2026-10-28

환경: Windows, Node v24.22.1. 실제 시험 플랫폼은 아님.
- 도메인·CSV·점수·외부 호출·HTTP·복사 테스트 실행.
- 동시 등록 12건 보존, 가져오기 전체 검증, 재시작 후 보존, 정적 파일 허용 목록.
- 잘못된 JSON/초과 용량/출처/없는 ID/저장 손상/PATCH 검증.
- bootstrap 복사 앱 실행과 덮어쓰기 거부, 패키지 LICENSE 보존·인증 파일 제외.
- PowerShell 파이프 한글 손상을 발견하여 ASCII 이스케이프 전송/UTF-8 저장으로 수정. 한글 보존 회귀 검사 추가.

## 미검증과 제한
- 브라우저 호스트: The browser access host is unavailable. 실제 화면 클릭·배치·다운로드·파일 선택 미검증. submission.md의 수동 절차 필요.
- quick_validate.py: 현재 Python에 PyYAML 없음. 대신 새 스킬 frontmatter/name/description/미완성 표기를 별도 검사.
- 외부 플러그인 설치 자체는 미실행. 로컬 Codex plugin --help 지원만 확인.
- 인증·실제 외부 API·대용량·다중 서버·현장 규칙은 범위 밖.
- 저장 손상 테스트의 Storage/server failure 로그는 의도된 것.

## 최종 확인
10개 테스트 통과, 자체 프로젝트 파일 49개의 인코딩/JS 구문 확인, 오프라인 파일 233개의 SHA-256 일치. 브라우저 UI와 외부 설치는 위 제한대로 미검증.
