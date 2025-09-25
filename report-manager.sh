#!/bin/bash

# Report Management Script for Playwright Framework
# This script provides convenient commands to manage timestamped test reports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "📊 Playwright Report Management"
    echo "================================"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  html              - Open latest HTML report"
    echo "  html-timestamp    - Open latest timestamped HTML report"
    echo "  allure            - Serve latest Allure report"
    echo "  allure-timestamp  - Serve latest timestamped Allure report"
    echo "  generate-allure   - Generate static Allure report"
    echo "  summary           - Show latest test run summary"
    echo "  list              - List all available reports"
    echo "  clean             - Clean all reports"
    echo "  clean-old         - Clean reports older than 7 days"
    echo "  help              - Show this help message"
    echo ""
}

# Function to check if allure is installed
check_allure() {
    if ! command -v allure &> /dev/null; then
        print_error "Allure is not installed. Install it with: npm install -g allure-commandline"
        exit 1
    fi
}

# Function to open HTML report
open_html() {
    local report_path="test-results/html/latest/index.html"
    
    if [[ -f "$report_path" ]]; then
        print_info "Opening latest HTML report..."
        if command -v open &> /dev/null; then
            open "$report_path"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "$report_path"
        else
            print_info "HTML report available at: $report_path"
        fi
        print_success "HTML report opened"
    else
        print_error "No HTML report found at $report_path"
        print_info "Run tests first: npm test"
    fi
}

# Function to open timestamped HTML report
open_html_timestamp() {
    local latest_dir=$(ls -td test-results/html/*/ 2>/dev/null | head -n1)
    
    if [[ -n "$latest_dir" && -f "${latest_dir}index.html" ]]; then
        print_info "Opening timestamped HTML report: $latest_dir"
        if command -v open &> /dev/null; then
            open "${latest_dir}index.html"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "${latest_dir}index.html"
        else
            print_info "HTML report available at: ${latest_dir}index.html"
        fi
        print_success "Timestamped HTML report opened"
    else
        print_error "No timestamped HTML reports found"
        print_info "Run tests first: npm test"
    fi
}

# Function to serve Allure report
serve_allure() {
    check_allure
    
    local allure_path="test-results/allure-results/latest"
    
    if [[ -d "$allure_path" ]]; then
        print_info "Serving latest Allure report from: $allure_path"
        allure serve "$allure_path"
    else
        print_error "No Allure results found at $allure_path"
        print_info "Run tests first: npm test"
    fi
}

# Function to serve timestamped Allure report
serve_allure_timestamp() {
    check_allure
    
    local latest_dir=$(ls -td test-results/allure-results/*/ 2>/dev/null | head -n1)
    
    if [[ -n "$latest_dir" && -d "$latest_dir" ]]; then
        print_info "Serving timestamped Allure report: $latest_dir"
        allure serve "$latest_dir"
    else
        print_error "No timestamped Allure results found"
        print_info "Run tests first: npm test"
    fi
}

# Function to generate static Allure report
generate_allure() {
    check_allure
    
    local allure_results="test-results/allure-results/latest"
    local allure_output="test-results/allure-report/latest"
    
    if [[ -d "$allure_results" ]]; then
        print_info "Generating static Allure report..."
        mkdir -p "$(dirname "$allure_output")"
        allure generate "$allure_results" --clean -o "$allure_output"
        print_success "Static Allure report generated at: $allure_output"
        
        if command -v open &> /dev/null; then
            open "$allure_output/index.html"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "$allure_output/index.html"
        fi
    else
        print_error "No Allure results found at $allure_results"
        print_info "Run tests first: npm test"
    fi
}

# Function to show test summary
show_summary() {
    local summary_file="test-results/latest-summary.json"
    
    if [[ -f "$summary_file" ]]; then
        print_info "Latest Test Run Summary:"
        echo "=========================="
        
        # Parse JSON and display formatted summary
        if command -v jq &> /dev/null; then
            # If jq is available, use it for nice formatting
            cat "$summary_file" | jq -r '
                "🆔 Run ID: " + .testRunId,
                "🕒 Timestamp: " + .timestamp,
                "📊 Status: " + .status,
                "⏱️  Duration: " + .durationFormatted,
                "",
                "📈 Test Results:",
                "  ✅ Passed: " + (.stats.passed | tostring),
                "  ❌ Failed: " + (.stats.failed | tostring),
                "  ⏭️  Skipped: " + (.stats.skipped | tostring),
                "  📊 Total: " + (.stats.total | tostring),
                "",
                "📁 Reports:",
                "  HTML: " + .reports.html,
                "  Allure: " + .reports.allure
            '
        else
            # Fallback to raw JSON display
            cat "$summary_file"
        fi
    else
        print_error "No summary file found at $summary_file"
        print_info "Run tests first: npm test"
    fi
}

# Function to list reports
list_reports() {
    print_info "Available Reports:"
    echo "=================="
    
    echo ""
    print_info "HTML Reports:"
    if [[ -d "test-results/html" ]]; then
        ls -la test-results/html/ 2>/dev/null || print_warning "No HTML reports found"
    else
        print_warning "HTML reports directory doesn't exist"
    fi
    
    echo ""
    print_info "Allure Results:"
    if [[ -d "test-results/allure-results" ]]; then
        ls -la test-results/allure-results/ 2>/dev/null || print_warning "No Allure results found"
    else
        print_warning "Allure results directory doesn't exist"
    fi
}

# Function to clean all reports
clean_reports() {
    print_warning "This will delete ALL test reports. Are you sure? (y/N)"
    read -r confirmation
    
    if [[ "$confirmation" =~ ^[Yy]$ ]]; then
        print_info "Cleaning all reports..."
        rm -rf test-results/html/* test-results/allure-results/* test-results/output/* test-results/latest-summary.json 2>/dev/null || true
        print_success "All reports cleaned"
    else
        print_info "Operation cancelled"
    fi
}

# Function to clean old reports
clean_old_reports() {
    print_info "Cleaning reports older than 7 days..."
    
    find test-results/html -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    find test-results/allure-results -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    find test-results/output -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    print_success "Old reports cleaned"
}

# Main script logic
case "${1:-help}" in
    "html")
        open_html
        ;;
    "html-timestamp")
        open_html_timestamp
        ;;
    "allure")
        serve_allure
        ;;
    "allure-timestamp")
        serve_allure_timestamp
        ;;
    "generate-allure")
        generate_allure
        ;;
    "summary")
        show_summary
        ;;
    "list")
        list_reports
        ;;
    "clean")
        clean_reports
        ;;
    "clean-old")
        clean_old_reports
        ;;
    "help"|*)
        show_usage
        ;;
esac