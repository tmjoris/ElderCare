package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Medication;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import com.app4080.eldercareserver.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app4080.eldercareserver.dto.medication.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicalRecordService medicalRecordService;
    private final MedicalRecordRepository recordRepository;

    @Autowired
    public MedicationService(MedicationRepository medicationRepository,
                             MedicalRecordService medicalRecordService,
                             MedicalRecordRepository recordRepository) {
        this.medicationRepository = medicationRepository;
        this.medicalRecordService = medicalRecordService;
        this.recordRepository = recordRepository;
    }

    // Converts a Medication entity to MedicationResponse DTO
    private MedicationResponse convertToResponse(Medication medication) {
        MedicationResponse response = new MedicationResponse();
        response.setId(medication.getId());
        response.setMedicationName(medication.getMedicationName());
        response.setDosage(medication.getDosage());
        response.setFrequency(medication.getFrequency());
        response.setStartDate(medication.getStartDate());
        response.setEndDate(medication.getEndDate());
        response.setMedicalRecordId(medication.getMedicalRecord().getId());
        response.setCreatedAt(medication.getCreatedAt());
        return response;
    }

    // Converts a MedicationRequest DTO to a Medication entity
    private Medication convertToEntity(MedicationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("MedicationRequest cannot be null");
        }

        Medication medication = new Medication();
        medication.setMedicationName(request.getMedicationName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setStartDate(request.getStartDate());
        medication.setEndDate(request.getEndDate());

        MedicalRecord medicalRecord = recordRepository.findById(request.getMedicalRecordId())
                .orElseThrow(() -> new IllegalArgumentException("Medical record not found"));
        medication.setMedicalRecord(medicalRecord);

        return medication;
    }

    public MedicationResponse addMedication(MedicationRequest medicationRequest) {
        Medication medication = convertToEntity(medicationRequest);
        medication.setCreatedAt(LocalDateTime.now());
        Medication savedMedication = medicationRepository.save(medication);
        return convertToResponse(savedMedication);
    }


    // Retrieves all medications and returns them as a list of MedicationResponse DTOs
    @Transactional(readOnly = true)
    public List<MedicationResponse> getAllMedications() {
        Collectors Collectors = null;
        return medicationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    // Retrieves medications for a
    // specific medical record and returns them as MedicationResponse DTOs
    @Transactional(readOnly = true)
    public List<MedicationResponse> getMedicationsByMedicalRecord(MedicalRecord medicalRecord) throws IllegalArgumentException {

        if (!medicalRecordService.checkExists(medicalRecord)) {
            throw new IllegalArgumentException("Medical record does not exist");
        }

        return medicationRepository.findByMedicalRecord(medicalRecord)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Deletes a medication
    public void deleteMedication(Long medicationId) throws IllegalArgumentException {
        if (medicationRepository.existsById(medicationId)) {
            medicationRepository.deleteById(medicationId);
        } else {
            throw new IllegalArgumentException("Medication does not exist");
        }
    }

    // Retrieves active medications and returns them as MedicationResponse DTOs
    @Transactional(readOnly = true)
    public List<MedicationResponse> findAllActiveMedications() {
        return medicationRepository.findActiveMedications()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Finds medications by name pattern and returns them as MedicationResponse DTOs
    @Transactional(readOnly = true)
    public List<MedicationResponse> findByName(String name) {
        return medicationRepository.findByMedicationNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Finds medications expiring soon and returns them as MedicationResponse DTOs
    @Transactional(readOnly = true)
    public List<MedicationResponse> findMedicationsExpiringSoon() {
        return medicationRepository.findMedicationsExpiringSoon(LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}

