package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.patient.PatientRequest;
import com.app4080.eldercareserver.dto.patient.PatientResponse;
import com.app4080.eldercareserver.dto.patient.PatientSearch;
import com.app4080.eldercareserver.dto.patient.PatientSummary;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.service.PatientService;
import com.app4080.eldercareserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final UserService userService;

    @Autowired
    public PatientController(PatientService patientService,
                             UserService userService) {
        this.patientService = patientService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(@RequestBody PatientRequest requestDto, @RequestParam String username) {
        try {
            userService.validatePrivileges(username, "editor");
            PatientResponse responseDto = patientService.createPatient(requestDto);
            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients(@RequestParam String username) {
        try {
            userService.validatePrivileges(username, "editor");
            List<PatientResponse> patients = patientService.getAllPatients();
            return new ResponseEntity<>(patients, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long patientId, @RequestParam String username) {
        try {

            User user = userService.fetchUserByUsername(username);
            userService.validatePrivileges(username, "supervisor");
            patientService.deletePatient(patientId, user);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/search/lastname")
    public ResponseEntity<List<PatientSummary>> findPatientByLastName(@RequestParam String lastName, @RequestParam String username) {
        try{
            userService.validatePrivileges(username, "supervisor");
            List<PatientSummary> patients = patientService.findPatientByLastName(lastName);
            return new ResponseEntity<>(patients, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    // Endpoint for keyword search
    @GetMapping("/search/keyword")
    public ResponseEntity<List<PatientSearch>> keywordSearch(@RequestParam String keyword, @RequestParam String username) {
        try{
            userService.validatePrivileges(username, "supervisor");
            List<PatientSearch> patients = patientService.keywordSearch(keyword);
            return new ResponseEntity<>(patients, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }

    // Endpoint to find patients by age range
    @GetMapping("/search/age-range")
    public ResponseEntity<List<PatientSearch>> findPatientsByAgeRange(@RequestParam int minAge,
                                                                      @RequestParam int maxAge,
                                                                      @RequestParam String username) {
        try{
            userService.validatePrivileges(username, "supervisor");
            List<PatientSearch> patients = patientService.findPatientsByAgeRange(minAge, maxAge);
            return new ResponseEntity<>(patients, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }
}
