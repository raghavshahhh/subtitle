# SubtitleAI Monitoring & Analytics Guide

## 📊 Monitoring Stack

### Built-in Monitoring
- ✅ Prometheus metrics endpoint (`/metrics`)
- ✅ Health check endpoint (`/api/health`)
- ✅ Request logging
- ✅ Error tracking
- ✅ Performance metrics

---

## 🔍 Metrics Available

### HTTP Metrics
```
http_requests_total{method, endpoint, status}
http_request_duration_seconds{method, endpoint}
```

### Application Metrics
```
video_uploads_total{status}
subtitle_generations_total{status}
subtitle_exports_total{format}
```

### System Metrics
- Request count by endpoint
- Response time distribution
- Error rate
- Upload success/failure rate
- Export format distribution

---

## 🚀 Quick Setup

### Option 1: Grafana Cloud (Recommended - Free Tier)

1. **Sign up**: [grafana.com](https://grafana.com)

2. **Add Prometheus Data Source**:
   - URL: `https://your-backend.com/metrics`
   - Scrape interval: 15s

3. **Import Dashboard**:
   - Use dashboard ID: 1860 (Node Exporter)
   - Or create custom dashboard

4. **Set Alerts**:
   - High error rate (>5%)
   - Slow response time (>2s)
   - Upload failures

### Option 2: Self-Hosted Prometheus + Grafana

**docker-compose.monitoring.yml:**
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'subtitleai-backend'
    static_configs:
      - targets: ['your-backend.com:8000']
    metrics_path: '/metrics'
```

**Start monitoring:**
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

---

## 📈 Key Metrics to Monitor

### 1. Availability
- **Health check status**: Should always return 200
- **Uptime percentage**: Target >99.9%

**Alert Rule:**
```yaml
- alert: ServiceDown
  expr: up{job="subtitleai-backend"} == 0
  for: 1m
  annotations:
    summary: "SubtitleAI backend is down"
```

### 2. Performance
- **Response time**: P50, P95, P99
- **Target**: P95 < 500ms for API calls

**Alert Rule:**
```yaml
- alert: SlowRequests
  expr: http_request_duration_seconds{quantile="0.95"} > 2
  for: 5m
  annotations:
    summary: "95th percentile response time > 2s"
```

### 3. Error Rate
- **Target**: < 1% error rate
- **Monitor**: 4xx and 5xx responses

**Alert Rule:**
```yaml
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 5m
  annotations:
    summary: "Error rate > 5%"
```

### 4. Upload Success Rate
- **Target**: > 95% success rate
- **Monitor**: Failed uploads

**Alert Rule:**
```yaml
- alert: HighUploadFailureRate
  expr: rate(video_uploads_total{status="failed"}[10m]) > 0.1
  for: 5m
  annotations:
    summary: "Upload failure rate > 10%"
```

---

## 🔔 Alerting Setup

### Option 1: Email Alerts (Grafana)

1. Go to Grafana → Alerting → Contact Points
2. Add email contact point
3. Configure SMTP settings
4. Test alert

### Option 2: Slack Alerts

1. Create Slack webhook URL
2. Add to Grafana contact points
3. Configure alert rules

### Option 3: PagerDuty (Production)

1. Create PagerDuty integration
2. Add integration key to Grafana
3. Set up escalation policies

---

## 📊 Sample Grafana Dashboard

### Panels to Include:

1. **Request Rate**
   - Query: `rate(http_requests_total[5m])`
   - Type: Graph

2. **Response Time**
   - Query: `histogram_quantile(0.95, http_request_duration_seconds)`
   - Type: Graph

3. **Error Rate**
   - Query: `rate(http_requests_total{status=~"5.."}[5m])`
   - Type: Graph

4. **Upload Success Rate**
   - Query: `rate(video_uploads_total{status="success"}[5m])`
   - Type: Stat

5. **Active Users**
   - Query: `count(http_requests_total{endpoint="/api/projects/"})`
   - Type: Stat

---

## 🔍 Log Management

### Structured Logging

Already configured in backend:
```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Log Aggregation Options

#### Option 1: Papertrail (Free Tier)
```bash
# Add to backend startup
export PAPERTRAIL_HOST=logs.papertrailapp.com
export PAPERTRAIL_PORT=12345
```

#### Option 2: Logtail
```bash
# Install
pip install logtail-python

# Configure
from logtail import LogtailHandler
handler = LogtailHandler(source_token='your_token')
logger.addHandler(handler)
```

#### Option 3: ELK Stack (Self-hosted)
- Elasticsearch: Store logs
- Logstash: Process logs
- Kibana: Visualize logs

---

## 🎯 Performance Monitoring

### Frontend (Vercel Analytics)

Already available in Vercel dashboard:
- Page load times
- Core Web Vitals
- User sessions
- Geographic distribution

### Backend (Custom Metrics)

Track in code:
```python
from app.middleware.monitoring import track_upload, track_export

# Track upload
track_upload("success")

# Track export
track_export("srt")
```

---

## 🔐 Security Monitoring

### What to Monitor:
- Failed login attempts
- Rate limit hits
- Unusual traffic patterns
- Large file uploads
- API key usage

### Setup Alerts:
```yaml
- alert: SuspiciousActivity
  expr: rate(http_requests_total{status="401"}[5m]) > 10
  for: 2m
  annotations:
    summary: "High rate of failed authentication"
```

---

## 💰 Cost Monitoring

### Track:
- API usage (Gemini, AssemblyAI)
- Storage usage (R2)
- Database size
- Bandwidth usage

### Tools:
- Cloudflare Analytics (R2)
- Supabase Dashboard
- Railway/Render metrics

---

## 📱 Status Page

### Option 1: Statuspage.io
- Free tier available
- Automated monitoring
- Incident management

### Option 2: Self-hosted (Uptime Kuma)
```bash
docker run -d --restart=always \
  -p 3002:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

---

## 🧪 Testing Monitoring

### Test Health Check:
```bash
curl https://your-backend.com/api/health
```

### Test Metrics:
```bash
curl https://your-backend.com/metrics
```

### Load Testing:
```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

**load-test.js:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  let res = http.get('https://your-backend.com/api/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## 📋 Monitoring Checklist

- [ ] Prometheus metrics endpoint working
- [ ] Grafana dashboard created
- [ ] Alert rules configured
- [ ] Email/Slack notifications set up
- [ ] Log aggregation configured
- [ ] Status page created
- [ ] Performance baselines established
- [ ] Load testing completed
- [ ] Security monitoring active
- [ ] Cost tracking enabled

---

## 🆘 Troubleshooting

### Metrics not showing:
1. Check `/metrics` endpoint is accessible
2. Verify Prometheus can reach backend
3. Check firewall rules

### Alerts not firing:
1. Test alert rules manually
2. Verify contact points configured
3. Check alert evaluation interval

### High memory usage:
1. Check for memory leaks
2. Review log retention
3. Optimize database queries

---

## 📚 Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [FastAPI Monitoring](https://fastapi.tiangolo.com/advanced/monitoring/)
- [Vercel Analytics](https://vercel.com/analytics)

---

## 🎉 You're Monitoring!

Your SubtitleAI app now has comprehensive monitoring. Set up alerts and dashboards to stay on top of your application's health!
