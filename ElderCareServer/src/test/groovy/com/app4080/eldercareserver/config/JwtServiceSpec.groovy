package com.app4080.eldercareserver.config

import spock.lang.Specification
import spock.lang.Subject

/**
 * The previous implementation generated a new random signing key inside the
 * login handler, so no token it issued could ever be verified. These specs pin
 * the behaviour that replaced it.
 */
class JwtServiceSpec extends Specification {

    static final String SECRET = 'dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLTEyMzQ1Njc4'

    @Subject
    JwtService jwtService = new JwtService(SECRET, 3600L)

    def "issues a token that it can verify itself"() {
        when:
        def token = jwtService.generateToken('nurse.jane', 'nurse')

        then:
        jwtService.isValid(token)
        jwtService.extractUsername(token) == 'nurse.jane'
        jwtService.extractRole(token) == 'nurse'
    }

    def "a second service holding the same secret verifies the first service's token"() {
        given: "a token issued by one instance"
        def token = jwtService.generateToken('dr.who', 'doctor')

        and: "a separate instance configured with the same secret"
        def otherInstance = new JwtService(SECRET, 3600L)

        expect: "the token survives the instance boundary"
        otherInstance.isValid(token)
        otherInstance.extractUsername(token) == 'dr.who'
    }

    def "a service holding a different secret rejects the token"() {
        given:
        def token = jwtService.generateToken('dr.who', 'doctor')
        def attacker = new JwtService(
                'YW4tZW50aXJlbHktZGlmZmVyZW50LXNlY3JldC1rZXktMTIzNDU2Nzg5', 3600L)

        expect:
        !attacker.isValid(token)
    }

    def "rejects a token whose payload has been tampered with"() {
        given:
        def token = jwtService.generateToken('nurse.jane', 'nurse')
        def parts = token.split('\\.')
        def forgedPayload = Base64.urlEncoder.withoutPadding().encodeToString(
                '{"sub":"nurse.jane","role":"doctor"}'.bytes)
        def forged = "${parts[0]}.${forgedPayload}.${parts[2]}"

        expect: "the signature no longer matches the escalated role"
        !jwtService.isValid(forged)
    }

    def "rejects a token that has expired"() {
        given: "a service that issues already expired tokens"
        def expiring = new JwtService(SECRET, -60L)

        when:
        def token = expiring.generateToken('nurse.jane', 'nurse')

        then:
        !expiring.isValid(token)
    }

    def "rejects malformed input rather than throwing"() {
        expect:
        !jwtService.isValid(candidate)

        where:
        candidate << ['', 'not-a-token', 'a.b.c', 'Bearer something']
    }

    def "refuses to start when the configured secret is too short for HS256"() {
        when: "the decoded key is under 32 bytes"
        new JwtService('c2hvcnQ=', 3600L)

        then:
        def e = thrown(IllegalStateException)
        e.message.contains('32 bytes')
    }

    def "sets issuedAt to now rather than to the epoch"() {
        when:
        def token = jwtService.generateToken('nurse.jane', 'nurse')
        def payload = new String(Base64.urlDecoder.decode(token.split('\\.')[1]))
        def issuedAt = (payload =~ /"iat":(\d+)/)[0][1] as long

        then: "the original code passed the duration as the issue date, landing in 1970"
        issuedAt > (System.currentTimeMillis() / 1000) - 60
    }
}
