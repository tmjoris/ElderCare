package com.app4080.eldercareserver.service.Impl;

import com.app4080.eldercareserver.entity.Appointment;
import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientService patientService;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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
}
