package com.app4080.eldercareserver.config;

import java.util.HashMap;

public class accessConfig {
    static HashMap<String, Integer> tier = new HashMap<>();

    static {
        tier.put("viewer", 1);
        tier.put("editor", 2);
        tier.put("supervisor", 3);
        tier.put("admin", 4);
        tier.put("overseer", 5);
    }

    public static int getTier(String role) {
        return tier.getOrDefault(role, -1);
    }
}
