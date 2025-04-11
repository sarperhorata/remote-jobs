#!/bin/bash

# JobsFromSpace startup script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting JobsFromSpace application...${NC}"

# Create logs directory if it doesn't exist
mkdir -p backend/logs
echo -e "${GREEN}Created logs directory${NC}"

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB status...${NC}"
if mongod --version > /dev/null 2>&1; then
  echo -e "${GREEN}MongoDB is installed${NC}"
else
  echo -e "${YELLOW}MongoDB not found. Please install MongoDB to use the application with a local database.${NC}"
  echo -e "${YELLOW}Alternatively, you can use the cloud MongoDB instance configured in the application.${NC}"
fi

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm install
npm run dev &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Start frontend development server
echo -e "${GREEN}Starting frontend development server...${NC}"
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}JobsFromSpace is now running!${NC}"
echo -e "${GREEN}* Backend: http://localhost:5000${NC}"
echo -e "${GREEN}* Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}===========================================${NC}"
echo -e "${YELLOW}Press CTRL+C to stop all services${NC}"

# Handle termination signals
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Keep script running
wait