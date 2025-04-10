# Remote Jobs Monitor

Remote Jobs Monitor is a platform that helps you track and apply for remote job opportunities.

## Features

- Automatically collect and list remote job postings
- Filter and search job listings
- Create and manage user profiles
- Automatically fill profile information with LinkedIn integration
- Get notified about new job postings via Telegram bot
- Premium membership for unlimited job listing views and automatic application preparation

## Technologies

- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, Material-UI
- **Database**: MongoDB
- **Deployment**: Render, Netlify
- **Automation**: n8n

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Deployment

The project is deployed on Render (backend) and Netlify (frontend).

## License

MIT
