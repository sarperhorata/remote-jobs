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