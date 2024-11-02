package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientId(Long patientId);
    List<MedicalRecord> findByDoctorId(Long doctorId);
    List<MedicalRecord> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    List<MedicalRecord> findByDoctorIdAndDateOfVisit(Long doctorId, LocalDateTime dateOfVisit);

    @Override
    List<MedicalRecord> findAll();

    List<MedicalRecord> findByLocation(String location);
    List<MedicalRecord> findByDateOfVisitAndLocation(LocalDateTime dateOfVisit, String location);

    // Find records by date range
    List<MedicalRecord> findByDateOfVisitBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find records by patient and date range
    List<MedicalRecord> findByPatientIdAndDateOfVisitBetween(
            Long patientId, LocalDateTime startDate, LocalDateTime endDate);

    // Search records by diagnosis or treatment
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
            "LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(mr.treatmentPlan) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<MedicalRecord> searchRecords(@Param("searchTerm") String searchTerm);
}
