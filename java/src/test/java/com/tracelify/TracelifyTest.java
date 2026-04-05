package com.tracelify;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Integration test — sends real events to the deployed Tracelify backend.
 * Run with: mvn exec:java -Dexec.mainClass="com.tracelify.TracelifyTest"
 */
public class TracelifyTest {

    // ── Real deployed DSN ──────────────────────────────────────────────────────
    private static final String DSN = "http://c482f74735cacf53d2ad256c8429f1f7@54.251.156.151:8000/api/d19f7705-48bc-4842-af80-55da7bc29007/events";

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Tracelify Java SDK — Integration Test ===");
        System.out.println("DSN: " + DSN);
        System.out.println();

        Tracelify sdk = new Tracelify(DSN, "1.0.0");

        // ── Context ────────────────────────────────────────────────────────────
        Map<String, Object> user = new HashMap<>();
        user.put("id", "usr_java_001");
        user.put("email", "java-test@tracelify.io");
        user.put("name", "Java Tester");
        sdk.setUser(user);

        sdk.setTag("env", "production");
        sdk.setTag("sdk", "tracelify.java");
        sdk.setTag("release", "1.0.0");

        sdk.addBreadcrumb("App started");
        sdk.addBreadcrumb("User authenticated");
        sdk.addBreadcrumb("Fetching data from DB");

        // ── Event 1: ArithmeticException ───────────────────────────────────────
        System.out.println("[1] Capturing ArithmeticException (division by zero)...");
        try {
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            sdk.captureException(e);
        }

        // ── Event 2: NullPointerException ──────────────────────────────────────
        System.out.println("[2] Capturing NullPointerException...");
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            sdk.captureException(e);
        }

        // ── Event 3: IllegalArgumentException ─────────────────────────────────
        System.out.println("[3] Capturing IllegalArgumentException...");
        try {
            throw new IllegalArgumentException("Invalid config: timeout must be > 0");
        } catch (IllegalArgumentException e) {
            sdk.captureException(e);
        }

        // ── Event 4: Custom RuntimeException ──────────────────────────────────
        System.out.println("[4] Capturing RuntimeException (DB connection failed)...");
        try {
            throw new RuntimeException("Database connection pool exhausted after 30s");
        } catch (RuntimeException e) {
            sdk.captureException(e);
        }

        // ── Event 5: StackOverflowError wrapped ───────────────────────────────
        System.out.println("[5] Capturing IndexOutOfBoundsException...");
        try {
            int[] arr = new int[3];
            int x = arr[10];
        } catch (ArrayIndexOutOfBoundsException e) {
            sdk.captureException(e);
        }

        // ── Flush & wait ───────────────────────────────────────────────────────
        System.out.println("\nFlushing 5 events to backend...");
        sdk.shutdown();

        System.out.println("\n✅ Done — check your Tracelify project dashboard for new issues.");
        System.out.println("   Dashboard: https://tracelify.io or http://localhost:5173");
    }
}
