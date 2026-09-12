package com.app4080.eldercareserver.service

import com.app4080.eldercareserver.dto.user.LoginRequest
import com.app4080.eldercareserver.dto.user.UserRegistrationRequest
import com.app4080.eldercareserver.entity.User
import com.app4080.eldercareserver.repository.UserRepository
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import spock.lang.Specification
import spock.lang.Subject

import java.nio.file.AccessDeniedException

/**
 * Registration and login previously stored and compared passwords in plain
 * text. These specs pin the hashing behaviour that replaced that.
 */
class UserServiceSpec extends Specification {

    UserRepository userRepository = Mock()
    def passwordEncoder = new BCryptPasswordEncoder()

    @Subject
    UserService userService = new UserService(userRepository, passwordEncoder)

    private static UserRegistrationRequest registration(String username, String password) {
        def request = new UserRegistrationRequest()
        request.username = username
        request.password = password
        request.email = "${username}@example.org"
        request.firstName = 'Test'
        request.secondName = 'User'
        request.role = 'nurse'
        request.privileges = 'editor'
        request
    }

    def "never stores the password it was given"() {
        given:
        def request = registration('nurse.jane', 'correct horse battery staple')
        User persisted = null

        when:
        userService.registerUser(request)

        then:
        1 * userRepository.existsByUsername('nurse.jane') >> false
        1 * userRepository.existsByEmail(_) >> false
        1 * userRepository.save(_) >> { User u -> persisted = u; u }

        and: "what reaches the database is a bcrypt hash, not the password"
        persisted.password != 'correct horse battery staple'
        persisted.password.startsWith('$2a$')

        and: "and it still verifies against the original"
        passwordEncoder.matches('correct horse battery staple', persisted.password)
    }

    def "the same password hashes differently for two users"() {
        given:
        def hashes = []
        userRepository.existsByUsername(_) >> false
        userRepository.existsByEmail(_) >> false
        userRepository.save(_) >> { User u -> hashes << u.password; u }

        when: "two users happen to choose the same password"
        userService.registerUser(registration('nurse.jane', 'shared password'))
        userService.registerUser(registration('dr.who', 'shared password'))

        then: "the per user salt keeps the stored values distinct"
        hashes.size() == 2
        hashes[0] != hashes[1]
    }

    def "rejects a duplicate username before touching the password"() {
        when:
        userService.registerUser(registration('nurse.jane', 'whatever'))

        then:
        1 * userRepository.existsByUsername('nurse.jane') >> true
        0 * userRepository.save(_)
        def e = thrown(IllegalArgumentException)
        e.message == 'Username already exists'
    }

    def "rejects a duplicate email"() {
        when:
        userService.registerUser(registration('someone.new', 'whatever'))

        then:
        1 * userRepository.existsByUsername(_) >> false
        1 * userRepository.existsByEmail('someone.new@example.org') >> true
        0 * userRepository.save(_)
        thrown(IllegalArgumentException)
    }

    def "login accepts the correct password against a stored hash"() {
        given:
        def stored = new User(username: 'nurse.jane',
                password: passwordEncoder.encode('correct password'))
        userRepository.findByUsername('nurse.jane') >> Optional.of(stored)

        when:
        userService.login(new LoginRequest(username: 'nurse.jane', password: 'correct password'))

        then:
        noExceptionThrown()
    }

    def "login rejects the wrong password"() {
        given:
        def stored = new User(username: 'nurse.jane',
                password: passwordEncoder.encode('correct password'))
        userRepository.findByUsername('nurse.jane') >> Optional.of(stored)

        when:
        userService.login(new LoginRequest(username: 'nurse.jane', password: 'wrong password'))

        then:
        thrown(AccessDeniedException)
    }

    def "login rejects a password that equals the stored hash"() {
        given: "an attacker who has somehow read the hash column"
        def hash = passwordEncoder.encode('correct password')
        def stored = new User(username: 'nurse.jane', password: hash)
        userRepository.findByUsername('nurse.jane') >> Optional.of(stored)

        when: "they replay the hash itself as the password"
        userService.login(new LoginRequest(username: 'nurse.jane', password: hash))

        then: "the old String.equals comparison would have let this through"
        thrown(AccessDeniedException)
    }

    def "login reports an unknown username distinctly from a bad password"() {
        given:
        userRepository.findByUsername('ghost') >> Optional.empty()

        when:
        userService.login(new LoginRequest(username: 'ghost', password: 'anything'))

        then:
        thrown(IllegalArgumentException)
    }

    def "grants access when the user's tier meets or exceeds the requirement"() {
        given:
        def user = new User(username: 'nurse.jane', privileges: actual)
        userRepository.findByUsername('nurse.jane') >> Optional.of(user)

        when:
        userService.validatePrivileges('nurse.jane', required)

        then:
        noExceptionThrown()

        where:
        actual       | required
        'admin'      | 'viewer'
        'admin'      | 'admin'
        'supervisor' | 'editor'
        'overseer'   | 'admin'
        'editor'     | 'viewer'
    }

    def "denies access when the user's tier is below the requirement"() {
        given:
        def user = new User(username: 'nurse.jane', privileges: actual)
        userRepository.findByUsername('nurse.jane') >> Optional.of(user)

        when:
        userService.validatePrivileges('nurse.jane', required)

        then:
        thrown(AccessDeniedException)

        where:
        actual   | required
        'viewer' | 'admin'
        'editor' | 'supervisor'
        'viewer' | 'editor'
        'admin'  | 'overseer'
    }

    def "an unrecognised privilege never satisfies a real requirement"() {
        given: "getTier returns -1 for anything it does not know"
        def user = new User(username: 'intruder', privileges: 'wizard')
        userRepository.findByUsername('intruder') >> Optional.of(user)

        when:
        userService.validatePrivileges('intruder', 'viewer')

        then:
        thrown(AccessDeniedException)
    }

    def "role validation allows a listed role and refuses an unlisted one"() {
        given:
        def user = new User(username: 'nurse.jane', role: 'nurse')
        userRepository.findByUsername('nurse.jane') >> Optional.of(user)

        when:
        userService.validateRole('nurse.jane', ['doctor', 'nurse'])

        then:
        noExceptionThrown()

        when:
        userService.validateRole('nurse.jane', ['doctor'])

        then:
        thrown(AccessDeniedException)
    }
}
