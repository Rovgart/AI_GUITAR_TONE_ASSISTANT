import jwt
import os
from django.conf import settings
import logging 
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Optional, Dict, Any
from django.contrib.auth import get_user_model

load_dotenv()
logger = logging.getLogger(__name__)
User= get_user_model()
class JWT_Service:
    ALGORITHM=os.getenv("ALGORITHM")
    SECRET_KEY=os.getenv("JWT_SECRET")
    ACCESS_TOKEN_LIFETIME = getattr(settings, 'JWT_ACCESS_TOKEN_LIFETIME', timedelta(hours=1))
    REFRESH_TOKEN_LIFETIME = getattr(settings, 'JWT_REFRESH_TOKEN_LIFETIME', timedelta(days=7))
    @classmethod
    def encode_jwt(cls, user, expires_delta=None):
        """
        Encode JWT token with user data and expiration
        Args:
            user: User object containing the data to encode
            expires_delta: Custom expiration time (optional)
        Returns:
            Encoded JWT token string
        """
        try:
            correct_payload = {
                'user_id': user.id,
                'email': user.email,
                'username': user.username,
                'iat': datetime.utcnow()
            }
            
            to_encode = correct_payload.copy()
            

            if expires_delta:
                expire = datetime.utcnow() + expires_delta  # Fixed: removed comma
            else:
                expire = datetime.utcnow() + cls.ACCESS_TOKEN_LIFETIME
                

            to_encode.update({
                'exp': expire,
                'type': 'access_token'
            })
            
            encoded_jwt = jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Error encoding JWT token: {str(e)}")  # Changed to error level
            raise JWTException(f"Failed to encode token: {str(e)}")

    @classmethod
    def decode_jwt(cls,encoded_jwt:str)->dict[str, any]:
        """
        Decode and validate JWT token
        
        Args: 
            encoded_jwt: The JWT token string to decode
        Returns:
            Decoded payload dictionary
        
        Raises:
            JWTException: If token is invalid,expired, or malformed
        """
        try:
            decoded_payload=jwt.decode(
                encoded_jwt,
                cls.SECRET_KEY,
                algorithms=[cls.ALGORITHM]
            )
            return decoded_payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token has expired")
            raise JWTException(f"Token has expired: {str(e)}")
        
        except jwt.InvalidTokenError:
            logger.warning(f"Invalid JWT token: {str(e)}")
            raise JWTException(f"Invalid token")
        except Exception as e:
            return None
    @classmethod
    def create_access_token(cls, user:User)->str:
        """
        Create access token for user
        
        Args:
            user: Django User instance
            
        Returns:
            Access token string
        Payload:{
            user_id:user.id,
            email:user.email,
        }
        """
        return cls.encode_jwt(user,cls.ACCESS_TOKEN_LIFETIME)
    @classmethod
    def create_refresh_token(cls, payload)->str:
        """
        Create refresh token for user
        
        Args:
            user: Django User instance
        Returns:
            Refresh Token String
        payload={
            'user_id':user.id,
            'email':user.email,
            'type':'refresh_token'
        }
        """
        return cls.encode_jwt(payload, cls.REFRESH_TOKEN_LIFETIME)
    @classmethod
    def get_user_from_token(cls, token:str):
        try:
            payload=cls.decode_jwt(token)
            user_id=payload.get("user_id")
            if user_id:
                user= User.objects.get(id=user_id, is_active=True)
                return user
        except (JWTException, User.DoesNotExist) as e:
            return None
        except Exception as e:
            logger.error(f"Error getting user from token: {str(e)}")
            return None
    @classmethod
    def verify_token(cls,token):
        """
        Verify if token is valid and not expired
        
        Args:
            token: JWT token to verify
        Returns:
            True if token is valid 
        """
        try:
            cls.decode_jwt(token)
            return True
        except JWTException:
            return False

class JWTException(Exception):
    """Custom exception for JWT-related errors"""
    pass;