import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urldefrag

visited_links = set()

def normalize_url(base_url, link):
    full_url = urljoin(base_url, link)
    clean_url, _ = urldefrag(full_url)  # Remove fragments like #section
    return clean_url.rstrip('/')

def is_internal(link, base_domain):
    netloc = urlparse(link).netloc
    return netloc == "" or netloc == base_domain

def get_links(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
    except Exception as e:
        print(f"Error accessing {url}: {e}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    links = []
    for tag in soup.find_all('a', href=True):
        href = tag['href']
        full_url = normalize_url(url, href)
        links.append(full_url)
    return links

def crawl(url, base_domain):
    if url in visited_links:
        return
    print(f"Visiting: {url}")
    visited_links.add(url)

    for link in get_links(url):
        if link not in visited_links and is_internal(link, base_domain):
            crawl(link, base_domain)

# === Example usage ===
if __name__ == "__main__":
    start_url = "https://knowledge.neuronsinc.com/"  # ← Replace with your target
    base_domain = urlparse(start_url).netloc
    crawl(start_url, base_domain)

    print("\n✅ Collected links:")
    print(len(visited_links))
    for link in sorted(visited_links):
        print(link)