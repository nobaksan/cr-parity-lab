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
Each call creates a separate private temporary directory and a file with mode
`0600`. The caller owns cleanup: remove the file and its containing directory
after consuming the export. Failed writes remove their temporary directory.

`parseAge` accepts decimal digit strings, allowing surrounding whitespace and
leading zeros. It throws `TypeError` for empty, malformed, negative, fractional,
or unsafe integer inputs. It does not impose an application-specific maximum age.

## 메모

초안 PR 실측용 문서 변경입니다.
