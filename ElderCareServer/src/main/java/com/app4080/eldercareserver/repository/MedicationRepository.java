package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByMedicalRecord(MedicalRecord mr);

    // Find active medications
    @Query("SELECT m FROM Medication m WHERE m.endDate >= CURRENT_DATE")
    List<Medication> findActiveMedications();

    // Find medications by name pattern
    List<Medication> findByMedicationNameContainingIgnoreCase(String name);

    // Find medications expiring soon
    @Query("SELECT m FROM Medication m WHERE m.endDate BETWEEN CURRENT_DATE AND :date")
    List<Medication> findMedicationsExpiringSoon(@Param("date") LocalDate date);

    // Find medications by record and date range
    List<Medication> findByRecordIdAndStartDateBetween(
            Long recordId, LocalDate startDate, LocalDate endDate);
}
