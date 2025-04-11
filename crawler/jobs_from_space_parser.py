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

class JobsFromSpaceParser:
    """
    Parser for the JobsFromSpace website to extract job listings and analyze site structure.
    """
    
    def __init__(self, base_url="https://www.jobsfromspace.com"):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def analyze_site(self):
        """Analyze the site structure to identify API endpoints and data sources"""
        try:
            logger.info(f"Analyzing {self.base_url}...")
            response = self.session.get(self.base_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for script tags that might contain data
            scripts = soup.find_all('script')
            api_endpoints = []
            data_objects = []
            
            for script in scripts:
                # Look for API endpoints
                if script.string:
                    api_matches = re.findall(r'https?://[^"\'\s]+api[^"\'\s]*', script.string)
                    if api_matches:
                        api_endpoints.extend(api_matches)
                    
                    # Look for data objects
                    data_matches = re.findall(r'window\.[A-Za-z0-9_]+ = ({.+?});', script.string, re.DOTALL)
                    if data_matches:
                        data_objects.extend(data_matches)
            
            # Look for all links
            all_links = {}
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.startswith('/'):
                    href = self.base_url + href
                elif not href.startswith(('http://', 'https://')):
                    href = f"{self.base_url}/{href}"
                
                text = a.get_text().strip()
                if text:
                    all_links[text] = href
            
            # Extract navigation links
            nav_links = {}
            nav_elements = soup.find_all(['nav', 'header'])
            for nav in nav_elements:
                for a in nav.find_all('a', href=True):
                    text = a.get_text().strip()
                    href = a['href']
                    if text:
                        if href.startswith('/'):
                            href = self.base_url + href
                        elif not href.startswith(('http://', 'https://')):
                            href = f"{self.base_url}/{href}"
                        nav_links[text] = href
            
            # Look for job links specifically
            job_links = []
            job_containers = soup.find_all(['div', 'section', 'article', 'main'])
            for container in job_containers:
                for a in container.find_all('a', href=True):
                    href = a['href']
                    # Look for patterns that indicate a job link
                    if any(pattern in href.lower() for pattern in ['/job/', '/jobs/', 'position', 'career', 'opening']):
                        if href.startswith('/'):
                            href = self.base_url + href
                        elif not href.startswith(('http://', 'https://')):
                            href = f"{self.base_url}/{href}"
                        job_links.append(href)
            
            # Identify possible job sections
            job_sections = []
            for section in soup.find_all(['section', 'div', 'article']):
                section_id = section.get('id', '').lower()
                section_class = ' '.join(section.get('class', [])).lower()
                section_text = section.get_text().lower()
                
                # Check if section might contain jobs
                if any(keyword in section_id or keyword in section_class or keyword in section_text 
                       for keyword in ['job', 'career', 'position', 'opening', 'listing']):
                    job_sections.append({
                        'id': section.get('id', ''),
                        'class': ' '.join(section.get('class', [])),
                        'contains_links': len(section.find_all('a')) > 0,
                        'text_sample': section.get_text()[:100].strip()
                    })
            
            return {
                'api_endpoints': api_endpoints,
                'data_objects': data_objects,
                'all_links': all_links,
                'nav_links': nav_links, 
                'job_links': job_links,
                'job_sections': job_sections,
                'structure': {
                    'title': soup.title.string if soup.title else None,
                    'meta_description': soup.find('meta', {'name': 'description'})['content'] if soup.find('meta', {'name': 'description'}) else None,
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing site: {e}")
            return None
    
    def get_company_list(self):
        """Extract the list of companies that have job listings on the site"""
        try:
            logger.info(f"Getting company list from {self.base_url}...")
            
            # First check site structure to find company link
            site_structure = self.analyze_site()
            company_url = None
            
            if site_structure and 'nav_links' in site_structure:
                for link_text, link_url in site_structure['nav_links'].items():
                    if any(keyword in link_text.lower() for keyword in ['company', 'companies', 'employer']):
                        company_url = link_url
                        break
            
            # If no company section found in navigation, try the main URL
            if not company_url:
                company_url = self.base_url
            
            response = self.session.get(company_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            companies = []
            
            # Try various approaches to find company listings
            
            # 1. Look for company cards or listings with specific classes
            company_elements = soup.select('[class*="company"], [class*="employer"], [class*="client"]')
            
            # 2. Look for sections that might contain companies
            if not company_elements:
                for section in soup.find_all(['section', 'div']):
                    section_id = section.get('id', '').lower()
                    section_class = ' '.join(section.get('class', [])).lower()
                    
                    if any(keyword in section_id or keyword in section_class 
                          for keyword in ['company', 'companies', 'client', 'employer']):
                        company_elements = section.find_all(['div', 'li', 'article'])
            
            # 3. Look for logos which often represent companies
            if not company_elements:
                company_elements = soup.find_all('img', class_=lambda c: c and any(
                    keyword in c.lower() for keyword in ['logo', 'company', 'client']))
            
            # Process found elements
            for element in company_elements:
                try:
                    # For img elements, use alt text or parent link
                    if element.name == 'img':
                        company_name = element.get('alt', '').strip()
                        company_link = None
                        
                        parent_a = element.find_parent('a')
                        if parent_a and 'href' in parent_a.attrs:
                            company_link = parent_a['href']
                    else:
                        # For other elements, look for headings or strong text
                        company_name_elem = element.find(['h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'b'])
                        company_name = company_name_elem.text.strip() if company_name_elem else ''
                        
                        # If no heading found, try the element's own text
                        if not company_name:
                            company_name = element.get_text().strip()
                        
                        # Look for links
                        company_link_elem = element.find('a', href=True)
                        company_link = company_link_elem['href'] if company_link_elem else None
                    
                    # Only add if we have a name
                    if company_name:
                        # Format URL properly if we have one
                        if company_link:
                            if company_link.startswith('/'):
                                company_link = self.base_url + company_link
                            elif not company_link.startswith(('http://', 'https://')):
                                company_link = f"{self.base_url}/{company_link}"
                        
                        companies.append({
                            'name': company_name,
                            'url': company_link
                        })
                except Exception as e:
                    logger.error(f"Error parsing company element: {e}")
            
            return companies
        except Exception as e:
            logger.error(f"Error getting company list: {e}")
            return []
    
    def get_jobs(self, max_pages=1):
        """Extract job listings from the site"""
        all_jobs = []
        
        try:
            # First, analyze site structure to find job listings page
            site_structure = self.analyze_site()
            jobs_url = None
            
            # Try to find jobs page from navigation
            if site_structure and 'nav_links' in site_structure:
                for link_text, link_url in site_structure['nav_links'].items():
                    if any(keyword in link_text.lower() for keyword in ['job', 'career', 'position']):
                        jobs_url = link_url
                        break
            
            # If no jobs page found in navigation, use main page
            if not jobs_url:
                jobs_url = self.base_url
            
            # Get the jobs page
            logger.info(f"Getting jobs from {jobs_url}...")
            response = self.session.get(jobs_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for job elements with various approaches
            
            # 1. Try to find a specific job listing container
            job_container = None
            for container in soup.find_all(['div', 'section', 'ul']):
                container_id = container.get('id', '').lower()
                container_class = ' '.join(container.get('class', [])).lower()
                
                if any(keyword in container_id or keyword in container_class 
                      for keyword in ['job', 'position', 'opening', 'listing']):
                    job_container = container
                    break
            
            # 2. Find job elements within the container or directly
            if job_container:
                job_elements = job_container.find_all(['div', 'li', 'article'], 
                                                      class_=lambda c: c and any(
                                                          keyword in c.lower() for keyword in 
                                                          ['job', 'position', 'opening', 'card', 'listing']))
            else:
                # If no container found, search the entire page
                job_elements = soup.find_all(['div', 'li', 'article'], 
                                            class_=lambda c: c and any(
                                                keyword in c.lower() for keyword in 
                                                ['job', 'position', 'opening', 'card', 'listing']))
            
            # If still no elements found, try to look for any elements that might contain job information
            if not job_elements:
                for elem in soup.find_all(['div', 'li', 'article']):
                    text = elem.get_text().lower()
                    if any(keyword in text for keyword in ['job', 'position', 'opening', 'apply', 'hire']):
                        if elem.find('a'):  # Only consider elements with links
                            job_elements.append(elem)
            
            logger.info(f"Found {len(job_elements)} potential job elements")
            
            # Process job elements
            for job in job_elements:
                try:
                    # Extract job title - look for headings or strong text
                    title_elem = job.find(['h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'b']) or \
                                job.find('a', class_=lambda c: c and ('title' in c.lower()))
                    
                    # If no specific title element found, use the job element's text
                    if not title_elem:
                        title = job.get_text().strip().split('\n')[0]  # First line as title
                    else:
                        title = title_elem.get_text().strip()
                    
                    # Extract link
                    link_elem = job.find('a', href=True)
                    
                    if not link_elem:
                        continue  # Skip if no link found
                    
                    url = link_elem['href']
                    if url.startswith('/'):
                        url = self.base_url + url
                    elif not url.startswith(('http://', 'https://')):
                        url = f"{self.base_url}/{url}"
                    
                    # Extract company name
                    company = "Unknown"
                    company_elem = job.find(string=re.compile('company|employer', re.I))
                    if company_elem:
                        parent = company_elem.parent
                        next_elem = parent.find_next(['span', 'div', 'p'])
                        if next_elem:
                            company = next_elem.get_text().strip()
                    else:
                        # Try looking for elements with company-related classes
                        company_elem = job.find(['span', 'div', 'p'], 
                                               class_=lambda c: c and ('company' in c.lower() or 'employer' in c.lower()))
                        if company_elem:
                            company = company_elem.get_text().strip()
                    
                    # Extract location
                    location = None
                    location_elem = job.find(string=re.compile('location|remote|onsite', re.I))
                    if location_elem:
                        parent = location_elem.parent
                        next_elem = parent.find_next(['span', 'div', 'p'])
                        if next_elem:
                            location = next_elem.get_text().strip()
                    else:
                        # Try looking for elements with location-related classes
                        location_elem = job.find(['span', 'div', 'p'], 
                                                class_=lambda c: c and ('location' in c.lower() or 'remote' in c.lower()))
                        if location_elem:
                            location = location_elem.get_text().strip()
                    
                    # Extract tags/skills
                    tags = []
                    tags_container = job.find(['div', 'ul'], 
                                             class_=lambda c: c and ('tag' in c.lower() or 'skill' in c.lower()))
                    if tags_container:
                        tag_elements = tags_container.find_all(['span', 'li', 'a'])
                        tags = [tag.get_text().strip() for tag in tag_elements]
                    
                    # Create job data dictionary
                    job_data = {
                        "title": title,
                        "company": company,
                        "url": url,
                        "location": location,
                        "tags": tags,
                        "is_remote": "remote" in title.lower() or "remote" in str(location).lower() or "remote" in " ".join(tags).lower(),
                        "source": "JobsFromSpace",
                        "posted_date": datetime.now().isoformat(),
                    }
                    
                    all_jobs.append(job_data)
                except Exception as e:
                    logger.error(f"Error parsing job: {e}")
            
            logger.info(f"Successfully parsed {len(all_jobs)} jobs")
            
        except Exception as e:
            logger.error(f"Error getting jobs: {e}")
        
        return all_jobs
    
    def get_raw_html(self):
        """Get raw HTML content from the website for detailed analysis"""
        try:
            response = self.session.get(self.base_url)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logger.error(f"Error getting raw HTML: {e}")
            return None

    def extract_jobs_from_homepage(self):
        """
        Extract job listings directly from the homepage
        without relying on specific URL paths
        """
        jobs = []
        try:
            # Get the homepage content
            response = self.session.get(self.base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all possible job containers
            job_candidates = []
            
            # Look for elements that might contain job information
            for elem in soup.find_all(['div', 'li', 'article', 'a']):
                text = elem.get_text().lower()
                # Check if element likely contains job-related info
                if any(keyword in text for keyword in ['job', 'position', 'opening', 'apply', 'hire', 'remote']):
                    # Check if there's a link and heading-like content
                    if elem.find('a') or elem.name == 'a':
                        job_candidates.append(elem)
            
            logger.info(f"Found {len(job_candidates)} potential job elements on homepage")
            
            # Process potential job elements
            for job_elem in job_candidates:
                try:
                    # Extract job title
                    if job_elem.name == 'a':
                        # If the element is an 'a' tag itself
                        title = job_elem.get_text().strip()
                        url = job_elem['href']
                    else:
                        # If the element contains an 'a' tag
                        title_elem = job_elem.find(['h1', 'h2', 'h3', 'h4', 'h5', 'strong', 'b']) or job_elem.find('a')
                        title = title_elem.get_text().strip() if title_elem else job_elem.get_text().strip().split('\n')[0]
                        
                        link_elem = job_elem.find('a', href=True)
                        url = link_elem['href'] if link_elem else None
                    
                    # Skip if we couldn't get a URL
                    if not url:
                        continue
                    
                    # Format URL properly
                    if url.startswith('/'):
                        url = self.base_url + url
                    elif not url.startswith(('http://', 'https://')):
                        url = f"{self.base_url}/{url}"
                    
                    # Extract company name - look for likely company indicators
                    company = "Unknown"
                    parent = job_elem.parent
                    siblings = list(parent.children) if parent else []
                    
                    # Try to find company name in siblings or parent text
                    for sibling in siblings:
                        if hasattr(sibling, 'get_text'):
                            text = sibling.get_text().strip()
                            # Skip if it's the title
                            if text == title:
                                continue
                            # If text is short enough, it might be a company name
                            if 1 < len(text) < 30:
                                company = text
                                break
                    
                    # Create job data
                    job_data = {
                        "title": title,
                        "company": company,
                        "url": url,
                        "is_remote": "remote" in title.lower(),
                        "source": "JobsFromSpace",
                        "posted_date": datetime.now().isoformat(),
                        "raw_element": str(job_elem)[:200]  # Store a snippet of raw HTML for debugging
                    }
                    
                    # Add job if it's not a duplicate
                    if not any(job['title'] == title and job['url'] == url for job in jobs):
                        jobs.append(job_data)
                    
                except Exception as e:
                    logger.error(f"Error parsing job element: {e}")
            
            return jobs
        except Exception as e:
            logger.error(f"Error extracting jobs from homepage: {e}")
            return []

    def extract_companies_from_homepage(self):
        """
        Extract company information directly from the homepage
        without relying on specific URL paths
        """
        companies = []
        try:
            # Get the homepage content
            response = self.session.get(self.base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for elements that might represent companies
            
            # 1. Images that might be company logos
            for img in soup.find_all('img'):
                try:
                    alt_text = img.get('alt', '').strip()
                    if alt_text and len(alt_text) < 30:  # Reasonable length for company name
                        
                        # Check if alt text seems like a company name
                        if not any(word in alt_text.lower() for word in ['icon', 'logo', 'button', 'banner']):
                            
                            # Get link if image is wrapped in a link
                            url = None
                            parent_a = img.find_parent('a')
                            if parent_a and 'href' in parent_a.attrs:
                                url = parent_a['href']
                                if url.startswith('/'):
                                    url = self.base_url + url
                                elif not url.startswith(('http://', 'https://')):
                                    url = f"{self.base_url}/{url}"
                            
                            companies.append({
                                'name': alt_text,
                                'url': url,
                                'source': 'image_alt',
                                'logo_src': img.get('src')
                            })
                except Exception as e:
                    logger.error(f"Error parsing company image: {e}")
            
            # 2. Look for common company sections
            company_sections = []
            for section in soup.find_all(['section', 'div']):
                section_id = section.get('id', '').lower()
                section_class = ' '.join(section.get('class', [])).lower() if section.get('class') else ''
                
                if any(term in section_id or term in section_class for term in ['partner', 'client', 'company', 'employer']):
                    company_sections.append(section)
            
            # Extract company names from sections
            for section in company_sections:
                # Find all links or headings in the section
                elements = section.find_all(['a', 'h2', 'h3', 'h4', 'h5', 'strong'])
                for elem in elements:
                    try:
                        name = elem.get_text().strip()
                        
                        # Skip navigation and common UI elements
                        if any(term in name.lower() for term in ['next', 'prev', 'back', 'home', 'contact']):
                            continue
                        
                        # Skip single words that are likely not company names
                        if len(name.split()) < 2 and len(name) < 5:
                            continue
                        
                        url = None
                        if elem.name == 'a' and 'href' in elem.attrs:
                            url = elem['href']
                            if url.startswith('/'):
                                url = self.base_url + url
                            elif not url.startswith(('http://', 'https://')):
                                url = f"{self.base_url}/{url}"
                        
                        # Add to companies if it's not a duplicate
                        if name and not any(company['name'] == name for company in companies):
                            companies.append({
                                'name': name,
                                'url': url,
                                'source': 'section'
                            })
                    except Exception as e:
                        logger.error(f"Error parsing company element: {e}")
            
            return companies
        except Exception as e:
            logger.error(f"Error extracting companies from homepage: {e}")
            return []
    
    def check_api_endpoints(self):
        """
        Look for potential API endpoints by checking common paths
        """
        common_endpoints = [
            '/api/jobs',
            '/api/companies',
            '/graphql',
            '/api/v1/jobs',
            '/jobs.json',
            '/data/jobs',
        ]
        
        working_endpoints = []
        
        for endpoint in common_endpoints:
            try:
                url = f"{self.base_url}{endpoint}"
                response = self.session.get(url)
                
                if response.status_code == 200:
                    content_type = response.headers.get('Content-Type', '')
                    
                    if 'json' in content_type or 'application/json' in content_type:
                        try:
                            data = response.json()
                            working_endpoints.append({
                                'url': url,
                                'status': response.status_code,
                                'content_type': content_type,
                                'is_json': True,
                                'sample_data': str(data)[:500] + '...' if len(str(data)) > 500 else str(data)
                            })
                        except:
                            working_endpoints.append({
                                'url': url,
                                'status': response.status_code,
                                'content_type': content_type,
                                'is_json': False,
                                'sample_data': response.text[:500] + '...' if len(response.text) > 500 else response.text
                            })
            except Exception as e:
                logger.error(f"Error checking endpoint {endpoint}: {e}")
        
        return working_endpoints 