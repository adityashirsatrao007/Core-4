package com.tracelify;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.TimeZone;
import java.util.UUID;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.concurrent.*;

public class Tracelify {
    private String dsn;
    private String release;
    private Map<String, Object> user = new HashMap<>();
    private Map<String, String> tags = new HashMap<>();
    private List<Map<String, String>> breadcrumbs = new ArrayList<>();
    
    // Async Worker & Batching
    private ExecutorService executor = Executors.newSingleThreadExecutor();
    private BlockingQueue<Map<String, Object>> logBatchQueue = new LinkedBlockingQueue<>(500);

    public Tracelify(String dsn, String release) {
        this.dsn = dsn;
        this.release = release;
        enableGlobalCrashReporting();
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }

    public void setTag(String key, String value) {
        this.tags.put(key, value);
    }

    public void addBreadcrumb(String message) {
        Map<String, String> breadcrumb = new HashMap<>();
        breadcrumb.put("message", message);
        this.breadcrumbs.add(breadcrumb);
    }

    public void captureException(Exception e) {
        Map<String, Object> event = new HashMap<>();
        event.put("event_id", UUID.randomUUID().toString().replace("-", ""));
        event.put("project_id", getProjectIdFromDsn(this.dsn));
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        event.put("timestamp", sdf.format(new Date()));
        
        event.put("level", "error");
        event.put("release", this.release);

        Map<String, Object> client = new HashMap<>();
        client.put("sdk", "tracelify.java");
        event.put("client", client);

        Map<String, Object> error = new HashMap<>();
        error.put("type", e.getClass().getSimpleName());
        error.put("message", e.getMessage());
        
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        error.put("stacktrace", sw.toString());
        event.put("error", error);

        Map<String, Object> context = new HashMap<>();
        context.put("os", System.getProperty("os.name"));
        context.put("runtime", "java");
        context.put("java_version", System.getProperty("java.version"));
        event.put("context", context);

        if (!this.user.isEmpty()) {
            event.put("user", this.user);
        }
        if (!this.tags.isEmpty()) {
            event.put("tags", this.tags);
        }
        if (!this.breadcrumbs.isEmpty()) {
            event.put("breadcrumbs", this.breadcrumbs);
        }

        // Asynchronous Batching Implementation
        logBatchQueue.offer(event);
        if (logBatchQueue.size() >= 5) {
            flush();
        }
    }

    public void flush() {
        executor.submit(() -> {
            List<Map<String, Object>> batch = new ArrayList<>();
            logBatchQueue.drainTo(batch);
            if (!batch.isEmpty()) {
                System.out.println("\n[Async Worker] Non-Blocking FLUSH for " + batch.size() + " items:");
                System.out.println(listToJson(batch));
                // HTTP Dispatch happens here asynchronously!
            }
        });
    }

    private void enableGlobalCrashReporting() {
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            System.err.println("Fatal JVM Crash Intercepted by Tracelify Global Handler!");
            Exception e = (throwable instanceof Exception) ? (Exception) throwable : new Exception(throwable);
            captureException(e);
            
            // Critical shutdown wait to ensure network finishes before process dies
            flush();
            executor.shutdown();
            try {
                executor.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException ignored) {}
        });
    }

    public void shutdown() {
        flush();
        executor.shutdown();
    }

    private String getProjectIdFromDsn(String dsn) {
        try {
            String[] parts = dsn.split("/project/");
            if (parts.length > 1) {
                return parts[1].split("/")[0];
            }
        } catch (Exception ignored) {}
        return "1";
    }

    @SuppressWarnings("unchecked")
    private String mapToJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) sb.append(", ");
            first = false;
            sb.append("\"").append(entry.getKey()).append("\": ");
            Object value = entry.getValue();
            if (value instanceof Map) {
                sb.append(mapToJson((Map<String, Object>) value));
            } else if (value instanceof List) {
                sb.append(listToJson((List<?>) value));
            } else if (value instanceof String) {
                sb.append("\"").append(((String) value).replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r")).append("\"");
            } else {
                sb.append(value);
            }
        }
        sb.append("}");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String listToJson(List<?> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        boolean first = true;
        for (Object item : list) {
            if (!first) sb.append(", ");
            first = false;
            if (item instanceof Map) {
                sb.append(mapToJson((Map<String, Object>) item));
            } else if (item instanceof String) {
                sb.append("\"").append(((String) item).replace("\"", "\\\"")).append("\"");
            } else {
                sb.append(item);
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
