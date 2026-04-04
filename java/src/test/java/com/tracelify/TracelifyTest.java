package com.tracelify;

import java.util.HashMap;
import java.util.Map;

public class TracelifyTest {
    public static void main(String[] args) {
        Tracelify sdk = new Tracelify(
            "http://demo_key@localhost:8000/project/2/events",
            "1.0.0"
        );

        Map<String, Object> user = new HashMap<>();
        user.put("id", "user_101");
        sdk.setUser(user);

        sdk.setTag("env", "Production");

        sdk.addBreadcrumb("App started");
        sdk.addBreadcrumb("User clicked button");

        try {
            int x = 10 / 0;
        } catch (Exception e) {
            sdk.captureException(e);
        }

        System.out.println("✅ Done");
    }
}
