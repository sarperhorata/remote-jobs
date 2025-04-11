import os
import sys
import getpass
from pymongo import MongoClient
from dotenv import load_dotenv, set_key

# ANSI color codes for output formatting
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

def print_step(step_num, message):
    print(f"\n{BOLD}Step {step_num}: {message}{RESET}")

def print_status(message, status):
    if status == "OK":
        status_color = GREEN
    elif status == "WARNING":
        status_color = YELLOW
    else:  # ERROR
        status_color = RED
    
    print(f"{message:<40} [{status_color}{status}{RESET}]")

def get_input(prompt, default=None, password=False):
    if default:
        prompt = f"{prompt} [default: {default}]: "
    else:
        prompt = f"{prompt}: "
    
    if password:
        value = getpass.getpass(prompt)
    else:
        value = input(prompt)
    
    if not value and default:
        return default
    return value

def test_mongodb_connection(uri):
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        server_info = client.server_info()
        print_status("Connection test", "OK")
        print(f"  Connected to MongoDB {server_info.get('version')}")
        
        # Try to access the database
        db_name = uri.split('/')[-1].split('?')[0]
        db = client.get_database(db_name)
        collections = db.list_collection_names()
        print_status("Database access", "OK")
        print(f"  Database: {db_name}")
        print(f"  Collections: {', '.join(collections) if collections else 'No collections found'}")
        
        client.close()
        return True
    except Exception as e:
        print_status("Connection test", "ERROR")
        print(f"  Error: {str(e)}")
        return False

def guide_mongodb_setup():
    print(f"{BOLD}MongoDB Atlas Connection Setup Guide{RESET}")
    print("This guide will help you set up your MongoDB Atlas connection.\n")
    
    # Step 1: Check if MongoDB URI is already set
    print_step(1, "Check existing MongoDB URI")
    load_dotenv()
    existing_uri = os.getenv("MONGODB_URI")
    if existing_uri:
        print(f"  Existing MongoDB URI found: {existing_uri[:20]}...")
        if input("  Do you want to update this URI? (y/n): ").lower() != 'y':
            print("\nKeeping existing MongoDB URI. Exiting setup.")
            return
    
    # Step 2: Guide user to get MongoDB Atlas information
    print_step(2, "Get MongoDB Atlas Cluster Information")
    print("  Please sign in to your MongoDB Atlas account and get the following information:")
    print("  1. Cluster connection string (from 'Connect' button in Atlas)")
    print("  2. Username")
    print("  3. Password")
    print("  4. Database name")
    input("\nPress Enter when you're ready to continue...")
    
    # Step 3: Build the connection string
    print_step(3, "Build MongoDB Connection String")
    
    # Get cluster URL
    print("\nYour connection string should look like:")
    print("mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/<dbname>?retryWrites=true&w=majority")
    
    # Ask for each component
    cluster_host = get_input("Cluster host (e.g., cluster0.abcde.mongodb.net)")
    username = get_input("Username")
    password = get_input("Password", password=True)
    db_name = get_input("Database name", "remotejobs")
    
    # Build the URI
    uri = f"mongodb+srv://{username}:{password}@{cluster_host}/{db_name}?retryWrites=true&w=majority"
    
    # Step 4: Test the connection
    print_step(4, "Test Connection")
    if not test_mongodb_connection(uri):
        print("\nConnection test failed. Please check your credentials and try again.")
        retry = input("Do you want to try again? (y/n): ").lower()
        if retry == 'y':
            return guide_mongodb_setup()
        return False
    
    # Step 5: Save to .env file
    print_step(5, "Save to .env File")
    try:
        env_file = os.path.join(os.getcwd(), '.env')
        
        # Check if .env file exists
        if not os.path.exists(env_file):
            print(f"  Creating new .env file at {env_file}")
            with open(env_file, 'w') as f:
                f.write(f"MONGODB_URI={uri}\n")
        else:
            # Update existing .env file
            print(f"  Updating existing .env file at {env_file}")
            with open(env_file, 'r') as f:
                lines = f.readlines()
            
            found = False
            with open(env_file, 'w') as f:
                for line in lines:
                    if line.startswith('MONGODB_URI='):
                        f.write(f"MONGODB_URI={uri}\n")
                        found = True
                    else:
                        f.write(line)
                
                if not found:
                    f.write(f"MONGODB_URI={uri}\n")
        
        print_status("Save to .env file", "OK")
        print("  MongoDB URI saved to .env file")
        return True
    except Exception as e:
        print_status("Save to .env file", "ERROR")
        print(f"  Error: {str(e)}")
        print("  Please manually add the following line to your .env file:")
        print(f"  MONGODB_URI={uri}")
        return False

if __name__ == "__main__":
    if guide_mongodb_setup():
        print(f"\n{GREEN}MongoDB Atlas connection has been set up successfully!{RESET}")
        print("You can now run your application with the new connection string.")
    else:
        print(f"\n{RED}Failed to set up MongoDB Atlas connection.{RESET}")
        print("Please try again or set up the connection manually.") 