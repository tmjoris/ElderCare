package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Medication;
import com.app4080.eldercareserver.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicalRecordService medicalRecordService;

    @Autowired
    public MedicationService(MedicationRepository medicationRepository,
                             MedicalRecordService medicalRecordService) {
        this.medicationRepository = medicationRepository;
        this.medicalRecordService = medicalRecordService;
    }

    @Transactional
    public Medication addMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    @Transactional(readOnly = true)
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Medication> getMedicalRecord(MedicalRecord mr) throws IllegalArgumentException{
        if(!medicalRecordService.checkExists(mr)){
            throw new IllegalArgumentException("Medical record does not exist");
        }
        return medicationRepository.findByMedicalRecord(mr);
    }

    @Transactional
    public void deleteMedication(Medication medication) throws IllegalArgumentException{
        if(medicationRepository.existsById(medication.getId())){
            medicationRepository.deleteById(medication.getId());
        } else {
            throw new IllegalArgumentException("Medical record does not exist");
        }
    }

    @Transactional(readOnly = true)
    public List<Medication> findAllActiveMedications() {
        return medicationRepository.findActiveMedications();
    }

    @Transactional(readOnly = true)
    public List<Medication> findByName(String name) {
        return medicationRepository.findByMedicationNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public List<Medication> findMedicationsExpiringSoon(){
        return medicationRepository.findMedicationsExpiringSoon(LocalDateTime.now());
    }
}
