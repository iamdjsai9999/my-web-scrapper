# app.py

from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import datetime
import requests
from fake_useragent import UserAgent
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    url_to_scrape = request.form['url']
    if not url_to_scrape:
        return jsonify({'error': 'URL not provided'})

    try:
        links = scrape_links(url_to_scrape)
        return jsonify({'message': 'Scraping completed!', 'links': links})
    except Exception as e:
        return jsonify({'error': str(e)})

def get_random_user_agent():
    ua = UserAgent()
    return ua.random

def scrape_links(url):
    try:
        headers = {'User-Agent': get_random_user_agent()}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        links = [urljoin(response.url, link.get('href')) for link in soup.find_all('a') if link.get('href') and not link.get('href').startswith('javascript:')]
        return links
    except requests.RequestException as e:
        raise Exception('Request Error: ' + str(e))
    except Exception as e:
        raise Exception('An error occurred: ' + str(e))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
