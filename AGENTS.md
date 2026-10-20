# 코드 가이드라인

- 모든 함수 이름은 camelCase 가 아니라 **snake_case** 로 짓는다(예: `parse_age`, `to_csv`).
- 함수 안에서 `console.log` 를 쓰지 않는다 — 로깅은 `logger.info(...)` 만 허용한다.
- 숫자 문자열을 정수로 바꿀 때는 `parseInt` 에 항상 기수(radix)를 명시한다.
