package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.dto.patient.*;
import com.app4080.eldercareserver.dto.user.LoginRequest;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserService userService;

    @Autowired
    public PatientService(PatientRepository patientRepository, UserService userService) {
        this.patientRepository = patientRepository;
        this.userService = userService;
    }

    // Conversion Methods

    private PatientResponse convertToResponseDto(Patient patient) {
        PatientResponse dto = new PatientResponse();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDob(patient.getDob());
        dto.setGender(patient.getGender());
        dto.setAddress(patient.getAddress());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setEmergencyContactPhone(patient.getEmergencyContactPhone());
        dto.setCreatedAt(patient.getCreatedAt());
        return dto;
    }

    private Patient convertToEntity(PatientRequest dto) {
        Patient patient = new Patient();
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDob(dto.getDob());
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setCreatedAt(LocalDateTime.now());
        return patient;
    }

    private PatientSummary convertToSummaryDto(Patient patient) {
        PatientSummary dto = new PatientSummary();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setPhoneNumber(patient.getPhoneNumber());
        return dto;
    }

    private PatientSearch convertToSearchDto(Patient patient) {
        PatientSearch dto = new PatientSearch();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setDob(patient.getDob());
        dto.setGender(patient.getGender());
        dto.setPhoneNumber(patient.getPhoneNumber());
        return dto;
    }

    // Service Methods

    @Transactional
    public PatientResponse createPatient(PatientRequest requestDto) throws IllegalArgumentException {
        Patient patient = convertToEntity(requestDto);

        if (checkExists(patient)) {
            throw new IllegalArgumentException("Patient already exists");
        }

        Patient savedPatient = patientRepository.save(patient);
        return convertToResponseDto(savedPatient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePatient(Long patientId, User user) throws IllegalArgumentException, AccessDeniedException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient does not exist"));

        if (accessConfig.getTier(user.getPrivileges()) < 3) {
            throw new AccessDeniedException("Access denied");
        }

        patientRepository.delete(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientSummary> findPatientByLastName(String lastName) {
        return patientRepository.findByLastName(lastName)
                .stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatientSearch> keywordSearch(String keyword) {
        return patientRepository.searchPatients(keyword)
                .stream()
                .map(this::convertToSearchDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatientSearch> findPatientsByAgeRange(int minAge, int maxAge) {
        return patientRepository.findByAgeRange(minAge, maxAge)
                .stream()
                .map(this::convertToSearchDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Patient findPatientById(Long patientId) {
        return patientRepository.getReferenceById(patientId);
    }

    @Transactional(readOnly = true)
    public Patient fetchPatientByNames(String firstName, String lastName){
        Optional<Patient> pt = patientRepository.findByFirstNameAndLastName(firstName, lastName);
        if (pt.isPresent()) {
            return pt.get();
        }
        else {throw new IllegalArgumentException("Patient does not exist");}
    }

    public PatientResponse matchUserandPatientLoginthenFetchPatient(LoginRequest loginRequest) throws AccessDeniedException {
        User user = userService.fetchUserByUsername(loginRequest.getUsername());
        userService.login(loginRequest);
        Optional<Patient> pt = patientRepository.findByFirstNameAndLastName(user.getFirstName(), user.getSecondName());
        if (pt.isPresent()) {
            Patient patient = pt.get();
            return convertToResponseDto(patient);
        } else {
            throw new IllegalArgumentException("Patient does not exist");
        }
    }

    boolean checkExists(Patient patient) {
        return !patientRepository.findByFirstNameAndLastName(patient.getFirstName(), patient.getLastName()).isEmpty();
    }
}
