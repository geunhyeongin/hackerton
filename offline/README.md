# 오프라인 스킬 패키지
검토한 로컬 Codex 배포 캐시의 문서·스킬·참조·라이선스를 보존한 스냅샷.
네트워크 없이 아래 명령으로 배치할 수 있다. 사전 반입 허용 여부는 현장 공지를 따른다.

~~~bash
node /path/to/h/scripts/copy-skills.mjs /path/to/h/offline/packages/superpowers /path/to/project superpowers
node /path/to/h/scripts/copy-skills.mjs /path/to/h/offline/packages/gstack-workflows /path/to/project gstack-workflows
~~~

새 세션에서 필요한 스킬의 인식을 확인한다. 미인식 시 실제 SKILL.md 경로를 직접 읽게 한다.
플러그인이 정상 설치된 경우 같은 패키지를 다시 배치하지 않는다.
이 경로는 instruction-only다. hooks/MCP/gstack 원본 브라우저 런타임 설치를 보장하지 않는다.
Superpowers 7.0.1, gstack-workflows 0.1.0을 포함한다. 원본 gstack와 배포본은 구분한다.
각 패키지 LICENSE와 gstack THIRD_PARTY_NOTICES.md/UPSTREAM.md를 보존했다.
snapshot-manifest.json은 각 파일 SHA-256과 버전을 기록한다. 자동 업데이트하지 않는다.
