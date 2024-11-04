package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordRequest;
import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordResponse;
import com.app4080.eldercareserver.dto.medicalrecord.MedicalRecordSearchCriteria;
import com.app4080.eldercareserver.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @Autowired
    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    // Create a new medical record
    @PostMapping
    public ResponseEntity<MedicalRecordResponse> addMedicalRecord(@RequestBody MedicalRecordRequest request) {
        MedicalRecordResponse response = medicalRecordService.addMedicalRecord(request);
        return ResponseEntity.ok(response);
    }

    // Get all medical records
    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getAllMedicalRecords() {
        List<MedicalRecordResponse> records = medicalRecordService.getAllMedicalRecords();
        return ResponseEntity.ok(records);
    }

    // Get medical records by patient ID
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatient(patientId);
        return ResponseEntity.ok(records);
    }

    // Get medical records by doctor ID
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDoctor(doctorId);
        return ResponseEntity.ok(records);
    }

    // Get medical records by patient and doctor ID
    @GetMapping("/patient/{patientId}/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatientAndDoctor(
            @PathVariable Long patientId, @PathVariable Long doctorId) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByPatientAndDoctor(patientId, doctorId);
        return ResponseEntity.ok(records);
    }

    // Get medical records by location
    @GetMapping("/location")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByLocation(@RequestParam String location) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByLocation(location);
        return ResponseEntity.ok(records);
    }

    // Get medical records by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDateRange(
            @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
        List<MedicalRecordResponse> records = medicalRecordService.getMedicalRecordsByDateRange(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    // Search medical records by criteria
    @PostMapping("/search")
    public ResponseEntity<List<MedicalRecordResponse>> searchMedicalRecords(@RequestBody MedicalRecordSearchCriteria criteria) {
        List<MedicalRecordResponse> records = medicalRecordService.searchMedicalRecords(criteria);
        return ResponseEntity.ok(records);
    }
}
