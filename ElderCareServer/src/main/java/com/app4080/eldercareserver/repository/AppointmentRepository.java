package com.app4080.eldercareserver.repository;

import com.app4080.eldercareserver.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
    List<Appointment> findByLocationAndDoctorId(String location, Long doctorId);
    List<Appointment> findByLocation(String location);
    List<Appointment> findByPatientIdAndStatus(Long patientId, String status);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, String status);

    // Find appointments for a specific day
    List<Appointment> findByAppointmentDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Find upcoming appointments
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate > CURRENT_TIMESTAMP " +
            "AND a.status = 'scheduled' ORDER BY a.appointmentDate")
    List<Appointment> findUpcomingAppointments();

    // Find overlapping appointments for a doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentDate BETWEEN :startTime AND :endTime")
    List<Appointment> findOverlappingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
