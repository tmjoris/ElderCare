package com.app4080.eldercareserver.config

import spock.lang.Specification

/**
 * Render hands the database over as a postgres:// URI, which the JDBC driver
 * rejects. These specs pin the conversion, because getting it wrong produces a
 * deploy failure whose error message does not mention the URL at all.
 */
class DatabaseUrlEnvironmentPostProcessorSpec extends Specification {

    def "converts a Render style URI into a JDBC url with credentials split out"() {
        when:
        def result = DatabaseUrlEnvironmentPostProcessor.convert(
                'postgres://eldercare:s3cret@dpg-abc123-a.oregon-postgres.render.com:5432/eldercare_db')

        then:
        result['spring.datasource.url'] ==
                'jdbc:postgresql://dpg-abc123-a.oregon-postgres.render.com:5432/eldercare_db?sslmode=require'
        result['spring.datasource.username'] == 'eldercare'
        result['spring.datasource.password'] == 's3cret'
    }

    def "accepts the postgresql scheme as well as postgres"() {
        when:
        def result = DatabaseUrlEnvironmentPostProcessor.convert(
                'postgresql://user:pass@host:5432/db')

        then:
        result['spring.datasource.url'] == 'jdbc:postgresql://host:5432/db?sslmode=require'
    }

    def "defaults to the standard PostgreSQL port when the URI omits it"() {
        when:
        def result = DatabaseUrlEnvironmentPostProcessor.convert(
                'postgres://user:pass@host/db')

        then:
        result['spring.datasource.url'].contains('host:5432/db')
    }

    def "keeps an existing query string rather than overwriting it"() {
        when:
        def result = DatabaseUrlEnvironmentPostProcessor.convert(
                'postgres://user:pass@host:5432/db?sslmode=verify-full')

        then:
        result['spring.datasource.url'].endsWith('?sslmode=verify-full')
    }

    def "handles a password containing a colon"() {
        when:
        def result = DatabaseUrlEnvironmentPostProcessor.convert(
                'postgres://user:pa:ss@host:5432/db')

        then: "only the first colon separates the two, the rest is password"
        result['spring.datasource.username'] == 'user'
        result['spring.datasource.password'] == 'pa:ss'
    }

    def "returns nothing for input it should not touch"() {
        expect:
        DatabaseUrlEnvironmentPostProcessor.convert(candidate).isEmpty()

        where:
        candidate << [
                'jdbc:postgresql://localhost:5432/eldercare',
                'mysql://user:pass@host/db',
                'not a uri at all ::::',
                ''
        ]
    }
}
