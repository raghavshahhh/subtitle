"""Add improvements - indexes, new fields

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns to projects
    op.add_column('projects', sa.Column('transcription_method', sa.String(), nullable=True))
    op.execute("UPDATE projects SET transcription_method = 'gemini' WHERE transcription_method IS NULL")
    
    # Add indexes to projects
    op.create_index('idx_user_status', 'projects', ['user_id', 'status'])
    op.create_index('idx_user_created', 'projects', ['user_id', 'created_at'])
    
    # Add indexes to subtitles
    op.create_index('idx_project_time', 'subtitles', ['project_id', 'start_time'])
    op.create_index('idx_project_edited', 'subtitles', ['project_id', 'is_edited'])

def downgrade():
    # Remove indexes
    op.drop_index('idx_project_edited', 'subtitles')
    op.drop_index('idx_project_time', 'subtitles')
    op.drop_index('idx_user_created', 'projects')
    op.drop_index('idx_user_status', 'projects')
    
    # Remove columns
    op.drop_column('projects', 'transcription_method')
