package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordRequest;
import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordResponse;
import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordSearchCriteria;
import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import com.app4080.eldercareserver.repository.PatientRepository;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Autowired
    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
                                PatientRepository patientRepository,
                                UserRepository userRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    private MedicalRecordResponse toResponse(MedicalRecord medicalRecord) {
        MedicalRecordResponse response = new MedicalRecordResponse();
        response.setId(medicalRecord.getId());
        response.setPatientId(medicalRecord.getPatient().getId());
        response.setDoctorId(medicalRecord.getDoctor().getId());
        response.setDateOfVisit(medicalRecord.getDateOfVisit());
        response.setLocation(medicalRecord.getLocation());
        response.setDiagnosis(medicalRecord.getDiagnosis());
        response.setTreatmentPlan(medicalRecord.getTreatmentPlan());
        response.setNotes(medicalRecord.getNotes());
        response.setCreatedAt(medicalRecord.getCreatedAt());
        return response;
    }

    @Transactional
    public MedicalRecordResponse addMedicalRecord(MedicalRecordRequest request) {
        MedicalRecord medicalRecord = new MedicalRecord();
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        medicalRecord.setPatient(patient);
        medicalRecord.setDoctor(doctor);
        medicalRecord.setDateOfVisit(request.getDateOfVisit());
        medicalRecord.setLocation(request.getLocation());
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setTreatmentPlan(request.getTreatmentPlan());
        medicalRecord.setNotes(request.getNotes());
        medicalRecord.setCreatedAt(LocalDateTime.now());

        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
        return toResponse(savedRecord);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getAllMedicalRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMedicalRecordsByPatientAndDoctor(Long patientId, Long doctorId) {
        return medicalRecordRepository.findByPatientIdAndDoctorId(patientId, doctorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMedicalRecordsByLocation(String location) {
        return medicalRecordRepository.findByLocation(location).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getMedicalRecordsByDateRange(LocalDateTime start, LocalDateTime end) {
        return medicalRecordRepository.findByDateOfVisitBetween(start, end).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> searchMedicalRecords(MedicalRecordSearchCriteria criteria) {
        List<MedicalRecord> records;

        if (criteria.getDiagnosisOrTreatment() != null) {
            records = medicalRecordRepository.searchRecords(criteria.getDiagnosisOrTreatment());
        } else if (criteria.getPatientId() != null && criteria.getStartDate() != null && criteria.getEndDate() != null) {
            records = medicalRecordRepository.findByPatientIdAndDateOfVisitBetween(
                    criteria.getPatientId(), criteria.getStartDate(), criteria.getEndDate());
        } else if (criteria.getDoctorId() != null && criteria.getStartDate() != null && criteria.getEndDate() != null) {
            records = medicalRecordRepository.findByDoctorIdAndDateOfVisit(
                    criteria.getDoctorId(), criteria.getStartDate());
        } else if (criteria.getLocation() != null && criteria.getStartDate() != null && criteria.getEndDate() != null) {
            records = medicalRecordRepository.findByDateOfVisitAndLocation(criteria.getStartDate(), criteria.getLocation());
        } else {
            records = medicalRecordRepository.findAll();
        }

        return records.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    boolean checkExists(MedicalRecord mr) {
        return medicalRecordRepository.existsById(mr.getId());
    }
}
