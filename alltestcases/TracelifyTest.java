package com.tracelify;

import java.util.HashMap;
import java.util.Map;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import java.text.ParseException;

/**
 * Comprehensive Integration test for Java Tracelify SDK
 * Captures varied exceptions across language domains to populate the Dashboard.
 */
public class TracelifyTest {

    private static final String DSN = "http://c482f74735cacf53d2ad256c8429f1f7@54.251.156.151.nip.io:8000/api/d19f7705-48bc-4842-af80-55da7bc29007/events";

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Tracelify Java SDK — Comprehensive Integration Test ===");
        System.out.println("DSN: " + DSN);
        System.out.println();

        Tracelify sdk = new Tracelify(DSN, "1.0.0");

        // Contextual Enrichment
        Map<String, Object> user = new HashMap<>();
        user.put("id", "usr_java_005");
        user.put("email", "enterprise@tracelify.io");
        user.put("name", "Enterprise Tester");
        sdk.setUser(user);

        sdk.setTag("env", "production");
        sdk.setTag("sdk", "tracelify.java");
        sdk.setTag("zone", "eu-central-1");

        sdk.addBreadcrumb("Service Started");
        sdk.addBreadcrumb("Connecting to dependencies");

        // 1. ArithmeticException
        System.out.println("[1] Capturing ArithmeticException...");
        try {
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            sdk.captureException(e);
        }

        // 2. NullPointerException
        System.out.println("[2] Capturing NullPointerException...");
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            sdk.captureException(e);
        }

        // 3. IllegalArgumentException
        System.out.println("[3] Capturing IllegalArgumentException...");
        try {
            throw new IllegalArgumentException("Timeout value -5 is invalid");
        } catch (IllegalArgumentException e) {
            sdk.captureException(e);
        }

        sdk.addBreadcrumb("Simulating generic file IO logic");

        // 4. FileNotFoundException
        System.out.println("[4] Capturing FileNotFoundException...");
        try {
            throw new FileNotFoundException("Could not read credentials from /usr/secrets/app.conf");
        } catch (FileNotFoundException e) {
            sdk.captureException(e);
        }

        // 5. IndexOutOfBoundsException
        System.out.println("[5] Capturing IndexOutOfBoundsException...");
        try {
            int[] arr = new int[3];
            int element = arr[10];
        } catch (IndexOutOfBoundsException e) {
            sdk.captureException(e);
        }

        // 6. Generic IOException
        System.out.println("[6] Capturing IOException...");
        try {
            throw new IOException("Socket timeout while negotiating proxy TLS");
        } catch (IOException e) {
            sdk.captureException(e);
        }

        sdk.addBreadcrumb("Handling Database queries");

        // 7. SQLException
        System.out.println("[7] Capturing SQLException...");
        try {
            throw new SQLException("Deadlock detected during transaction rollback", "40001", 1213);
        } catch (SQLException e) {
            sdk.captureException(e);
        }

        // 8. ClassCastException
        System.out.println("[8] Capturing ClassCastException...");
        try {
            Object i = Integer.valueOf(42);
            String s = (String) i;
        } catch (ClassCastException e) {
            sdk.captureException(e);
        }

        // 9. ParseException
        System.out.println("[9] Capturing ParseException...");
        try {
            throw new ParseException("Invalid ISO-8601 Date timestamp: '2024-14-35'", 5);
        } catch (ParseException e) {
            sdk.captureException(e);
        }

        // 10. UnsupportedOperationException
        System.out.println("[10] Capturing UnsupportedOperationException...");
        try {
            throw new UnsupportedOperationException("Method 'deleteUser()' is deprecated and removed");
        } catch (UnsupportedOperationException e) {
            sdk.captureException(e);
        }

        System.out.println("\nSignaling Shutdown and awaiting flush...");
        sdk.shutdown();

        System.out.println("\n✅ Done — 10 distinct issues tracked in Tracelify platform.");
    }
}
