package com.app4080.eldercareserver.Prescription;

import com.app4080.eldercareserver.MedicalRecord.MedicalRecord;
import com.app4080.eldercareserver.Patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findPrescriptionByMedicalRecord(MedicalRecord mr);
    List<Prescription> findByMedicationId(Long medicationId);
    List<Prescription> findByDoctorId(Long doctorId);
}
