#ifndef TRACELIFY_H
#define TRACELIFY_H

#include <string>
#include <map>
#include <vector>
#include <exception>

namespace tracelify {

    class Tracelify {
    public:
        Tracelify(const std::string& dsn, const std::string& release);
        
        void set_user(const std::map<std::string, std::string>& user);
        void set_tag(const std::string& key, const std::string& value);
        void add_breadcrumb(const std::string& message);
        void capture_exception(const std::exception& e);

    private:
        std::string dsn;
        std::string release;
        std::map<std::string, std::string> user;
        std::map<std::string, std::string> tags;
        std::vector<std::string> breadcrumbs;

        std::string get_project_id() const;
        std::string generate_event_id() const;
        std::string get_timestamp() const;
        std::string escape_json_string(const std::string& s) const;
    };

}

#endif // TRACELIFY_H
