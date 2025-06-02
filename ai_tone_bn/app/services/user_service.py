from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.tokens import default_token_generator
from typing import Optional, Dict, Any

import logging
from app.utils import hash_password
User=get_user_model()
logger = logging.getLogger(__name__)
class UserService:
    @classmethod
    def user_exists(cls,email:str)->bool:
        if User.objects.filter(email=email).exists():
            raise ValidationError("User with this email already exists")
    def get_user_by_id(user_id:int):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    @classmethod    
    def create_user(cls,username:str,email:str, password:str)->User:
        try:
            with transaction.atomic():
                user_exists=cls.user_exists(email)
                if user_exists:
                    return None
                if not email:
                    raise ValueError("The email field must be set")
                
                user=User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                user.save();
                logger.info(f"User created successfully: {email}")
                return user
        except Exception as e:
            logger.error(f"Error creating user {email}: {str(e)}")
    @classmethod
    def authenticate_user(cls, email: str, password: str):
        """
        Authenticate by email using manual password check
        """
        try:


            user = User.objects.get(email=email)
            print(user)
            print(f"User: {user}")

        # Skip Django's authenticate and check password directly
            if check_password(password, user.password):
                logger.info(f"User authenticated successfully: {email}")
                return user
            else:
                logger.warning(f"Invalid password for user: {email}")
                return None
            
        except User.DoesNotExist:
            logger.warning(f"User not found: {email}")
            return None
        except Exception as e:
            logger.error(f"Error during authentication for {email}: {str(e)}")
            return None
    @classmethod
    def changeUsersCredentials(cls, email:str, new_email:str, password:str, new_password:str):
        """
            Change users password and email for security purposes
        Args:
            email (str): Users email
            password (str): Users password
            repeatPassword (str): Repeat users password 
            
        Returns:
            Message: HTTP Response with proper code 
        """
        try:
            user=cls.authenticate_user(email=email, password=password)
            if not user:
                return {"success":False, "message":"Authentication failed "}
            if new_email:
                user.email=new_email
            if new_password:
                user.set_password(new_password)
            
            user.save()
            return {"success":True, "message":f"User credentials updated successfully"}
        except Exception as e:
            return {"success":False, "message":f"An error occurred: {str(e)}"}
        
        

            

        