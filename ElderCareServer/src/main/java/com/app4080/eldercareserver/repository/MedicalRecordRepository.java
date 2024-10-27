package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientId(Long patientId);
    List<MedicalRecord> findByDoctorId(Long doctorId);

    // Find records by date range
    List<MedicalRecord> findByDateOfVisitBetween(LocalDate startDate, LocalDate endDate);

    // Find records by patient and date range
    List<MedicalRecord> findByPatientIdAndDateOfVisitBetween(
            Long patientId, LocalDate startDate, LocalDate endDate);

    // Search records by diagnosis or treatment
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
            "LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(mr.treatmentPlan) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<MedicalRecord> searchRecords(@Param("searchTerm") String searchTerm);
}
