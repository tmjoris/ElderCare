package com.app4080.eldercareserver.controller;

import com.app4080.eldercareserver.dto.progressreport.ProgressReportRequest;
import com.app4080.eldercareserver.dto.progressreport.ProgressReportResponse;
import com.app4080.eldercareserver.service.ProgressReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/progress-reports")
public class ProgressReportController {

    private final ProgressReportService progressReportService;

    @Autowired
    public ProgressReportController(ProgressReportService progressReportService) {
        this.progressReportService = progressReportService;
    }

    @PostMapping
    public ResponseEntity<ProgressReportResponse> createProgressReport(@RequestBody ProgressReportRequest request) {
        ProgressReportResponse response = progressReportService.createProgressReport(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressReport(@PathVariable Long id) {
        progressReportService.deleteProgressReport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ProgressReportResponse>> getAllProgressReports() {
        List<ProgressReportResponse> responses = progressReportService.getAllProgressReports();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ProgressReportResponse>> getReportsByPatient(@PathVariable Long patientId) {
        List<ProgressReportResponse> responses = progressReportService.getPRbyPatient(patientId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/caregiver/{caregiverId}")
    public ResponseEntity<List<ProgressReportResponse>> getReportsByCaregiver(@PathVariable Long caregiverId) {
        List<ProgressReportResponse> responses = progressReportService.getPRbyCaregiver(caregiverId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ProgressReportResponse>> getReportsByDateRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        List<ProgressReportResponse> responses = progressReportService.findPRbyRange(start, end);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProgressReportResponse>> searchReports(@RequestParam String keyword) {
        List<ProgressReportResponse> responses = progressReportService.keywordSearch(keyword);
        return ResponseEntity.ok(responses);
    }
}

