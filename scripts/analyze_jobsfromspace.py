#!/usr/bin/env python3
import os
import sys
import json
import logging
from pathlib import Path
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Add the current directory to Python path
script_dir = Path(__file__).resolve().parent
backend_dir = script_dir.parent
sys.path.append(str(backend_dir))

# Import after path setup
from crawler.jobs_from_space_parser import JobsFromSpaceParser
from models.models import WebsiteType

def main():
    """
    Analyze and crawl JobsFromSpace website for job listings
    """
    logger.info("Starting JobsFromSpace analysis")
    
    # Create data directory if it doesn't exist
    data_dir = script_dir / "data"
    data_dir.mkdir(exist_ok=True)
    
    # Try direct analysis of main site
    parser = JobsFromSpaceParser(base_url="https://www.jobsfromspace.com")
    logger.info("Analyzing main site structure...")
    
    site_analysis = parser.analyze_site()
    if site_analysis:
        with open(data_dir / "jobsfromspace_analysis.json", 'w') as f:
            json.dump(site_analysis, f, indent=2)
        
        logger.info(f"Site title: {site_analysis['structure']['title']}")
        logger.info(f"Meta description: {site_analysis['structure']['meta_description']}")
        logger.info(f"Links found: {len(site_analysis.get('all_links', {}))}")
        logger.info(f"Nav links: {site_analysis.get('nav_links', {})}")
        logger.info(f"Job links: {len(site_analysis.get('job_links', []))}")
    
    # Manually extract raw HTML for further analysis
    logger.info("Getting raw HTML for detailed analysis...")
    html = parser.get_raw_html()
    if html:
        with open(data_dir / "jobsfromspace_raw.html", 'w', encoding='utf-8') as f:
            f.write(html)
        logger.info(f"Raw HTML saved ({len(html)} bytes)")
    
    # Try alternative methods without relying on specific pages
    logger.info("Attempting to find job data directly...")
    jobs = parser.extract_jobs_from_homepage()
    
    if jobs:
        logger.info(f"Found {len(jobs)} jobs directly from homepage")
        with open(data_dir / "jobsfromspace_jobs.json", 'w') as f:
            json.dump(jobs, f, indent=2)
            
        # Display sample jobs
        for i, job in enumerate(jobs[:5]):
            logger.info(f"Job {i+1}: {job.get('title')} at {job.get('company')}")
    else:
        logger.warning("No jobs found on the homepage")
    
    # Try to get companies list from any available source
    companies = parser.extract_companies_from_homepage()
    if companies:
        logger.info(f"Found {len(companies)} companies directly from homepage")
        with open(data_dir / "jobsfromspace_companies.json", 'w') as f:
            json.dump(companies, f, indent=2)
            
        # Display sample companies
        for i, company in enumerate(companies[:5]):
            logger.info(f"Company {i+1}: {company.get('name')}")
    else:
        logger.warning("No companies found on the homepage")
    
    # Report on findings
    logger.info("Analysis summary:")
    logger.info(f"- Jobs found: {len(jobs)}")
    logger.info(f"- Companies found: {len(companies)}")
    logger.info(f"- Results saved to: {data_dir}")
    
    # Create a simple report
    report = {
        "analysis_date": str(datetime.now()),
        "site_url": "https://www.jobsfromspace.com",
        "site_title": site_analysis['structure']['title'] if site_analysis else "Unknown",
        "jobs_count": len(jobs),
        "companies_count": len(companies),
        "job_sample": jobs[:3] if jobs else [],
        "company_sample": companies[:3] if companies else []
    }
    
    with open(data_dir / "jobsfromspace_report.json", 'w') as f:
        json.dump(report, f, indent=2)
    
    logger.info("Analysis completed!")

if __name__ == "__main__":
    main() 