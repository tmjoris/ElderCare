# Elderly Care Application

An application to manage the medical histories and files of elderly people,
designed to be an intermediary used by multiple facilities.

[![Backend CI](https://github.com/tmjoris/ElderCare/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/tmjoris/ElderCare/actions/workflows/backend-ci.yml)

[Server documentation](./doc)
[Client documentation](./ElderCareClient/README.md)

## Backend

Spring Boot 3.3 on Java 21, PostgreSQL through JPA, stateless authentication
with signed tokens. Tests are written in Spock, and the repository layer is
exercised against a real PostgreSQL container rather than an in memory stand in.

### Layout

```
ElderCareServer/src/main/java/com/app4080/eldercareserver/
  config/      security filter chain, token issuing and verification, access tiers
  controller/  the HTTP layer
  service/     business rules, transaction boundaries
  repository/  Spring Data JPA interfaces
  entity/      JPA entities
  dto/         request and response shapes, kept separate from entities
```

### Running it

You need JDK 21 and a PostgreSQL database. The Gradle wrapper is committed, so
Gradle itself does not need to be installed.

```
cd ElderCareServer
./gradlew bootRun
```

Configuration is read from environment variables, with development defaults in
`application.properties`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | JDBC URL | `jdbc:postgresql://localhost:5432/eldercare` |
| `DATABASE_USER` | database user | `eldercare` |
| `DATABASE_PASSWORD` | database password | `eldercare` |
| `JWT_SECRET` | base64 signing key, at least 32 bytes decoded | a development only value |
| `JWT_VALIDITY_SECONDS` | token lifetime | `43200` |

Set `JWT_SECRET` in every deployed environment. The application refuses to start
if the decoded key is shorter than 32 bytes, which is the minimum HS256 accepts.

### Tests

```
./gradlew unitTest   # service and controller specs, no Docker needed
./gradlew test       # everything, including the PostgreSQL container specs
```

`unitTest` exists because the repository specs start a PostgreSQL container
through Testcontainers and so need a running Docker daemon. On a machine without
Docker, run `unitTest` locally and let CI run the full suite.

Coverage reports land in `build/reports/jacoco/test` after a full run.

## Security work

The authentication in the first version of this project did not work, in ways
worth writing down rather than quietly fixing.

Passwords were stored as the user typed them. `registerUser` wrote the raw
string to the database, with the note `// Remember to hash the password!` still
in the source, and `login` compared the submitted password using
`String.equals`. Passwords are now hashed with bcrypt and checked through
`PasswordEncoder.matches`. One of the specs registers two users who chose the
same password and asserts the stored values differ, which is what the per user
salt buys you.

Token issuing was decorative. `generateToken` called `Keys.secretKeyFor(HS256)`
inside the login handler, which minted a fresh random signing key on every
request. No token the server issued could be verified afterwards, including by
the server that issued it. Signing now happens in `JwtService` against one key
loaded from configuration. Two specs cover this directly: one asserts that a
second service instance holding the same secret accepts a token issued by the
first, and one asserts that an instance holding a different secret rejects it.

The same method set `issuedAt` to `new Date(expirationTime)`, where
`expirationTime` was a duration in milliseconds rather than a timestamp, so
every token claimed to have been issued twelve hours after the epoch.

Nothing checked tokens. There was no Spring Security dependency and no filter,
so every endpoint answered an anonymous caller, including the user search at
`/api/users/search/{term}`. There is now a filter chain, and registration and
login are the only routes open to an unauthenticated request.

Writing the controller specs turned up one more thing. Spring Security answers
an anonymous request to a protected route with 403 by default, which conflates
"you did not identify yourself" with "you are not allowed to do this". The chain
now installs an entry point that returns 401 for the first case and leaves 403
for the second.

### Other changes

The database moved from SQLite to PostgreSQL. A binary `debut.db` had been
committed under `src/main/resources` and is gone, along with the line in the
Dockerfile that copied it into the image.

The Dockerfile now builds the jar inside the image in a first stage and copies
only the jar into a JRE image, rather than depending on whatever happened to be
left in `build/libs` on the machine running the build. It also runs as a non
root user.

The Gradle wrapper is committed. It had been excluded by `.gitignore`, which
meant a new contributor had to guess the Gradle version, and the Spring Boot
3.3 plugin fails with an unhelpful resolution error on anything older than
Gradle 7.5. Because the wrapper jar is a binary that runs on every build, CI
validates its checksum against Gradle's published list before using it.

## Deployment

Both halves run on Render's free tier. `render.yaml` in the repository root
describes the database, the API and the static site, so the whole thing can be
recreated from the repository rather than from settings typed into a dashboard.

| Service | Type | Source |
| --- | --- | --- |
| `eldercare-db` | PostgreSQL | managed by Render |
| `eldercare-backend` | Docker web service | `ElderCareServer/dockerfile` |
| `eldercare-frontend` | static site | `ElderCareClient`, published from `dist` |

### How the two halves find each other

The frontend is built, not served, so `VITE_API_URL` is baked into the bundle at
build time. Changing it needs a redeploy, not a restart.

The backend allows exactly one browser origin, read from `ALLOWED_ORIGIN`. It
used to be hardcoded to the deployed frontend, which meant running the client
locally required editing the server. It now defaults to the Vite dev server.

### The database URL

Render exposes a database as a single variable shaped like
`postgres://user:password@host:port/database`. The PostgreSQL JDBC driver does
not accept that form. It wants `jdbc:postgresql://host:port/database` with the
credentials supplied separately, and given the URI as is it fails with a driver
error that never mentions the URL.

`DatabaseUrlEnvironmentPostProcessor` converts the URI before the connection
pool is built, adds `sslmode=require` when the URI carries no query string, and
ignores anything already beginning with `jdbc:`. Six specs cover it, including a
password containing a colon.

### Free tier behaviour worth knowing

A free web service is suspended after fifteen minutes without traffic, and the
next request pays for the container to start again. On this image that is
roughly thirty to fifty seconds, during which the browser is simply waiting. A
first login attempt that appears to hang is usually this rather than a fault.

Render also expires free PostgreSQL instances after a fixed period. When that
happens a new database has to be created and the environment updated, and
because the schema is created by Hibernate rather than by migrations, the
accounts in it are gone with it.

### Moving from SQLite

The API previously ran on SQLite, with the database file committed to the
repository at `src/main/resources/databases/debut.db` and copied into the image
by the Dockerfile. That file is no longer in the repository, and the Dockerfile
no longer refers to it.

Accounts do not survive the move. Anyone who had an account needs to register
again, which is unavoidable in any case: the passwords in the old file were
stored in plain text, and bcrypt cannot verify a password against one. Rather
than carrying that data forward, it is left behind.

## Known gaps

Role checks live in two places. The filter chain enforces coarse rules by route,
while the controllers still call `userService.validateRole` with a username read
from a request parameter. The second mechanism trusts its caller and should be
replaced by reading the authenticated principal from the security context.

`spring.jpa.hibernate.ddl-auto` defaults to `update`, which is convenient in
development and wrong for a deployment. A migration tool should own the schema
before this runs anywhere real.

## Frontend

```
cd ElderCareClient
npm install
npm start
```
