package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.config.accessConfig;
import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PatientService {

    @Autowired
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public boolean checkExists(Patient patient) {
        return !patientRepository.findByFirstNameAndLastName(patient.getFirstName(), patient.getLastName())
                .isEmpty();
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient createPatient(Patient patient) throws IllegalArgumentException {
        if (checkExists(patient)){
            throw new IllegalArgumentException("Patient already exists");
        }

        patient.setCreatedAt(LocalDate.now());

        return patientRepository.save(patient);
    }

    public void deletePatient(Patient patient, User user) throws IllegalArgumentException, AccessDeniedException {
        if (accessConfig.getTier(user.getPrivileges()) < 3) {
            throw new AccessDeniedException("Access denied");
        }

        if (!checkExists(patient)){
            throw new IllegalArgumentException("Patient does not exist");
        }

        patientRepository.delete(patient);
    }
}
