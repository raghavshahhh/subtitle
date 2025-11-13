"""
API endpoint tests
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns correct response"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["version"] == "2.0.0"
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["version"] == "2.0.0"


class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    def test_signup_missing_fields(self):
        """Test signup with missing fields"""
        response = client.post("/api/auth/signup", json={})
        assert response.status_code == 422  # Validation error
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = client.post("/api/auth/login", json={})
        assert response.status_code == 422  # Validation error


class TestProjectEndpoints:
    """Test project endpoints"""
    
    def test_get_projects_unauthorized(self):
        """Test getting projects without authentication"""
        response = client.get("/api/projects/")
        # Should return 401 or empty list depending on implementation
        assert response.status_code in [200, 401]


class TestUploadEndpoints:
    """Test upload endpoints"""
    
    def test_upload_without_file(self):
        """Test upload endpoint without file"""
        response = client.post("/api/upload/video")
        assert response.status_code == 422  # Missing file


class TestRateLimiting:
    """Test rate limiting"""
    
    def test_rate_limit_not_exceeded(self):
        """Test that normal requests work"""
        response = client.get("/api/health")
        assert response.status_code == 200
    
    def test_multiple_requests(self):
        """Test multiple requests don't immediately hit rate limit"""
        for _ in range(5):
            response = client.get("/api/health")
            assert response.status_code == 200


class TestErrorHandling:
    """Test error handling"""
    
    def test_404_endpoint(self):
        """Test non-existent endpoint"""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
    
    def test_invalid_method(self):
        """Test invalid HTTP method"""
        response = client.delete("/")
        assert response.status_code == 405  # Method not allowed
