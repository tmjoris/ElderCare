package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.entity.Patient;
import com.app4080.eldercareserver.entity.ProgressReport;
import com.app4080.eldercareserver.entity.User;
import com.app4080.eldercareserver.repository.PatientRepository;
import com.app4080.eldercareserver.repository.ProgressReportRepository;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProgressReportService {

    private final ProgressReportRepository progressReportRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgressReportService(ProgressReportRepository progressReportRepository,
                                 PatientRepository patientRepository,
                                 UserRepository userRepository) {
        this.progressReportRepository = progressReportRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProgressReport createProgressReport(ProgressReport progressReport) {
        return progressReportRepository.save(progressReport);
    }

    @Transactional
    public void deleteProgressReport(ProgressReport progressReport) {
        progressReportRepository.delete(progressReport);
    }

    @Transactional(readOnly = true)
    public List<ProgressReport> getAllProgressReports() {
        return progressReportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ProgressReport> getPRbyPatient(Patient patient){
        if(patientRepository.existsById(patient.getId())){
            return progressReportRepository.findByPatientId(patient.getId());
        } else {
            throw new IllegalArgumentException("Patient not found");
        }
    }

    @Transactional(readOnly = true)
    public List<ProgressReport> getPRbyCaregiver(User nurse){
        if(userRepository.existsById(nurse.getId())){
            return progressReportRepository.findByCaregiverId(nurse.getId());
        } else {
            throw new IllegalArgumentException("Nurse not found");
        }
    }

    @Transactional(readOnly = true)
    public List<ProgressReport> findPRbyRange(LocalDateTime start, LocalDateTime end){
        return progressReportRepository.findByDateBetween(start, end);
    }

    @Transactional(readOnly = true)
    public List<ProgressReport> keywordSearch(String keyword){
        return progressReportRepository.searchReports(keyword);
    }
}
