#!/bin/bash

# Renkli çıktı için
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Remote Jobs API...${NC}"

# Virtual environment'ı aktif et
echo -e "${GREEN}Activating virtual environment...${NC}"
source .venv/bin/activate

# Redis'i başlat
echo -e "${GREEN}Starting Redis...${NC}"
brew services start redis

# API'yi başlat
echo -e "${GREEN}Starting FastAPI server...${NC}"
echo -e "${GREEN}Visit http://localhost:3000 in your browser${NC}"
uvicorn main:app --reload --port 3000