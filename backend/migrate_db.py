import sqlite3

def migrate():
    conn = sqlite3.connect("sql_app.db")
    cursor = conn.cursor()
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(candidate_profiles);")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Add missing columns
    if "email" not in columns:
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN email VARCHAR;")
        print("Added email column")
    
    if "phone" not in columns:
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN phone VARCHAR;")
        print("Added phone column")
        
    if "resume_storage_path" not in columns:
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN resume_storage_path VARCHAR;")
        print("Added resume_storage_path column")
        
    conn.commit()
    conn.close()
    print("Migration complete")

if __name__ == "__main__":
    migrate()
