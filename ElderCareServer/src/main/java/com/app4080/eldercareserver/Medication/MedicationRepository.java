package com.app4080.eldercareserver.Medication;

import com.app4080.eldercareserver.MedicalRecord.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByMedicalRecord(MedicalRecord mr);
}
