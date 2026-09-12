package com.app4080.eldercareserver.controller

import com.app4080.eldercareserver.config.JwtAuthenticationFilter
import com.app4080.eldercareserver.config.JwtService
import com.app4080.eldercareserver.config.SecurityConfig
import com.app4080.eldercareserver.dto.user.UserResponse
import com.app4080.eldercareserver.entity.User
import com.app4080.eldercareserver.repository.UserRepository
import com.app4080.eldercareserver.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Specification

import java.nio.file.AccessDeniedException

import static org.mockito.ArgumentMatchers.any
import static org.mockito.ArgumentMatchers.anyString
import static org.mockito.Mockito.doThrow
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * Exercises the HTTP layer through the real security filter chain.
 *
 * Before the filter chain existed every one of these endpoints answered an
 * anonymous caller, so the unauthorised cases below are the point of the file.
 */
@WebMvcTest(UserController)
@Import([SecurityConfig, JwtAuthenticationFilter, JwtService])
@TestPropertySource(properties = [
        'eldercare.jwt.secret=dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLTEyMzQ1Njc4',
        'eldercare.jwt.validity-seconds=3600'
])
class UserControllerSpec extends Specification {

    @Autowired
    MockMvc mockMvc

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JwtService jwtService

    @MockBean
    UserService userService

    @MockBean
    UserRepository userRepository

    def "registration is reachable without a token"() {
        given:
        def body = [
                username        : 'nurse.jane',
                password        : 'a decent password',
                email           : 'nurse.jane@example.org',
                firstName       : 'Jane',
                secondName      : 'Doe',
                primaryLocation : 'Ward A',
                role            : 'nurse',
                privileges      : 'editor'
        ]
        def response = new UserResponse(username: 'nurse.jane', role: 'nurse')
        when(userService.registerUser(any())).thenReturn(response)

        expect:
        mockMvc.perform(post('/api/users/register')
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath('$.username').value('nurse.jane'))
    }

    def "login is reachable without a token and returns a verifiable one"() {
        given:
        def stored = new User(username: 'nurse.jane', role: 'nurse')
        when(userService.fetchUserByUsername('nurse.jane')).thenReturn(stored)

        when:
        def result = mockMvc.perform(post('/api/users/login')
                .contentType(MediaType.APPLICATION_JSON)
                .content('{"username":"nurse.jane","password":"a decent password"}'))
                .andExpect(status().isOk())
                .andReturn()

        and:
        def token = objectMapper.readTree(result.response.contentAsString).get('token').asText()

        then: "the server can verify the token it just issued"
        jwtService.isValid(token)
        jwtService.extractUsername(token) == 'nurse.jane'
    }

    def "login returns 401 when the password does not match"() {
        given:
        doThrow(new AccessDeniedException('Invalid password'))
                .when(userService).login(any())

        expect:
        mockMvc.perform(post('/api/users/login')
                .contentType(MediaType.APPLICATION_JSON)
                .content('{"username":"nurse.jane","password":"wrong"}'))
                .andExpect(status().isUnauthorized())
    }

    def "user search refuses an anonymous caller"() {
        expect:
        mockMvc.perform(get('/api/users/search/jane'))
                .andExpect(status().isUnauthorized())
    }

    def "user search refuses a caller whose role is not clinical staff"() {
        given:
        def token = jwtService.generateToken('patient.sam', 'patient')

        expect:
        mockMvc.perform(get('/api/users/search/jane')
                .header('Authorization', "Bearer ${token}"))
                .andExpect(status().isForbidden())
    }

    def "user search allows clinical staff"() {
        given:
        def token = jwtService.generateToken('nurse.jane', 'nurse')
        when(userService.searchUsers(anyString())).thenReturn([])

        expect:
        mockMvc.perform(get('/api/users/search/jane')
                .header('Authorization', "Bearer ${token}"))
                .andExpect(status().isOk())
    }

    def "a forged token is refused"() {
        given: "a token signed with a key the server does not hold"
        def attacker = new JwtService(
                'YW4tZW50aXJlbHktZGlmZmVyZW50LXNlY3JldC1rZXktMTIzNDU2Nzg5', 3600L)
        def forged = attacker.generateToken('nurse.jane', 'nurse')

        expect:
        mockMvc.perform(get('/api/users/search/jane')
                .header('Authorization', "Bearer ${forged}"))
                .andExpect(status().isUnauthorized())
    }

    def "a garbled Authorization header does not produce a server error"() {
        expect:
        mockMvc.perform(get('/api/users/search/jane')
                .header('Authorization', header))
                .andExpect(status().isUnauthorized())

        where:
        header << ['Bearer', 'Bearer ', 'Bearer not.a.token', 'Basic abc123', 'nonsense']
    }

    def "looking up a user by name requires authentication"() {
        expect:
        mockMvc.perform(get('/api/users/username/nurse.jane'))
                .andExpect(status().isUnauthorized())
    }
}
