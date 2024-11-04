package com.app4080.eldercareserver.dto.medicalrecord;

import java.time.LocalDateTime;

public class MedicalRecordSearchCriteria {

    private Long patientId;
    private Long doctorId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private String diagnosisOrTreatment;

    // Getters and setters
    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDiagnosisOrTreatment() {
        return diagnosisOrTreatment;
    }

    public void setDiagnosisOrTreatment(String diagnosisOrTreatment) {
        this.diagnosisOrTreatment = diagnosisOrTreatment;
    }
}
