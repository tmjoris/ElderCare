package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.dto.prescription.PrescriptionResponse;
import com.app4080.eldercareserver.dto.prescription.PrescriptionRequest;
import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Prescription;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import com.app4080.eldercareserver.repository.MedicationRepository;
import com.app4080.eldercareserver.repository.PrescriptionRepository;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final MedicationRepository medicationRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               MedicalRecordRepository medicalRecordRepository,
                               UserRepository userRepository,
                               MedicationRepository medicationRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
        this.medicationRepository = medicationRepository;
    }

    // Convert Prescription entity to PrescriptionResponse DTO
    private PrescriptionResponse mapToResponse(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.setId(prescription.getId());
        response.setMedicalRecordId(prescription.getMedicalRecord().getId());
        response.setMedicationId(prescription.getMedication().getId());
        response.setDoctorId(prescription.getDoctor() != null ? prescription.getDoctor().getId() : null);
        response.setInstructions(prescription.getInstructions());
        response.setIssuedDate(prescription.getIssuedDate());
        response.setCreatedAt(prescription.getCreatedAt());
        return response;
    }

    // Convert PrescriptionRequest DTO to Prescription entity
    private Prescription mapToEntity(PrescriptionRequest request) {
        Prescription prescription = new Prescription();
        prescription.setMedicalRecord(
                medicalRecordRepository.findById(request.getMedicalRecordId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid medical record ID"))
        );
        prescription.setMedication(
                medicationRepository.findById(request.getMedicationId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid medication ID"))
        );
        prescription.setDoctor(
                request.getDoctorId() != null ? userRepository.findById(request.getDoctorId()).orElse(null) : null
        );
        prescription.setInstructions(request.getInstructions());
        prescription.setIssuedDate(request.getIssuedDate());
        prescription.setCreatedAt(LocalDateTime.now());
        return prescription;
    }

    // Create a new prescription
    public PrescriptionResponse addPrescription(PrescriptionRequest request) {
        Prescription prescription = mapToEntity(request);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapToResponse(savedPrescription);
    }

    // Delete a prescription by ID
    public void deletePrescription(Long prescriptionId) {
        if (prescriptionRepository.existsById(prescriptionId)) {
            prescriptionRepository.deleteById(prescriptionId);
        } else {
            throw new IllegalArgumentException("Prescription does not exist");
        }
    }

    // Retrieve all prescriptions
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve prescriptions by medical record
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionsByMedicalRecord(Long medicalRecordId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new IllegalArgumentException("Medical record does not exist"));
        return prescriptionRepository.findByMedicalRecord(medicalRecord).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve prescriptions by doctor
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findPrescriptionByDoctor(Long doctorId) {
        if (!userRepository.existsById(doctorId)) {
            throw new IllegalArgumentException("Doctor does not exist");
        }
        return prescriptionRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve prescriptions by medication
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findPrescriptionByMedication(Long medicationId) {
        if (!medicationRepository.existsById(medicationId)) {
            throw new IllegalArgumentException("Medication does not exist");
        }
        return prescriptionRepository.findByMedicationId(medicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve active prescriptions
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findActivePrescriptions() {
        return prescriptionRepository.findActivePrescriptions().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve prescriptions by date range
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findPrescriptionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return prescriptionRepository.findByIssuedDateBetween(startDate, endDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Retrieve prescriptions by patient ID
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}

