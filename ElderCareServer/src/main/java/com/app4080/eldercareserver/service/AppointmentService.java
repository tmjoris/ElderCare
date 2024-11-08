package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.entity.Appointment;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientService patientService) {
        this.appointmentRepository = appointmentRepository;
        this.patientService = patientService;
    }

    private void validateDoctor(User doctor) {
        if (!"doctor".equals(doctor.getRole())) {
            throw new IllegalArgumentException("User is not a doctor");
        }
    }

    private void validatePatient(Patient patient) {
        if (!patientService.checkExists(patient)) {
            throw new IllegalArgumentException("Patient does not exist");
        }
    }

    @Transactional
    public Appointment createAppointment(User doctor, Patient patient, LocalDateTime date) {
        validateDoctor(doctor);
        validatePatient(patient);

        if (date.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(date);
        appointment.setStatus("active");
        appointment.setCreatedAt(LocalDateTime.now());

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void deleteAppointment(Long appointmentId) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new IllegalArgumentException("Appointment not found");
        }
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByDoctor(User doctor) {
        validateDoctor(doctor);
        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByPatient(Patient patient) {
        validatePatient(patient);
        return appointmentRepository.findByPatientId(patient.getId());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByLocation(String location) {
        return appointmentRepository.findByLocation(location);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByPatientAndStatus(Patient patient, String status) {
        validatePatient(patient);
        return appointmentRepository.findByPatientIdAndStatus(patient.getId(), status);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByDoctorAndStatus(User doctor, String status) {
        validateDoctor(doctor);
        return appointmentRepository.findByDoctorIdAndStatus(doctor.getId(), status);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByPatientAndDoctor(Patient patient, User doctor) {
        validatePatient(patient);
        validateDoctor(doctor);
        return appointmentRepository.findByPatientIdAndDoctorId(patient.getId(), doctor.getId());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByLocationAndDoctor(String location, User doctor) {
        validateDoctor(doctor);
        return appointmentRepository.findByLocationAndDoctorId(location, doctor.getId());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }
}

