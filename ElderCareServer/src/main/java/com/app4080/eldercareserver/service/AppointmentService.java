package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.dto.appointment.AppointmentRequest;
import com.app4080.eldercareserver.dto.appointment.AppointmentResponse;
import com.app4080.eldercareserver.entity.Appointment;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final UserService userService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientService patientService,
                              UserService userService) {
        this.appointmentRepository = appointmentRepository;
        this.patientService = patientService;
        this.userService = userService;
    }

    private void validateDoctor(User doctor) {
        if ("doctor".equals(doctor.getRole())) {
            return;
        } else {
            throw new IllegalArgumentException("User is not a doctor");
        }
    }

    private void validatePatient(Patient patient) {
        if (!patientService.checkExists(patient)) {
            throw new IllegalArgumentException("Patient does not exist");
        }
    }

    // Convert AppointmentRequestDTO to Appointment
    private Appointment fromRequestDto(AppointmentRequest requestDTO) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentDate(requestDTO.getAppointmentDate());
        appointment.setLocation(requestDTO.getLocation());
        appointment.setStatus(requestDTO.getStatus());
        appointment.setCreatedAt(LocalDateTime.now());
        return appointment;
    }

    // Convert Appointment to AppointmentResponseDTO
    private AppointmentResponse toResponseDto(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getDoctor().getId(),
                appointment.getAppointmentDate(),
                appointment.getLocation(),
                appointment.getStatus(),
                appointment.getCreatedAt()
        );
    }

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest requestDTO) {
        User doctor = userService.fetchUserById(requestDTO.getDoctorId());
        validateDoctor(doctor);

        Patient patient = patientService.findPatientById(requestDTO.getPatientId());
        validatePatient(patient);

        if (requestDTO.getAppointmentDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }

        Appointment appointment = fromRequestDto(requestDTO);
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);

        appointment.setCreatedAt(LocalDateTime.now());
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return toResponseDto(savedAppointment);
    }

    @Transactional
    public void deleteAppointment(Long appointmentId) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new IllegalArgumentException("Appointment not found");
        }
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return toResponseDto(updatedAppointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctor(User doctor) {
        validateDoctor(doctor);
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());
        return appointments.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatient(Patient patient) {
        validatePatient(patient);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
        return appointments.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByLocation(String location) {
        List<Appointment> appointments = appointmentRepository.findByLocation(location);
        return appointments.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByStatus(String status) {
        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        return appointments.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateBetween(start, end);
        return appointments.stream().map(this::toResponseDto).collect(Collectors.toList());
    }
}


