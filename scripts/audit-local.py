"""Audit local static files with GEO's unchanged checks and scoring.

Use the Python environment containing geo-optimizer-skill==4.18.3.
Only HTTP fetching is replaced with filesystem responses. CDN/access checks
are deliberately untested. This is a predeployment audit, not a live score.
"""
import json
from pathlib import Path
from urllib.parse import urlparse, unquote
from unittest.mock import patch
import requests
from geo_optimizer.core.audit import run_full_audit
from geo_optimizer.models.results import CdnAiCrawlerResult
from geo_optimizer.cli.formatters import format_audit_json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'reports' / 'geo'

def local_fetch(url, *args, **kwargs):
    parsed = urlparse(url)
    if parsed.hostname != 'offerevo.com':
        return None, 'External HTTP fetch omitted in local audit'
    name = unquote(parsed.path).lstrip('/')
    file = (ROOT / name).resolve()
    if not file.is_relative_to(ROOT):
        return None, 'Outside site root'
    if file.is_dir():
        file /= 'index.html'
    response = requests.Response()
    response.url = url
    response.status_code = 200 if file.is_file() else 404
    response.encoding = 'utf-8'
    response._content = file.read_bytes() if file.is_file() else b'Not found'
    # No fabricated host headers or freshness signals.
    response.headers = {}
    return response, None

if __name__ == '__main__':
    import xml.etree.ElementTree as ET
    OUT.mkdir(parents=True, exist_ok=True)
    urls = [node.text for node in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
    results = []
    with patch('geo_optimizer.core.audit.fetch_url', local_fetch), patch(
        'geo_optimizer.core.audit.audit_cdn_ai_crawler', return_value=CdnAiCrawlerResult()
    ):
        for url in urls:
            result = run_full_audit(url)
            result_json = json.loads(format_audit_json(result))
            results.append({'url': url, 'score': result.score, 'error': result.error, 'score_breakdown': result.score_breakdown})
            if url == 'https://offerevo.com/':
                result_json['verification'] = {'mode': 'local-files', 'tool_version': '4.18.3', 'cdn_and_http_access': 'not tested', 'scoring_changes': False}
                (OUT / 'local-after.json').write_text(json.dumps(result_json, indent=2) + '\n')
            print(url, result.score)
    (OUT / 'local-pages.json').write_text(json.dumps(results, indent=2) + '\n')
