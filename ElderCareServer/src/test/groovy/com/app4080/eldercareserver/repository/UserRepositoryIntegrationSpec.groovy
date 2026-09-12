package com.app4080.eldercareserver.repository

import com.app4080.eldercareserver.entity.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import spock.lang.Specification

import java.time.LocalDateTime

/**
 * Runs the repository layer against a real PostgreSQL instance.
 *
 * These need a Docker daemon, so they are excluded from the unitTest task and
 * verified in CI. The project previously ran on SQLite, where several of the
 * queries below behave differently.
 */
@DataJpaTest
class UserRepositoryIntegrationSpec extends Specification {

    static PostgreSQLContainer postgres = new PostgreSQLContainer('postgres:16-alpine')

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        if (!postgres.running) {
            postgres.start()
        }
        registry.add('spring.datasource.url', postgres::getJdbcUrl)
        registry.add('spring.datasource.username', postgres::getUsername)
        registry.add('spring.datasource.password', postgres::getPassword)
        registry.add('spring.jpa.hibernate.ddl-auto', { 'create-drop' })
    }

    @Autowired
    UserRepository userRepository

    private static User user(Map overrides = [:]) {
        def u = new User()
        u.username = overrides.username ?: 'nurse.jane'
        u.firstName = overrides.firstName ?: 'Jane'
        u.secondName = overrides.secondName ?: 'Doe'
        u.password = overrides.password ?: 'a-bcrypt-hash'
        u.email = overrides.email ?: 'nurse.jane@example.org'
        u.primaryLocation = overrides.primaryLocation ?: 'Ward A'
        u.secondaryLocation = overrides.secondaryLocation
        u.phoneNumber = overrides.phoneNumber ?: '0700000000'
        u.role = overrides.role ?: 'nurse'
        u.privileges = overrides.privileges ?: 'editor'
        u.createdAt = LocalDateTime.now()
        u
    }

    def "persists and reads a user back by username"() {
        given:
        userRepository.save(user())

        when:
        def found = userRepository.findByUsername('nurse.jane')

        then:
        found.isPresent()
        found.get().email == 'nurse.jane@example.org'
    }

    def "reports existence by username and by email"() {
        given:
        userRepository.save(user())

        expect:
        userRepository.existsByUsername('nurse.jane')
        userRepository.existsByEmail('nurse.jane@example.org')
        !userRepository.existsByUsername('nobody')
        !userRepository.existsByEmail('nobody@example.org')
    }

    def "finds users by role"() {
        given:
        userRepository.save(user(username: 'nurse.jane', email: 'a@example.org', role: 'nurse'))
        userRepository.save(user(username: 'dr.who', email: 'b@example.org', role: 'doctor'))
        userRepository.save(user(username: 'nurse.sam', email: 'c@example.org', role: 'nurse'))

        expect:
        userRepository.findByRole('nurse').size() == 2
        userRepository.findByRole('doctor').size() == 1
        userRepository.findByRole('porter').isEmpty()
    }

    def "finds users by role and privileges together"() {
        given:
        userRepository.save(user(username: 'a', email: 'a@example.org',
                role: 'nurse', privileges: 'editor'))
        userRepository.save(user(username: 'b', email: 'b@example.org',
                role: 'nurse', privileges: 'viewer'))

        expect:
        userRepository.findByRoleAndPrivileges('nurse', 'editor').size() == 1
        userRepository.findByRoleAndPrivileges('nurse', 'admin').isEmpty()
    }

    def "search matches on username, email and phone number"() {
        given:
        userRepository.save(user(username: 'nurse.jane', email: 'jane@example.org',
                phoneNumber: '0711111111'))
        userRepository.save(user(username: 'dr.who', email: 'who@clinic.org',
                phoneNumber: '0722222222'))

        expect:
        userRepository.searchUsers(term).size() == expected

        where:
        term       || expected
        'jane'     || 1
        'clinic'   || 1
        '0711'     || 1
        'example'  || 1
        'nothing'  || 0
    }

    def "finds a user by first and second name"() {
        given:
        userRepository.save(user(firstName: 'Jane', secondName: 'Doe'))

        expect:
        userRepository.findByFirstNameAndSecondName('Jane', 'Doe').isPresent()
        userRepository.findByFirstNameAndSecondName('Jane', 'Smith').isEmpty()
    }
}
