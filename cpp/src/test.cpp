#include "../include/tracelify.h"
#include <iostream>
#include <stdexcept>

int main() {
    tracelify::Tracelify sdk("http://demo_key@localhost:8000/project/2/events", "1.0.0");
    
    std::map<std::string, std::string> user;
    user["id"] = "user_101";
    sdk.set_user(user);
    
    sdk.set_tag("env", "Production");
    
    sdk.add_breadcrumb("App started");
    sdk.add_breadcrumb("User clicked button");
    
    try {
        throw std::runtime_error("division by zero");
    } catch (const std::exception& e) {
        sdk.capture_exception(e);
    }
    
    std::cout << "✅ Done\n";
    return 0;
}
