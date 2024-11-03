package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    @Autowired
    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public boolean checkExists(MedicalRecord medicalRecord) {
        return medicalRecordRepository.existsById(medicalRecord.getId());
    }

    @Transactional
    public MedicalRecord addMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByPatient(Patient patient){
        return medicalRecordRepository.findByPatientId(patient.getId());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByDoctor(User doctor){
        return medicalRecordRepository.findByDoctorId(doctor.getId());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByPatientAndDoctor(Patient patient, User doctor){
        return medicalRecordRepository.findByPatientIdAndDoctorId(patient.getId(), doctor.getId());
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByDoctorAndDate(User doctor, LocalDateTime date){
        return medicalRecordRepository.findByDoctorIdAndDateOfVisit(doctor.getId(), date);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByLocation(String location){
        return medicalRecordRepository.findByLocation(location);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByRange(LocalDateTime start, LocalDateTime end){
        return medicalRecordRepository.findByDateOfVisitBetween(start, end);
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getMedicalRecordsByDateAndLocation(LocalDateTime date, String location){
        return medicalRecordRepository.findByDateOfVisitAndLocation(date, location);
    }
}
