#include "../include/tracelify.h"
#include <iostream>
#include <sstream>
#include <chrono>
#include <iomanip>
#include <random>

namespace tracelify {

Tracelify::Tracelify(const std::string& dsn, const std::string& release) : dsn(dsn), release(release) {}

void Tracelify::set_user(const std::map<std::string, std::string>& user) {
    this->user = user;
}

void Tracelify::set_tag(const std::string& key, const std::string& value) {
    this->tags[key] = value;
}

void Tracelify::add_breadcrumb(const std::string& message) {
    this->breadcrumbs.push_back(message);
}

std::string Tracelify::get_project_id() const {
    size_t pos = dsn.find("/project/");
    if (pos != std::string::npos) {
        size_t start = pos + 9;
        size_t end = dsn.find("/", start);
        if (end != std::string::npos) {
            return dsn.substr(start, end - start);
        }
    }
    return "1";
}

std::string Tracelify::generate_event_id() const {
    static const char chars[] = "0123456789abcdef";
    std::string id;
    std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<> dist(0, 15);
    for (int i = 0; i < 32; ++i) {
        id += chars[dist(rng)];
    }
    return id;
}

std::string Tracelify::get_timestamp() const {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::gmtime(&in_time_t), "%Y-%m-%dT%H:%M:%S.000000+00:00");
    return ss.str();
}

std::string Tracelify::escape_json_string(const std::string& s) const {
    std::string out;
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else if (c == '\n') out += "\\n";
        else if (c == '\r') out += "\\r";
        else out += c;
    }
    return out;
}

void Tracelify::capture_exception(const std::exception& e) {
    std::stringstream json;
    json << "{";
    json << "\"event_id\": \"" << generate_event_id() << "\", ";
    json << "\"project_id\": \"" << get_project_id() << "\", ";
    json << "\"timestamp\": \"" << get_timestamp() << "\", ";
    json << "\"level\": \"error\", ";
    json << "\"release\": \"" << release << "\", ";
    
    json << "\"client\": {\"sdk\": \"tracelify.cpp\"}, ";
    
    json << "\"error\": {";
    std::string exType = "Exception"; 
    json << "\"type\": \"" << exType << "\", ";
    json << "\"message\": \"" << escape_json_string(e.what()) << "\", ";
    json << "\"stacktrace\": \"No stacktrace available in std C++\"";
    json << "}, ";
    
    json << "\"context\": {";
    json << "\"os\": \"Windows\", ";
    json << "\"runtime\": \"cpp\", ";
    json << "\"cpp_version\": \"14\"";
    json << "}";
    
    if (!user.empty()) {
        json << ", \"user\": {";
        bool first = true;
        for (const auto& kv : user) {
            if (!first) json << ", ";
            json << "\"" << kv.first << "\": \"" << escape_json_string(kv.second) << "\"";
            first = false;
        }
        json << "}";
    }
    
    if (!tags.empty()) {
        json << ", \"tags\": {";
        bool first = true;
        for (const auto& kv : tags) {
            if (!first) json << ", ";
            json << "\"" << kv.first << "\": \"" << escape_json_string(kv.second) << "\"";
            first = false;
        }
        json << "}";
    }
    
    if (!breadcrumbs.empty()) {
        json << ", \"breadcrumbs\": [";
        bool first = true;
        for (const auto& msg : breadcrumbs) {
            if (!first) json << ", ";
            json << "{\"message\": \"" << escape_json_string(msg) << "\"}";
            first = false;
        }
        json << "]";
    }
    
    json << "}";
    
    std::cout << "Captured Exception Event Payload:\n";
    std::cout << json.str() << "\n";
}

}
