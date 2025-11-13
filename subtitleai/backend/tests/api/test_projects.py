from app.models.user import User
from app.models.project import Project

def test_get_projects_empty(client, db):
    user = User(email="test@test.com", name="Test")
    db.add(user)
    db.commit()
    # Test without auth should return 403 (Forbidden)
    response = client.get("/api/projects/")
    assert response.status_code == 403

def test_create_project(client, db):
    user = User(email="test@test.com", name="Test")
    db.add(user)
    db.commit()
    project = Project(user_id=user.id, title="Test", video_url="http://test.com/video.mp4")
    db.add(project)
    db.commit()
    assert project.id is not None
