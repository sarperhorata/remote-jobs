from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.job import Job
from ..schemas.job import JobResponse
from ..utils.auth import get_current_active_user
from ..utils.premium import is_premium_user
from ..utils.form_filler import fill_job_application_form

router = APIRouter()

@router.get("/jobs/", response_model=List[JobResponse])
def get_jobs(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if is_premium_user(current_user):
        # Premium kullanıcılar için sınırsız iş ilanı
        jobs = db.query(Job).all()
    else:
        # Free kullanıcılar için sınırlı iş ilanı
        jobs = db.query(Job).limit(10).all()
    return jobs

@router.post("/jobs/{job_id}/apply")
def apply_for_job(job_id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if not is_premium_user(current_user):
        raise HTTPException(status_code=403, detail="Premium subscription required for automatic application")
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    user_data = {
        'name': current_user.name,
        'email': current_user.email,
        'phone': current_user.phone,
        'location': current_user.location,
        'experience': current_user.experience,
        'education': current_user.education,
    }
    
    fill_job_application_form(job.url, user_data)
    return {"message": "Application submitted successfully"} 