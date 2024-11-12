package com.app4080.eldercareserver.config;

import java.util.List;

public class roleClusterConfig {
    static List<String> all_roles;
    static List<String> role_nurse;
    static List<String> role_doctor;
    static List<String> staff;

    static {
        all_roles = List.of("patient", "doctor", "nurse");
        role_nurse = List.of("nurse");
        role_doctor = List.of("doctor");
        staff = List.of("doctor", "nurse");
    }

    public static List<String> getAll_roles() {
        return all_roles;
    }

    public static List<String> getRole_nurse() {
        return role_nurse;
    }

    public static List<String> getRole_doctor() {
        return role_doctor;
    }

    public static List<String> getStaff() {
        return staff;
    }
}
