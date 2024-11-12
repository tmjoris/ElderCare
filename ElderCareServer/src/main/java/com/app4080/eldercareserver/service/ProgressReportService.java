package com.app4080.eldercareserver.service;

import com.app4080.eldercareserver.entity.ProgressReport;
import com.app4080.eldercareserver.repository.PatientRepository;
import com.app4080.eldercareserver.repository.ProgressReportRepository;
import com.app4080.eldercareserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.app4080.eldercareserver.dto.progressreport.ProgressReportRequest;
import com.app4080.eldercareserver.dto.progressreport.ProgressReportResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    public ProgressReportResponse createProgressReport(ProgressReportRequest request) {
        ProgressReport progressReport = fromRequest(request);
        progressReport.setCreatedAt(LocalDateTime.now());
        ProgressReport savedReport = progressReportRepository.save(progressReport);
        return toResponse(savedReport);
    }

    public void deleteProgressReport(Long reportId) {
        progressReportRepository.deleteById(reportId);
    }

    @Transactional(readOnly = true)
    public List<ProgressReportResponse> getAllProgressReports() {
        return progressReportRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressReportResponse> getPRbyPatient(Long patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new IllegalArgumentException("Patient not found");
        }
        return progressReportRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressReportResponse> getPRbyCaregiver(Long caregiverId) {
        if (!userRepository.existsById(caregiverId)) {
            throw new IllegalArgumentException("Caregiver not found");
        }
        return progressReportRepository.findByCaregiverId(caregiverId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressReportResponse> findPRbyRange(LocalDateTime start, LocalDateTime end) {
        return progressReportRepository.findByDateBetween(start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProgressReportResponse> keywordSearch(String keyword) {
        return progressReportRepository.searchReports(keyword)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Helper method to convert a ProgressReport entity to a ProgressReportResponse
    private ProgressReportResponse toResponse(ProgressReport report) {
        ProgressReportResponse response = new ProgressReportResponse();
        response.setId(report.getId());
        response.setPatientId(report.getPatient().getId());
        response.setCaregiverId(report.getCaregiver().getId());
        response.setDate(report.getDate());
        response.setSummary(report.getSummary());
        response.setRecommendations(report.getRecommendations());
        response.setCreatedAt(report.getCreatedAt());
        return response;
    }

    // Helper method to convert a ProgressReportRequest to a ProgressReport entity
    private ProgressReport fromRequest(ProgressReportRequest request) {
        ProgressReport report = new ProgressReport();
        report.setPatient(patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found")));
        report.setCaregiver(userRepository.findById(request.getCaregiverId())
                .orElseThrow(() -> new IllegalArgumentException("Caregiver not found")));
        report.setDate(request.getDate());
        report.setSummary(request.getSummary());
        report.setRecommendations(request.getRecommendations());
        return report;
    }
}
