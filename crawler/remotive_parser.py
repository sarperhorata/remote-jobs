import requests
from bs4 import BeautifulSoup
import json
import re
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RemotiveParser:
    """
    Parser for the Remotive.io website to extract job listings.
    Remotive is a popular remote job board with a clean structure.
    """
    
    def __init__(self, base_url="https://remotive.io"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api/remote-jobs"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_job_categories(self) -> List[Dict[str, Any]]:
        """Get list of job categories available on Remotive"""
        try:
            url = f"{self.base_url}/remote-jobs"
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            categories = []
            
            # Find category links in the navigation
            category_links = soup.select('a[href^="/remote-jobs/"]')
            
            for link in category_links:
                category_url = link['href']
                if category_url == "/remote-jobs/":
                    continue  # Skip the main jobs page
                
                category_name = link.get_text().strip()
                if category_name and not any(c['name'] == category_name for c in categories):
                    categories.append({
                        'name': category_name,
                        'url': self.base_url + category_url,
                        'slug': category_url.replace('/remote-jobs/', '').rstrip('/')
                    })
            
            return categories
        except Exception as e:
            logger.error(f"Error getting job categories: {e}")
            return []
    
    def get_jobs_from_api(self, category: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get jobs from Remotive API"""
        try:
            url = self.api_url
            if category:
                url = f"{url}/category/{category}"
            
            logger.info(f"Fetching jobs from Remotive API: {url}")
            response = self.session.get(url)
            response.raise_for_status()
            
            data = response.json()
            jobs = data.get('jobs', [])
            
            # Limit the number of jobs if specified
            if limit and limit < len(jobs):
                jobs = jobs[:limit]
            
            logger.info(f"Found {len(jobs)} jobs from Remotive API")
            return jobs
        except Exception as e:
            logger.error(f"Error getting jobs from API: {e}")
            return []
    
    def get_jobs_from_page(self, category: Optional[str] = None, max_pages: int = 1) -> List[Dict[str, Any]]:
        """Get jobs by scraping the website pages"""
        all_jobs = []
        
        try:
            base_url = f"{self.base_url}/remote-jobs"
            if category:
                base_url = f"{base_url}/{category}"
            
            for page in range(1, max_pages + 1):
                url = base_url
                if page > 1:
                    url = f"{base_url}?page={page}"
                
                logger.info(f"Fetching jobs from page {page}: {url}")
                response = self.session.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find job listings
                job_elements = soup.select('.job-list .job-display')
                
                for job_elem in job_elements:
                    try:
                        # Extract basic job information
                        title_elem = job_elem.select_one('.position')
                        company_elem = job_elem.select_one('.company')
                        link_elem = job_elem.select_one('a.job-display-header')
                        tags_elems = job_elem.select('.job-tag')
                        location_elem = job_elem.select_one('.location')
                        
                        if not title_elem or not link_elem:
                            continue
                        
                        # Extract data
                        title = title_elem.get_text().strip()
                        company = company_elem.get_text().strip() if company_elem else "Unknown"
                        url = link_elem['href']
                        if not url.startswith('http'):
                            url = self.base_url + url if url.startswith('/') else f"{self.base_url}/{url}"
                        
                        tags = [tag.get_text().strip() for tag in tags_elems] if tags_elems else []
                        location = location_elem.get_text().strip() if location_elem else "Remote"
                        
                        # Create job data
                        job_data = {
                            "title": title,
                            "company": company,
                            "url": url,
                            "location": location,
                            "tags": tags,
                            "is_remote": True,  # Remotive only shows remote jobs
                            "source": "Remotive",
                            "posted_date": datetime.now().isoformat(),
                        }
                        
                        all_jobs.append(job_data)
                    except Exception as e:
                        logger.error(f"Error parsing job element: {e}")
                
                logger.info(f"Found {len(job_elements)} jobs on page {page}")
                
                # Check if there's a next page
                next_link = soup.select_one('a.next_page')
                if not next_link or 'disabled' in next_link.get('class', []):
                    break
            
            return all_jobs
        except Exception as e:
            logger.error(f"Error getting jobs from pages: {e}")
            return []
    
    def get_job_details(self, job_url: str) -> Dict[str, Any]:
        """Get detailed job information from a job page"""
        try:
            logger.info(f"Fetching job details from: {job_url}")
            response = self.session.get(job_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract job details
            title = soup.select_one('.content h1')
            company = soup.select_one('.content .company')
            apply_link = soup.select_one('a.apply-btn')
            description = soup.select_one('.job-description')
            location = soup.select_one('.job-metadata .location')
            salary = soup.select_one('.job-metadata .salary')
            
            # Construct job details
            job_details = {
                "title": title.get_text().strip() if title else "Unknown Title",
                "company": company.get_text().strip() if company else "Unknown Company",
                "description": description.get_text().strip() if description else "",
                "description_html": str(description) if description else "",
                "apply_url": apply_link['href'] if apply_link and 'href' in apply_link.attrs else job_url,
                "location": location.get_text().strip() if location else "Remote",
                "salary": salary.get_text().strip() if salary else "Not specified",
                "source_url": job_url,
                "source": "Remotive",
                "scraped_at": datetime.now().isoformat()
            }
            
            return job_details
        except Exception as e:
            logger.error(f"Error getting job details: {e}")
            return {
                "title": "Error retrieving job",
                "error": str(e),
                "source_url": job_url
            }
    
    def search_jobs(self, keywords: List[str], limit: int = 50) -> List[Dict[str, Any]]:
        """Search for jobs matching specific keywords"""
        if not keywords:
            return []
        
        try:
            # Try using the search API first
            search_term = " ".join(keywords)
            url = f"{self.api_url}/search?search={search_term}"
            
            logger.info(f"Searching jobs with keywords: {search_term}")
            response = self.session.get(url)
            
            if response.status_code == 200:
                data = response.json()
                jobs = data.get('jobs', [])
                
                if limit and limit < len(jobs):
                    jobs = jobs[:limit]
                
                logger.info(f"Found {len(jobs)} jobs matching search terms")
                return jobs
            else:
                # Fallback to getting all jobs and filtering
                all_jobs = self.get_jobs_from_api(limit=1000)  # Get a larger batch for filtering
                filtered_jobs = []
                
                for job in all_jobs:
                    job_text = f"{job.get('title', '')} {job.get('description', '')} {job.get('company_name', '')}"
                    job_text = job_text.lower()
                    
                    if all(keyword.lower() in job_text for keyword in keywords):
                        filtered_jobs.append(job)
                        if len(filtered_jobs) >= limit:
                            break
                
                logger.info(f"Found {len(filtered_jobs)} jobs matching search terms (fallback method)")
                return filtered_jobs
        except Exception as e:
            logger.error(f"Error searching jobs: {e}")
            return []
    
    def get_companies(self) -> List[Dict[str, Any]]:
        """Extract list of companies that post jobs on Remotive"""
        try:
            # Get a batch of jobs first
            jobs = self.get_jobs_from_api(limit=300)
            
            # Extract unique companies
            companies = {}
            for job in jobs:
                company_name = job.get('company_name')
                if not company_name:
                    continue
                
                if company_name not in companies:
                    companies[company_name] = {
                        'name': company_name,
                        'url': job.get('company_url', ''),
                        'logo': job.get('company_logo', ''),
                        'job_count': 1
                    }
                else:
                    companies[company_name]['job_count'] += 1
            
            # Convert to list and sort by job count
            company_list = list(companies.values())
            company_list.sort(key=lambda x: x['job_count'], reverse=True)
            
            logger.info(f"Found {len(company_list)} unique companies")
            return company_list
        except Exception as e:
            logger.error(f"Error getting companies: {e}")
            return []

# Run tests if executed directly
if __name__ == "__main__":
    parser = RemotiveParser()
    
    # Get job categories
    categories = parser.get_job_categories()
    print(f"Found {len(categories)} job categories")
    for i, category in enumerate(categories[:5]):
        print(f"{i+1}. {category['name']} - {category['url']}")
    
    # Get jobs from API
    jobs = parser.get_jobs_from_api(limit=5)
    print(f"\nSample of {len(jobs)} jobs from API:")
    for i, job in enumerate(jobs):
        print(f"{i+1}. {job.get('title')} at {job.get('company_name')} - {job.get('url')}")
    
    # Get company list
    companies = parser.get_companies()
    print(f"\nTop companies ({len(companies)} total):")
    for i, company in enumerate(companies[:5]):
        print(f"{i+1}. {company['name']} - {company['job_count']} jobs") 