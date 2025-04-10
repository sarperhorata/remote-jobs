from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment
mongodb_uri = os.getenv("MONGODB_URI")

# Connect to MongoDB
client = MongoClient(mongodb_uri)

# Test connection
try:
    # Get server info
    server_info = client.server_info()
    print("MongoDB connection successful!")
    print(f"Server version: {server_info.get('version')}")
    print(f"Server host: {server_info.get('host')}")
    
    # Test database access
    db = client.get_database("remotejobs")
    collections = db.list_collection_names()
    print(f"Collections in database: {collections}")
    
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")
finally:
    # Close connection
    client.close() 