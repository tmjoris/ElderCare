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

## Security

Passwords are hashed with bcrypt and verified through `PasswordEncoder.matches`.
One spec registers two users who chose the same password and asserts the stored
values differ, which is what the per user salt buys you.

Tokens are signed in `JwtService` against a single key loaded from
configuration, and the application refuses to start if that key decodes to fewer
than 32 bytes. Two specs pin the property that matters: a second instance
holding the same secret accepts a token issued by the first, and an instance
holding a different secret rejects it.

A `SecurityFilterChain` validates the bearer token on every request.
Registration and login are the only routes open to an unauthenticated caller.
An anonymous request gets 401 and an authenticated one without the right role
gets 403, rather than collapsing both into 403 as Spring Security does by
default.

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
build time. Changing it needs a redeploy, not a restart. The live value is the
backend's own onrender.com hostname, and it is worth checking the built bundle
after changing it, because a wrong value fails exactly like a missing one.

The backend allows one browser origin, read from `ALLOWED_ORIGIN`, defaulting to
the Vite dev server so a local frontend needs no extra configuration.

### Environment variables on the API

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | linked to the `eldercare-db` instance, internal URL |
| `JWT_SECRET` | a 48 byte random value, base64 encoded |
| `ALLOWED_ORIGIN` | the deployed frontend origin |

Render's dashboard offers a Datastore URL option when adding a variable, which
links the database rather than copying its password into a second place.

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
next request pays for the container to start again. That is roughly thirty to
fifty seconds, during which the browser simply waits. A first login attempt that
appears to hang is usually this rather than a fault.

Render expires free PostgreSQL instances thirty days after creation. This one
was created on 13 September 2026, so it lapses in mid October. A new database
then has to be created and `DATABASE_URL` relinked, and because Hibernate
creates the schema rather than a migration tool, the accounts go with it.

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
