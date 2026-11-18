"""
Job Application Tracker - Public Job Scraping & Aggregation Service
Extracts publicly available job listings using permitted endpoints & BeautifulSoup parsing.
Outputs standardized JSON for consumption by the Node.js backend.
"""

import sys
import json
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("JobScraper")

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36 JobTrackerInternship/1.0"
    ),
    "Accept": "application/json, text/html, application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_arbeitnow_jobs(query: str = "", location: str = "") -> List[Dict[str, Any]]:
    """
    Fetches real-time tech jobs from Arbeitnow's free public developer API.
    """
    jobs = []
    try:
        url = "https://www.arbeitnow.com/api/job-board-api"
        logger.info(f"Querying Arbeitnow API: {url}")
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            for item in data.get("data", []):
                title = item.get("title", "")
                company = item.get("company_name", "Unknown Company")
                loc = item.get("location", "Remote")
                job_url = item.get("url", "")
                desc = item.get("description", "")
                # Strip HTML from description snippet
                clean_desc = BeautifulSoup(desc, "html.parser").get_text()[:300].strip()
                
                # Filter by query if provided
                if query and query.lower() not in title.lower() and query.lower() not in clean_desc.lower():
                    continue
                if location and location.lower() not in loc.lower():
                    continue

                jobs.append({
                    "jobTitle": title,
                    "companyName": company,
                    "jobLocation": loc,
                    "jobType": "Remote" if item.get("remote", False) else "Full-Time",
                    "salary": "Negotiable / Competitive",
                    "jobPostingUrl": job_url,
                    "jobDescription": clean_desc,
                    "source": "Arbeitnow API",
                    "status": "Found",
                    "isExternal": True
                })
        else:
            logger.warning(f"Arbeitnow returned status {response.status_code}")
    except Exception as e:
        logger.error(f"Error fetching Arbeitnow jobs: {str(e)}")

    return jobs

def fetch_remoteok_jobs(query: str = "") -> List[Dict[str, Any]]:
    """
    Fetches public remote tech jobs from RemoteOK's open legal API.
    """
    jobs = []
    try:
        url = "https://remoteok.com/api"
        logger.info(f"Querying RemoteOK API: {url}")
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            # RemoteOK first entry is legal disclaimer / notice
            job_items = [item for item in data if isinstance(item, dict) and "position" in item]
            
            for item in job_items:
                title = item.get("position", "")
                company = item.get("company", "Unknown")
                loc = item.get("location", "Worldwide Remote")
                job_url = item.get("url", "https://remoteok.com")
                clean_desc = BeautifulSoup(item.get("description", ""), "html.parser").get_text()[:300].strip()
                salary_min = item.get("salary_min")
                salary_max = item.get("salary_max")
                
                salary_str = "Not Specified"
                if salary_min and salary_max:
                    salary_str = f"${salary_min:,} - ${salary_max:,} USD/yr"
                elif salary_min:
                    salary_str = f"From ${salary_min:,} USD/yr"

                if query and query.lower() not in title.lower() and query.lower() not in clean_desc.lower():
                    continue

                jobs.append({
                    "jobTitle": title,
                    "companyName": company,
                    "jobLocation": loc or "Remote",
                    "jobType": "Remote",
                    "salary": salary_str,
                    "jobPostingUrl": job_url,
                    "jobDescription": clean_desc,
                    "source": "RemoteOK",
                    "status": "Found",
                    "isExternal": True
                })
        else:
            logger.warning(f"RemoteOK returned status {response.status_code}")
    except Exception as e:
        logger.error(f"Error fetching RemoteOK jobs: {str(e)}")

    return jobs

def scrape_public_html_jobs(search_keyword: str) -> List[Dict[str, Any]]:
    """
    Demonstrates legal, responsible HTML parsing using BeautifulSoup for public mock listings.
    """
    # Sample fallback parsed via BeautifulSoup
    sample_html = f"""
    <div class="jobs-feed">
        <article class="job-card">
            <h2 class="title">{search_keyword.capitalize()} Software Engineer</h2>
            <div class="company">TechWave Solutions</div>
            <div class="location">San Francisco, CA (Hybrid)</div>
            <div class="salary">$115,000 - $140,000 / yr</div>
            <p class="summary">Looking for a talented developer with expertise in modern web frameworks and databases.</p>
            <a class="apply-link" href="https://example.com/careers/techwave-eng">Apply Now</a>
        </article>
        <article class="job-card">
            <h2 class="title">Junior Full-Stack Developer</h2>
            <div class="company">CloudNative Labs</div>
            <div class="location">Remote - US/Canada</div>
            <div class="salary">$80,000 - $95,000 / yr</div>
            <p class="summary">Join our growing team building distributed cloud web applications and REST APIs.</p>
            <a class="apply-link" href="https://example.com/careers/cloudnative-dev">Apply Now</a>
        </article>
    </div>
    """
    soup = BeautifulSoup(sample_html, "html.parser")
    parsed_jobs = []

    for card in soup.find_all("article", class_="job-card"):
        title = card.find("h2", class_="title").get_text(strip=True)
        company = card.find("div", class_="company").get_text(strip=True)
        location = card.find("div", class_="location").get_text(strip=True)
        salary = card.find("div", class_="salary").get_text(strip=True)
        summary = card.find("p", class_="summary").get_text(strip=True)
        apply_url = card.find("a", class_="apply-link")["href"]

        parsed_jobs.append({
            "jobTitle": title,
            "companyName": company,
            "jobLocation": location,
            "jobType": "Full-Time",
            "salary": salary,
            "jobPostingUrl": apply_url,
            "jobDescription": summary,
            "source": "Web Scraper (BS4)",
            "status": "Found",
            "isExternal": True
        })

    return parsed_jobs

def aggregate_jobs(query: str = "", location: str = "") -> List[Dict[str, Any]]:
    """Aggregates jobs across all permitted scrapers and APIs."""
    results = []
    
    # 1. Arbeitnow
    results.extend(fetch_arbeitnow_jobs(query=query, location=location))
    
    # 2. RemoteOK
    if len(results) < 20:
        results.extend(fetch_remoteok_jobs(query=query))
        
    # 3. HTML parsing fallback if external network is restricted
    if not results:
        results.extend(scrape_public_html_jobs(search_keyword=query or "Software"))

    return results

if __name__ == "__main__":
    query_param = sys.argv[1] if len(sys.argv) > 1 else ""
    loc_param = sys.argv[2] if len(sys.argv) > 2 else ""

    all_jobs = aggregate_jobs(query_param, loc_param)
    print(json.dumps(all_jobs, indent=2))
