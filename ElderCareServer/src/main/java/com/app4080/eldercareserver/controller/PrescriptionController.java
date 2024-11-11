package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.prescription.PrescriptionRequest;
import com.app4080.eldercareserver.dto.prescription.PrescriptionResponse;
import com.app4080.eldercareserver.service.PrescriptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<?> createPrescription(@RequestBody PrescriptionRequest request) {
        try {
            PrescriptionResponse response = prescriptionService.addPrescription(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the prescription");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrescription(@PathVariable Long id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.ok("Prescription deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prescription not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the prescription");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPrescriptions() {
        try {
            List<PrescriptionResponse> responses = prescriptionService.getAllPrescriptions();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions");
        }
    }

    @GetMapping("/medicalRecord/{medicalRecordId}")
    public ResponseEntity<?> getPrescriptionsByMedicalRecord(@PathVariable Long medicalRecordId) {
        try {
            List<PrescriptionResponse> responses = prescriptionService.getPrescriptionsByMedicalRecord(medicalRecordId);
            return ResponseEntity.ok(responses);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medical record not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions by medical record");
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        try {
            List<PrescriptionResponse> responses = prescriptionService.findPrescriptionByDoctor(doctorId);
            return ResponseEntity.ok(responses);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions by doctor");
        }
    }

    @GetMapping("/medication/{medicationId}")
    public ResponseEntity<?> getPrescriptionsByMedication(@PathVariable Long medicationId) {
        try {
            List<PrescriptionResponse> responses = prescriptionService.findPrescriptionByMedication(medicationId);
            return ResponseEntity.ok(responses);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medication not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions by medication");
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActivePrescriptions() {
        try {
            List<PrescriptionResponse> responses = prescriptionService.findActivePrescriptions();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching active prescriptions");
        }
    }

    @GetMapping("/dateRange")
    public ResponseEntity<?> getPrescriptionsByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<PrescriptionResponse> responses = prescriptionService.findPrescriptionsByDateRange(startDate, endDate);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions by date range");
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPrescriptionsByPatientId(@PathVariable Long patientId) {
        try {
            List<PrescriptionResponse> responses = prescriptionService.findPrescriptionsByPatientId(patientId);
            return ResponseEntity.ok(responses);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching prescriptions by patient");
        }
    }
}

