import com.tracelify.Tracelify
import java.io.FileNotFoundException

fun main() {
    val DSN = "http://24910fd46216c29e346fb96e87719a0d@54.251.156.151.nip.io:8000/api/99edd5b2-b7c8-44aa-8f8b-ff3280fa3f28/events"
    println("=== Tracelify Kotlin SDK — Integration Test ===")
    
    val sdk = Tracelify(DSN, "1.0.0")
    sdk.setUser(mapOf("id" to "usr_kt_01", "name" to "Kotlin Tester"))
    sdk.setTag("env", "production")
    
    println("[1] NullPointerException")
    try {
        val s: String? = null
        s!!.length
    } catch (e: Exception) {
        sdk.captureException(e)
    }

    println("[2] ArithmeticException")
    try {
        val x = 10 / 0
    } catch (e: Exception) {
        sdk.captureException(e)
    }
    
    println("[3] FileNotFoundException")
    try {
        throw FileNotFoundException("File not found at /abc")
    } catch (e: Exception) {
        sdk.captureException(e)
    }

    println("\nSignaling Shutdown and awaiting flush...")
    sdk.shutdown()
    println("✅ Done")
}
