import os
import requests
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# ANSI color codes for output formatting
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

def print_status(message, status, details=None):
    """Print a status message with color-coding"""
    if status == "OK":
        status_color = GREEN
    elif status == "WARNING":
        status_color = YELLOW
    else:  # ERROR
        status_color = RED
    
    print(f"{message:<40} [{status_color}{status}{RESET}]")
    if details:
        print(f"  {details}")
    print()

def check_env_variables():
    """Check if all required environment variables are set"""
    print(f"{BOLD}Checking Environment Variables{RESET}")
    
    # Required environment variables
    required_vars = {
        "API": ["API_HOST", "API_PORT"],
        "MongoDB": ["MONGODB_URI"],
        "Render": ["RENDER_URL", "RENDER_SERVICE_ID"],
        "Telegram": ["TELEGRAM_BOT_TOKEN"]
    }
    
    all_ok = True
    
    for category, vars in required_vars.items():
        print(f"\n{category} Variables:")
        for var in vars:
            value = os.getenv(var)
            if value:
                # Mask sensitive values
                if "TOKEN" in var or "KEY" in var or "URI" in var:
                    display_value = value[:10] + "..." if len(value) > 10 else value
                else:
                    display_value = value
                print_status(f"  {var}", "OK", f"Value: {display_value}")
            else:
                print_status(f"  {var}", "ERROR", "Not set")
                all_ok = False
    
    return all_ok

def check_mongodb_connection():
    """Check if we can connect to MongoDB"""
    print(f"\n{BOLD}Checking MongoDB Connection{RESET}")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print_status("MongoDB URI", "ERROR", "MONGODB_URI not set")
        return False
    
    try:
        # Set a short timeout for the connection
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        server_info = client.server_info()
        print_status("MongoDB Connection", "OK", f"Connected to MongoDB {server_info.get('version')}")
        
        # Check database access
        db = client.get_database("remotejobs")
        collections = db.list_collection_names()
        print_status("MongoDB Database Access", "OK", f"Found collections: {', '.join(collections) if collections else 'No collections found'}")
        
        client.close()
        return True
    except Exception as e:
        print_status("MongoDB Connection", "ERROR", f"Failed: {str(e)}")
        print("  Please check your MongoDB URI and credentials.")
        print("  For MongoDB Atlas, verify that:")
        print("    1. The username and password are correct")
        print("    2. The IP address is allowed in the Network Access settings")
        print("    3. The database name is correct")
        return False

def check_render_service():
    """Check if the Render service is available"""
    print(f"\n{BOLD}Checking Render Service{RESET}")
    
    render_url = os.getenv("RENDER_URL")
    if not render_url:
        print_status("Render URL", "ERROR", "RENDER_URL not set")
        return False
    
    try:
        print(f"  Attempting to connect to {render_url}/health...")
        response = requests.get(f"{render_url}/health", timeout=10)
        if response.status_code == 200:
            print_status("Render Service", "OK", f"Service is up and running, status code: {response.status_code}")
            return True
        else:
            print_status("Render Service", "WARNING", f"Service returned status code: {response.status_code}")
            print("  The service is accessible but returned an unexpected status code.")
            return False
    except requests.exceptions.Timeout:
        print_status("Render Service", "ERROR", "Connection timed out")
        print("  The service might be in sleep mode or unavailable.")
        print("  For free tier Render services, they go to sleep after 15 minutes of inactivity.")
        print("  Try accessing the service in a browser to wake it up.")
        return False
    except requests.exceptions.ConnectionError:
        print_status("Render Service", "ERROR", "Connection error")
        print("  Could not connect to the service. Check if the URL is correct.")
        print("  For free tier Render services, they may have been suspended due to inactivity.")
        return False
    except Exception as e:
        print_status("Render Service", "ERROR", f"Failed: {str(e)}")
        return False

def main():
    """Run all checks"""
    print(f"{BOLD}ENVIRONMENT DIAGNOSTICS TOOL{RESET}")
    print("This tool checks your environment configuration and services.\n")
    
    env_ok = check_env_variables()
    mongodb_ok = check_mongodb_connection()
    render_ok = check_render_service()
    
    print(f"\n{BOLD}SUMMARY{RESET}")
    print_status("Environment Variables", "OK" if env_ok else "ERROR")
    print_status("MongoDB Connection", "OK" if mongodb_ok else "ERROR")
    print_status("Render Service", "OK" if render_ok else "ERROR")
    
    if not (env_ok and mongodb_ok and render_ok):
        print("\nSome checks failed. Please fix the issues before deploying.")
    else:
        print("\nAll checks passed. Your environment is correctly configured.")

if __name__ == "__main__":
    main() 