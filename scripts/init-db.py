from backend.database import engine, Base, SessionLocal
from backend.models import User
from backend.auth import get_password_hash
from backend.config import settings

def init_db():
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Create default admin if not exists
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        print(f"Creating admin user: {settings.ADMIN_EMAIL}")
        hashed_pw = get_password_hash(settings.ADMIN_PASSWORD)
        admin_user = User(email=settings.ADMIN_EMAIL, hashed_password=hashed_pw)
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully.")
    else:
        print("Admin user already exists.")
    db.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
