package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PatientService {


    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public boolean checkExists(Patient patient) {
        return !patientRepository.findByFirstNameAndLastName(patient.getFirstName(), patient.getLastName())
                .isEmpty();
    }

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Transactional
    public Patient createPatient(Patient patient) throws IllegalArgumentException {
        if (checkExists(patient)){
            throw new IllegalArgumentException("Patient already exists");
        }

        patient.setCreatedAt(LocalDate.now());

        return patientRepository.save(patient);
    }

    @Transactional
    public void deletePatient(Patient patient, User user) throws IllegalArgumentException, AccessDeniedException {
        if (accessConfig.getTier(user.getPrivileges()) < 3) {
            throw new AccessDeniedException("Access denied");
        }

        if (!checkExists(patient)){
            throw new IllegalArgumentException("Patient does not exist");
        }

        patientRepository.delete(patient);
    }

    @Transactional(readOnly = true)
    public List<Patient> findPatientByFirstAndLastName(String firstName, String lastName) {
        return patientRepository.findByFirstNameAndLastName(firstName, lastName);
    }

    @Transactional(readOnly = true)
    public List<Patient> findPatientByLastName(String lastName) {
        return patientRepository.findByLastName(lastName);
    }

    @Transactional(readOnly = true)
    public List<Patient> keywordSearch(String keyword) {
        return patientRepository.searchPatients(keyword);
    }

    @Transactional(readOnly = true)
    public List<Patient> findPatientsByAgeRange(int minAge, int maxAge) {
        return patientRepository.findByAgeRange(minAge, maxAge);
    }
}
