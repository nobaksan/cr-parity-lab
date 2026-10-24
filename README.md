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

## User exports

Import the named helpers from `src/export-user.js`. Await `exportUser(db, name)`
to receive `{ rows, path }`: the resolved database rows and their JSON file path.
Each call creates a separate temporary directory. On POSIX, its mode is `0700`
and the file's mode is `0600`; Windows access controls depend on the temporary
directory's ACLs. The caller owns cleanup: remove the file and its containing
directory after consuming the export. Failed writes attempt to remove their
temporary directory. If deletion also fails, the rejection is an `AggregateError`
whose `errors` retain both failures, `cause` is the write failure, and `path` is
the export file path. The caller owns retrying cleanup of its containing directory.

Process termination can leave exports behind without returning a path or error.
Before production integration, the application owner must configure a private,
application-specific OS temporary directory, choose a retention limit, and arrange
recovery cleanup of abandoned `user-export-` directories. This helper has no
background cleanup service and cannot guarantee deletion after process termination.

`toCsv` preserves each row's property order, writes LF between records, quotes
fields containing commas, quotes, CR or LF, and doubles embedded quotes. Null and
undefined fields are empty. It does not add headers.

`parseAge` accepts decimal digit strings, allowing surrounding whitespace and
leading zeros. It throws `TypeError` for empty, malformed, negative, fractional,
or unsafe integer inputs. It does not impose an application-specific maximum age.

## 메모

초안 PR 실측용 문서 변경입니다.

## 수 연산 유틸리티

`src/probe7r6.js`는 숫자를 입력받는 다음 함수를 export합니다.

| 함수 | 동작 |
| --- | --- |
| `add_pair(a, b)` | 두 수의 합을 반환합니다. |
| `sub_pair(a, b)` | 첫 번째 수에서 두 번째 수를 뺀 값을 반환합니다. |
| `mul_pair(a, b)` | 두 수의 곱을 반환합니다. |
| `neg_one(a)` | 입력한 수의 부호를 반전한 값을 반환합니다. |
| `abs_one(a)` | 절댓값을 반환하며, `-0`은 `+0`으로 변환합니다. |
