<<<<<<< HEAD
# Remote Jobs Monitor

Remote Jobs Monitor, uzaktan çalışma fırsatlarını takip etmenizi ve başvurmanızı kolaylaştıran bir platformdur.

## Özellikler

- Uzaktan iş ilanlarını otomatik olarak toplama ve listeleme
- İş ilanlarını filtreleme ve arama
- Kullanıcı profili oluşturma ve yönetme
- LinkedIn entegrasyonu ile profil bilgilerini otomatik doldurma
- Telegram botu ile yeni iş ilanlarından haberdar olma
- Premium üyelik ile sınırsız iş ilanı görüntüleme ve otomatik başvuru hazırlama

## Teknolojiler

- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, Material-UI
- **Veritabanı**: MongoDB
- **Deployment**: Render, Netlify
- **Otomasyon**: n8n

## Kurulum

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

Proje Render (backend) ve Netlify (frontend) üzerinde deploy edilmiştir.

## Lisans

MIT 
=======
# Remote Jobs API

FastAPI-based API for scraping remote job postings from multiple company career pages worldwide.

## Features

- 🌐 Scrapes job postings from multiple company career pages
- 🔄 Supports various job board platforms (Lever, Greenhouse, Breezy, etc.)
- 🔒 Secure authentication with API keys
- ⚡ Rate limiting to prevent abuse
- 📦 Response caching with Redis
- 🔍 Automatic selector validation and updates

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Redis**: For caching and rate limiting
- **BeautifulSoup4**: For web scraping
- **JWT**: For secure authentication

## Installation

1. Clone the repository

git clone https://github.com/sarperhorata/remote-jobs-api.git
cd remote-jobs-api

2. Set up virtual environment

python -m venv .venv
source .venv/bin/activate # macOS/Linux


3. Install dependencies

pip install -r requirements.txt


4. Install and start Redis
(macOS)
brew install redis
brew services start redis


## Usage

1. Start the API server:

uvicorn main:app --reload

2. API Documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

3. Authentication Flow:

1. Create user account

POST /users
{
"email": "user@example.com",
"username": "user",
"password": "password"
}
2. Login to get access token

POST /token
{
"username": "user",
"password": "password"
}
3. Create API key using access token

POST /api-keys
Header: Authorization: Bearer <access_token>

4. Use API key to access jobs
GET /jobs
Header: X-API-Key: <your_api_key>

## API Endpoints

- `GET /jobs`: Get all remote job postings
- `POST /users`: Create new user account
- `POST /token`: Login and get access token
- `POST /api-keys`: Create new API key
- `DELETE /api-keys/{api_key}`: Revoke API key
- `GET /health`: Health check endpoint

## Rate Limiting

- 3 requests per IP per day
- 24-hour cache for job listings
- Automatic rate limiting per company domain

## Project Structure

remote-jobs-api/
├── main.py # FastAPI app and endpoints
├── models.py # Data models
├── auth_manager.py # API key management
├── user_manager.py # User authentication
├── cache_manager.py # Redis cache management
├── rate_limiter.py # Rate limiting
├── selector_validator.py # Selector validation
└── companies.json # Company configurations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
>>>>>>> 5c0fca5ac302549224061d3fd6ea461f653fc532
