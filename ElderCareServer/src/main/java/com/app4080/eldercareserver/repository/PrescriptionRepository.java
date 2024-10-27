package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByRecordId(Long recordId);
    List<Prescription> findByDoctorId(Long doctorId);
    List<Prescription> findByMedicationId(Long medicationId);

    // Find active prescriptions
    @Query("SELECT p FROM Prescription p JOIN p.medication m WHERE m.endDate >= CURRENT_DATE")
    List<Prescription> findActivePrescriptions();

    // Find prescriptions by date range
    List<Prescription> findByIssuedDateBetween(LocalDate startDate, LocalDate endDate);

    // Find prescriptions for a specific patient
    @Query("SELECT p FROM Prescription p JOIN p.medicalRecord mr WHERE mr.patientId = :patientId")
    List<Prescription> findByPatientId(@Param("patientId") Long patientId);
}
