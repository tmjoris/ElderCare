package com.app4080.eldercareserver.service.Impl;

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

    public boolean checkDocExists(User doctor) throws IllegalArgumentException{
        if (!doctor.getRole().equals("doctor")){
            throw new IllegalArgumentException("Invalid doctor");
        } else {
            return true;
        }
    }

    public boolean checkPatientExists(Patient patient) throws IllegalArgumentException{
        if(!patientService.checkExists(patient)){
            throw new IllegalArgumentException("Invalid patient");
        } else {
            return true;
        }
    }

    public Appointment createAppointment(User doctor, Patient patient, LocalDateTime date) throws IllegalArgumentException{
        if (!checkDocExists(doctor) || !checkPatientExists(patient)){
            throw new IllegalArgumentException("Invalid Parameters");
        }

        if (date.isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Invalid date");
        }

        Appointment app = new Appointment();
        app.setAppointmentDate(date);
        app.setDoctor(doctor);
        app.setPatient(patient);
        app.setStatus("active");
        app.setCreatedAt(LocalDateTime.now());

        return appointmentRepository.save(app);
    }

    public List<Appointment> getAppointmentByDoc(User doctor){
        if (!checkDocExists(doctor)){
            throw new IllegalArgumentException("Invalid doctor");
        }

        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    public List<Appointment> getAppointmentByPatient(Patient patient){
        if (!checkPatientExists(patient)){
            throw new IllegalArgumentException("Invalid Patient");
        }

        return appointmentRepository.findByPatientId(patient.getId());
    }

    public List<Appointment> getAppointmentByLocation(String location){
        return appointmentRepository.findByLocation(location);
    }

    public List<Appointment> getAppointmentByStatus(String status){
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentByPatientAndStatus(Patient patient, String status){
        return appointmentRepository.findByPatientIdAndStatus(patient.getId(), status);
    }

    public List<Appointment> getAppointmentByDoctorAndStatus(User doctor, String status){
        return appointmentRepository.findByDoctorIdAndStatus(doctor.getId(), status);
    }

    public List<Appointment> getAppointmentByPatientAndDoctor(Patient patient, User doctor){
        return appointmentRepository.findByPatientIdAndDoctorId(patient.getId(), doctor.getId());
    }

    public List<Appointment> getAppointmentByLocationAndDoctor(String location, User doctor){
        return appointmentRepository.findByLocationAndDoctorId(location, doctor.getId());
    }

    public List<Appointment> getAppointmentByDateRange(LocalDateTime start, LocalDateTime end){
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }
}
