package com.app4080.eldercareserver.controller;

import ch.qos.logback.classic.Logger;
import com.app4080.eldercareserver.dto.medication.MedicationRequest;
import com.app4080.eldercareserver.dto.medication.MedicationResponse;
import com.app4080.eldercareserver.entity.MedicalRecord;
import com.app4080.eldercareserver.repository.MedicalRecordRepository;
import com.app4080.eldercareserver.service.MedicationService;
import com.app4080.eldercareserver.service.UserService;
import com.app4080.eldercareserver.config.roleClusterConfig;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;
    private final MedicalRecordRepository recordRepository;
    private final UserService userService;

    @Autowired
    public MedicationController(MedicationService medicationService,
                                MedicalRecordRepository recordRepository,
                                UserService userService) {
        this.medicationService = medicationService;
        this.recordRepository = recordRepository;
        this.userService = userService;
    }

    // Add a new medication
    @PostMapping
    public ResponseEntity<?> addMedication(@RequestBody MedicationRequest medicationRequest,
                                           @RequestParam String username) {
        Logger log = (Logger) LoggerFactory.getLogger(this.getClass());
        try {
            log.info("Received medication request: {}", medicationRequest);
            log.info("Validating privileges for username: {}", username);


            userService.validatePrivileges(username, "editor");
            userService.validateRole(username, roleClusterConfig.getStaff());

            MedicationResponse response = medicationService.addMedication(medicationRequest);
            log.info("Successfully added medication: {}", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid medication request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }


    // Get all medications
    @GetMapping
    public ResponseEntity<?> getAllMedications(@RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "supervisor");
            List<MedicationResponse> medications = medicationService.getAllMedications();
            return ResponseEntity.ok(medications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // Get medications by medical record ID
    @GetMapping("/record/{medicalRecordId}")
    public ResponseEntity<?> getMedicationsByMedicalRecord(@PathVariable Long medicalRecordId,
                                                           @RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "editor");
            Optional<MedicalRecord> mr = recordRepository.findById(medicalRecordId);
            if (mr.isPresent()) {
                List<MedicationResponse> medications = medicationService.getMedicationsByMedicalRecord(mr.get());
                return ResponseEntity.ok(medications);
            } else {
                throw new IllegalArgumentException();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medical record not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // Delete a medication by ID
    @DeleteMapping("/{medicationId}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long medicationId,
                                              @RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "editor");
            medicationService.deleteMedication(medicationId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Medication deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Medication not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // Get all active medications
    @GetMapping("/active")
    public ResponseEntity<?> getAllActiveMedications(@RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "supervisor");
            List<MedicationResponse> activeMedications = medicationService.findAllActiveMedications();
            return ResponseEntity.ok(activeMedications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // Find medications by name pattern
    @GetMapping("/search")
    public ResponseEntity<?> findMedicationsByName(@RequestParam String name,
                                                   @RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "supervisor");
            List<MedicationResponse> medications = medicationService.findByName(name);
            return ResponseEntity.ok(medications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // Find medications expiring soon
    @GetMapping("/expiring")
    public ResponseEntity<?> getMedicationsExpiringSoon(@RequestParam String username) {
        try {
            userService.validateRole(username, roleClusterConfig.getStaff());
            userService.validatePrivileges(username, "editor");
            List<MedicationResponse> expiringMedications = medicationService.findMedicationsExpiringSoon();
            return ResponseEntity.ok(expiringMedications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
}

