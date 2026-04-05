#include "../Core-4/cpp/include/tracelify.h"
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>

// ══════════════════════════════════════════════════════════════════════════════
//   ▶  Tracelify C++ SDK — Comprehensive Error Capture Tests
// ══════════════════════════════════════════════════════════════════════════════

int main() {
  std::cout << "=== Tracelify C++ SDK — Integration Test ===\n";

  tracelify::Tracelify sdk(
      "http://51c0b6e6fe2f3c1539c6f109f471e2d2@54.251.156.151.nip.io:8000/api/"
      "60bc3cfc-23c1-467e-89fa-5c0b7a0dd51d/events",
      "1.0.0");

  // Contexts
  std::map<std::string, std::string> user;
  user["id"] = "usr_cpp_001";
  user["email"] = "cpp-tester@tracelify.io";
  sdk.set_user(user);

  sdk.set_tag("env", "Production");
  sdk.set_tag("sdk_version", "1.0.2");
  sdk.set_tag("architecture", "x86_64");

  sdk.add_breadcrumb("Application Initialized");
  sdk.add_breadcrumb("Loading physics engine modules...");

  // 1. std::runtime_error
  std::cout << "[1] Capturing runtime_error (division by zero)...\n";
  try {
    throw std::runtime_error("division by zero exception in physics engine");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 2. std::out_of_range
  std::cout << "[2] Capturing out_of_range for vector...\n";
  try {
    std::vector<int> vec = {1, 2, 3};
    int x = vec.at(10); // Throws
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 3. std::invalid_argument
  std::cout << "[3] Capturing invalid_argument...\n";
  try {
    throw std::invalid_argument("Provided hex code 'xyz' is not valid");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 4. std::logic_error
  std::cout << "[4] Capturing logic_error...\n";
  try {
    throw std::logic_error("State machine entered undefined execution state");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 5. std::domain_error
  std::cout << "[5] Capturing domain_error...\n";
  try {
    throw std::domain_error("Value -1 is outside mathematics domain for sqrt");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 6. std::length_error
  std::cout << "[6] Capturing length_error...\n";
  try {
    std::string s;
    s.resize(s.max_size() + 1); // Throws
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 7. std::overflow_error
  std::cout << "[7] Capturing overflow_error...\n";
  try {
    throw std::overflow_error("Buffer magnitude exceeds 64-bit bounds");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  // 8. Chained / Custom Error wrapper simulation
  std::cout << "[8] Capturing general runtime_error (network)... \n";
  try {
    throw std::runtime_error("CURL SSL exception: Handshake aborted by peer");
  } catch (const std::exception &e) {
    sdk.capture_exception(e);
  }

  std::cout << "\nFlushing events asynchronously...\n";
  // The SDK flushes natively inside its background thread block
  std::cout << "✅ Done — C++ Test Execution Complete.\n";
  return 0;
}
