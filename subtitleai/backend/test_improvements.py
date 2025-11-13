#!/usr/bin/env python3
"""
Quick test script to verify all improvements are working
"""

import asyncio
import sys

def test_imports():
    """Test if all new modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        from app.exceptions import SubtitleAIException, ProjectNotFoundException
        from app.utils.logger import logger
        from app.services.cache_service import cache_service
        from app.services.whisper_service import whisper_service
        from app.schemas.project import ProjectResponse
        print("✅ All imports successful")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_config():
    """Test configuration"""
    print("\n🧪 Testing configuration...")
    
    try:
        from app.config import settings
        
        assert hasattr(settings, 'CACHE_TTL'), "CACHE_TTL missing"
        assert hasattr(settings, 'USE_WHISPER'), "USE_WHISPER missing"
        assert hasattr(settings, 'MAX_FILE_SIZE'), "MAX_FILE_SIZE missing"
        
        print(f"✅ Config loaded")
        print(f"   - Cache enabled: {settings.CACHE_ENABLED}")
        print(f"   - Whisper enabled: {settings.USE_WHISPER}")
        print(f"   - Max file size: {settings.MAX_FILE_SIZE / (1024*1024*1024):.1f}GB")
        return True
    except Exception as e:
        print(f"❌ Config test failed: {e}")
        return False

async def test_cache():
    """Test cache service"""
    print("\n🧪 Testing cache service...")
    
    try:
        from app.services.cache_service import cache_service
        
        # Test set
        await cache_service.set("test_key", {"data": "test"}, ttl=60)
        
        # Test get
        value = await cache_service.get("test_key")
        assert value == {"data": "test"}, "Cache value mismatch"
        
        # Test delete
        await cache_service.delete("test_key")
        value = await cache_service.get("test_key")
        assert value is None, "Cache delete failed"
        
        print("✅ Cache service working")
        return True
    except Exception as e:
        print(f"❌ Cache test failed: {e}")
        return False

def test_exceptions():
    """Test custom exceptions"""
    print("\n🧪 Testing custom exceptions...")
    
    try:
        from app.exceptions import (
            ProjectNotFoundException,
            FileTooLargeException,
            InvalidFileTypeException
        )
        
        # Test ProjectNotFoundException
        try:
            raise ProjectNotFoundException(123)
        except ProjectNotFoundException as e:
            assert e.status_code == 404
            assert "123" in e.detail
        
        # Test FileTooLargeException
        try:
            raise FileTooLargeException(1000, 500)
        except FileTooLargeException as e:
            assert e.status_code == 413
        
        print("✅ Custom exceptions working")
        return True
    except Exception as e:
        print(f"❌ Exception test failed: {e}")
        return False

def test_logger():
    """Test structured logger"""
    print("\n🧪 Testing structured logger...")
    
    try:
        from app.utils.logger import logger
        
        logger.info("test_log", key="value", number=123)
        logger.error("test_error", error="test")
        
        print("✅ Logger working")
        return True
    except Exception as e:
        print(f"❌ Logger test failed: {e}")
        return False

def test_database_models():
    """Test database models have indexes"""
    print("\n🧪 Testing database models...")
    
    try:
        from app.models.project import Project
        from app.models.subtitle import Subtitle
        
        # Check if __table_args__ exists (indexes)
        assert hasattr(Project, '__table_args__'), "Project indexes missing"
        assert hasattr(Subtitle, '__table_args__'), "Subtitle indexes missing"
        
        print("✅ Database models have indexes")
        return True
    except Exception as e:
        print(f"❌ Database model test failed: {e}")
        return False

async def run_all_tests():
    """Run all tests"""
    print("=" * 50)
    print("🚀 SubtitleAI Backend v2.0 - Test Suite")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("Imports", test_imports()))
    results.append(("Config", test_config()))
    results.append(("Cache", await test_cache()))
    results.append(("Exceptions", test_exceptions()))
    results.append(("Logger", test_logger()))
    results.append(("Database Models", test_database_models()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is ready!")
        print("\nMade by RagsPro")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(run_all_tests())
    sys.exit(exit_code)
