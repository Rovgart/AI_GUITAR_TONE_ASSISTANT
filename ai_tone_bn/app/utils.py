import bcrypt
def hash_password(password:str):
    try:
        salt=bcrypt.gensalt()
        hashed=bcrypt.hashpw(password.encode("utf-8"),salt)
    except Exception as e:
        raise Exception(f"Error hashing password: {str(e)}")
    return hashed
    
    
    