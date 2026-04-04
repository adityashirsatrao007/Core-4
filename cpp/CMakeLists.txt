project(tracelify_cpp LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(tracelify src/tracelify.cpp)

# Define directories so importing projects automatically inherit include paths
target_include_directories(tracelify PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
)

# Only build the test executable if this is not a library import
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR CMAKE_PROJECT_NAME STREQUAL "Core-4")
    add_executable(tracelify_test src/test.cpp)
    target_link_libraries(tracelify_test PRIVATE tracelify)
endif()
