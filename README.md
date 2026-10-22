# cr-parity-lab

CodeRabbit 리뷰 산출물을 채취하기 위한 연습용 저장소입니다. 의도적으로 결함이 들어간 PR 이 올라옵니다.

## Session configuration

Run the tests with Node.js 24 or later using `npm test`. No dependencies are required.

Configure `SESSION_SIGNING_SECRET` through the deployment's secret manager before
issuing or verifying tokens. Use a cryptographically random key containing at least
32 bytes; missing or shorter keys cause token operations to throw. There is no
default key. Rotating the key invalidates existing tokens. SHA-1 tokens from the
previous hardcoded key are rejected; users must log in again after upgrading.
`issueToken` accepts a nonnegative safe-integer user ID and a positive whole-second
TTL, and stores the expiry as an integer Unix timestamp.

`dumpSessions` is asynchronous: callers must await it. It writes a private temporary
file next to the destination, then atomically renames it into place. Supply a
trusted, application-controlled destination path; this library has no HTTP path
input or configured storage root. The destination directory must already exist.

## 메모

초안 PR 실측용 문서 변경입니다.

## Account helpers

`find_account(db, email)` takes a `Db` handle
and returns the first matching account or `null`. `transfer(db, fromId, toId,
amount)` takes a `TransactionalDb` handle and requires a finite positive amount.
Account IDs must be unique. Queries use `$1`/`$2` parameters and `UPDATE ... RETURNING`.

The caller supplies the database adapter, as with the user helpers.
`TransactionalDb.transaction` must give each callback one isolated transaction
connection, commit only when the callback succeeds, and roll back all writes
when it rejects (including commit failures). Its promise must settle only after
commit or rollback completes. Transfers check that each update returns exactly
one row and reject missing accounts, insufficient funds, a non-finite
destination balance, or an amount that rounds to no change in either balance.
The debit must decrease the source balance and the credit must increase the
destination balance. The credit update must return both `id` and numeric
`balance` so the latter can be checked before committing. The existing
`memoryDb` is a canned query-result fixture; it does not implement transactions.

## 수 연산 유틸리티

`src/probe7r6.js`는 숫자를 입력받는 다음 함수를 export합니다.

| 함수 | 동작 |
| --- | --- |
| `add_pair(a, b)` | 두 수의 합을 반환합니다. |
| `sub_pair(a, b)` | 첫 번째 수에서 두 번째 수를 뺀 값을 반환합니다. |
| `mul_pair(a, b)` | 두 수의 곱을 반환합니다. |
| `neg_one(a)` | 입력한 수의 부호를 반전한 값을 반환합니다. |
| `abs_one(a)` | 절댓값을 반환하며, `-0`은 `+0`으로 변환합니다. |
