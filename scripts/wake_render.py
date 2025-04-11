import os
import sys
import time
import requests
import webbrowser
from dotenv import load_dotenv

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

def check_render_service(render_url, max_attempts=5, delay=5):
    """
    Check if the Render service is available, with multiple attempts
    """
    print(f"{BOLD}Checking Render Service{RESET}")
    
    if not render_url:
        print_status("Render URL", "ERROR", "RENDER_URL not set")
        return False
    
    health_url = f"{render_url}/health"
    print(f"Health check URL: {health_url}")
    
    for attempt in range(1, max_attempts + 1):
        print(f"\nAttempt {attempt}/{max_attempts}...")
        try:
            response = requests.get(health_url, timeout=10)
            if response.status_code == 200:
                print_status("Render Service", "OK", f"Service is up and running: {response.text}")
                return True
            else:
                print_status("Render Service", "WARNING", 
                             f"Service returned status code: {response.status_code}")
                print(f"Response: {response.text}")
        except requests.exceptions.Timeout:
            print_status("Render Service", "WARNING", "Connection timed out")
        except requests.exceptions.ConnectionError:
            print_status("Render Service", "WARNING", "Connection error")
        except Exception as e:
            print_status("Render Service", "ERROR", f"Error: {str(e)}")
        
        if attempt < max_attempts:
            print(f"Waiting {delay} seconds before next attempt...")
            time.sleep(delay)
    
    print("\nFailed to connect to the Render service after multiple attempts.")
    return False

def wake_render_service():
    """
    Try to wake up the Render service
    """
    load_dotenv()
    render_url = os.getenv('RENDER_URL')
    
    if not render_url:
        print(f"{RED}Error: RENDER_URL environment variable not set.{RESET}")
        print("Please set the RENDER_URL in your .env file.")
        return False
    
    print(f"{BOLD}RENDER SERVICE WAKE-UP UTILITY{RESET}")
    print("This utility helps wake up your sleeping Render service.\n")
    
    # First check if the service is already running
    if check_render_service(render_url, max_attempts=1):
        print(f"\n{GREEN}The Render service is already running!{RESET}")
        return True
    
    print(f"\n{YELLOW}The Render service appears to be sleeping or not responding.{RESET}")
    print("For free tier Render web services, they go to sleep after 15 minutes of inactivity.")
    print("Let's try to wake it up...\n")
    
    # Ask user to open the service in a browser
    print(f"{BOLD}Step 1: Open the service in your browser{RESET}")
    user_choice = input(f"Would you like to open {render_url} in your browser? (y/n): ")
    if user_choice.lower() == 'y':
        print(f"Opening {render_url} in your default browser...")
        webbrowser.open(render_url)
        print("If a new tab opened, wait for the page to load completely.")
        input("Press Enter to continue...")
    
    # Check again to see if the service is responding
    print(f"\n{BOLD}Step 2: Re-checking service status{RESET}")
    if check_render_service(render_url, max_attempts=3, delay=10):
        print(f"\n{GREEN}Success! The Render service is now awake and responsive.{RESET}")
        return True
    
    # Suggest manual steps if automatic wake-up fails
    print(f"\n{YELLOW}The service is still not responding. Try these manual steps:{RESET}")
    print("1. Log in to your Render dashboard.")
    print("2. Navigate to your service.")
    print("3. Check the service status and logs for any issues.")
    print("4. If the service is suspended, restart it manually.")
    print("5. For free tier services, verify you haven't exceeded your monthly free hours.")
    print("6. Check that the environment variables are correctly set in the Render dashboard.")
    
    # Ask if they want to visit the Render dashboard
    dashboard_url = "https://dashboard.render.com"
    user_choice = input(f"\nWould you like to open the Render dashboard at {dashboard_url}? (y/n): ")
    if user_choice.lower() == 'y':
        print(f"Opening {dashboard_url} in your default browser...")
        webbrowser.open(dashboard_url)
    
    return False

if __name__ == "__main__":
    if wake_render_service():
        sys.exit(0)
    else:
        print(f"\n{RED}Failed to wake up the Render service.{RESET}")
        print("Please check your Render dashboard for more information.")
        sys.exit(1) 