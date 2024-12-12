package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.appointment.AppointmentRequest;
import com.app4080.eldercareserver.dto.appointment.AppointmentResponse;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.service.AppointmentService;
import com.app4080.eldercareserver.service.PatientService;
import com.app4080.eldercareserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;
    private final PatientService patientService;

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    public AppointmentController(AppointmentService appointmentService, UserService userService, PatientService patientService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.patientService = patientService;
    }

    // Create a new appointment
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @RequestParam String doctorUsername,
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime appointmentDate,
            @RequestParam String location) {

        logger.info("Received request to create appointment with details - doctorUsername: {}, patientId: {}, appointmentDate: {}, location: {}",
                doctorUsername, patientId, appointmentDate, location);

        try {
            User doctor = userService.fetchUserByUsername(doctorUsername);
            Patient patient = patientService.findPatientById(patientId);

            // Create a request DTO
            AppointmentRequest requestDTO = new AppointmentRequest();
            requestDTO.setDoctorId(doctor.getId());
            requestDTO.setPatientId(patient.getId());
            requestDTO.setAppointmentDate(appointmentDate);
            requestDTO.setLocation(location);
            requestDTO.setStatus("active");

            logger.debug("AppointmentRequest DTO created: {}", requestDTO);

            // Create appointment using the service
            AppointmentResponse createdAppointment = appointmentService.createAppointment(requestDTO);

            logger.info("Appointment created successfully with ID: {}", createdAppointment.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);

        } catch (Exception e) {
            logger.error("Error occurred while creating appointment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get appointments by doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        User doctor = userService.fetchUserById(doctorId);

        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctor);
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatient(@PathVariable Long patientId) {
        Patient patient = new Patient();
        patient.setId(patientId);

        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatient(patient);
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by location
    @GetMapping("/location")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByLocation(@RequestParam String location) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByLocation(location);
        return ResponseEntity.ok(appointments);
    }

    // Get appointments by status
    @GetMapping("/status")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(@RequestParam String status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status);
        return ResponseEntity.ok(appointments);
    }

    // Delete an appointment
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }

    // Update appointment status
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestParam String status) {

        try {
            AppointmentResponse updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
            return ResponseEntity.ok(updatedAppointment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get appointments within a specific date range
    @GetMapping("/date-range")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDateRange(start, end);
        return ResponseEntity.ok(appointments);
    }
}
