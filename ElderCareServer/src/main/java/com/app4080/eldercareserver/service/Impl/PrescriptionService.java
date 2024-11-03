package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Medication;
import com.app4080.eldercareserver.entity.Prescription;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import com.app4080.eldercareserver.repository.MedicationRepository;
import com.app4080.eldercareserver.repository.PrescriptionRepository;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Transactional
    public Prescription addPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public void deletePrescription(Prescription prescription) {
        if (prescriptionRepository.existsById(prescription.getId())) {
            prescriptionRepository.deleteById(prescription.getId());
        } else {
            throw new IllegalArgumentException("prescription does not exist");
        }
    }

    @Transactional(readOnly = true)
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByMedicalRecord(MedicalRecord mr){
        if(medicalRecordRepository.existsById(mr.getId())){
            return prescriptionRepository.findByMedicalRecord(mr);
        } else {
            throw new IllegalArgumentException("medicalRecord does not exist");
        }
    }

    @Transactional(readOnly = true)
    public List<Prescription> findPrescriptionByDoctor(User doctor){
        if(userRepository.existsById(doctor.getId())){
            return prescriptionRepository.findByDoctorId(doctor.getId());
        } else {
            throw new IllegalArgumentException("doctor does not exist");
        }
    }

    @Transactional(readOnly = true)
    public List<Prescription> findPrescriptionByMedication(Medication med){
        if(medicationRepository.existsById(med.getId())){
            return prescriptionRepository.findByMedicationId(med.getId());
        } else {
            throw new IllegalArgumentException("medication does not exist");
        }
    }

    // public List<Prescription> findActivePrescriptionsByDoctor(User doctor){}

    @Transactional(readOnly = true)
    public List<Prescription> findActivePrescriptions(){
        return prescriptionRepository.findActivePrescriptions();
    }
}
