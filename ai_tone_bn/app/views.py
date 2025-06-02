from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from app.services.user_service import UserService
from app.services.jwt_service import JWT_Service
from app.services.read_service import ReadService
from app.services.GearRecommender import NAMGearRecommender
from django.core.cache import cache
from django.db import DatabaseError
from app.serializers import db_serializers
from app.serializers.db_serializers import TestSerializer
from drf_spectacular.utils import extend_schema
from django.views.generic import (
    TemplateView, ListView, DetailView, CreateView, 
    UpdateView, DeleteView, FormView
)

from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from app.serializers import auth_serializers, db_serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # Will handle auth manually
from rest_framework import status

import logging


user_serv = UserService()
jwt_service = JWT_Service()
gear_recommender = NAMGearRecommender()
read_service = ReadService()
logger = logging.getLogger(__name__)

# Create your views here.

class TestView(APIView):
    @extend_schema(
        tags=["test"],
        request=TestSerializer
    )
    def get(self, request): 
        return HttpResponse(content="I love Wsiz", status=200)
    
# views.py

class MeAPIView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"detail": "Authorization header missing or invalid"}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ")[1]
        user = JWT_Service.get_user_from_token(token)

        if not user:
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    def get(request):
        user=request.user
        return Response({
            "id":user.id,
            "email":user.email,
            "username":user.username,
        }, status=status.HTTP_200_OK)

class RegisterView(APIView):
    @extend_schema(
        tags=["Sign up"],
        request=auth_serializers.RegisterRequestSerializer,
        responses={200: str, 401: str, 500: str},
        description="Creates user "
    )
    def post(self, request):
        if request.method == "POST":
            username = request.data.get("username")
            email = request.data.get("email")
            password = request.data.get("password")
            confirmPassword=request.data.get("confirmPassword")
            print(request.data["email"])
            authenticated_user = user_serv.create_user(username, email, password)
        if authenticated_user:
            return HttpResponse(authenticated_user, status=200)
        else:
            return HttpResponse("Authentication failed", status=401)

class LoginView(APIView):
    @extend_schema(
        tags=["Sign In"],
        request=auth_serializers.LoginRequestSerializer,
        responses={
            200: auth_serializers.LoginResponseSerializer,
            400: "Invalid request data",
            401: "Authentication failed",
            429: "Too many login attempts",
            500: "Internal server error"
        },
        description="Authenticates user and returns access and refresh tokens"
    )
    def post(self, request):
        try:
            serializer = auth_serializers.LoginRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {"error": "Invalid input", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            if self._is_rate_limited(request, email):
                return Response(
                    {"error": "Too many login attempts. Please try again later."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            authenticated_user = user_serv.authenticate_user(
                email=email,
                password=password
            )
            
            if authenticated_user:
                access_token = jwt_service.create_access_token(authenticated_user)
                refresh_token = jwt_service.create_refresh_token(authenticated_user)
                
                self._clear_failed_attempts(request, email)
                
                logger.info(f"Successful login for user: {email}")
                
                response_data = {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "id": authenticated_user.id,
                        "email": authenticated_user.email,
                        "username": authenticated_user.username,
                    }
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                self._track_failed_attempt(request, email)
                
                logger.warning(f"Failed login attempt for: {email}")
                return Response(
                    {"error": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            logger.error(f"Login error for {request.data.get('email', 'unknown')}: {str(e)}")
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _is_rate_limited(self, request, email):
        """Check if user/IP is rate limited"""
        ip_address = self._get_client_ip(request)
        
        email_key = f"login_attempts_email_{email}"
        ip_key = f"login_attempts_ip_{ip_address}"
        
        email_attempts = cache.get(email_key, 0)
        ip_attempts = cache.get(ip_key, 0)
        
        return email_attempts >= 5 or ip_attempts >= 10
    
    def _track_failed_attempt(self, request, email):
        """Track failed login attempts"""
        ip_address = self._get_client_ip(request)
        
        email_key = f"login_attempts_email_{email}"
        ip_key = f"login_attempts_ip_{ip_address}"
        
        cache.set(email_key, cache.get(email_key, 0) + 1, 900)  
        cache.set(ip_key, cache.get(ip_key, 0) + 1, 900)
    
    def _clear_failed_attempts(self, request, email):
        """Clear failed login attempts after successful login"""
        ip_address = self._get_client_ip(request)
        
        email_key = f"login_attempts_email_{email}"
        ip_key = f"login_attempts_ip_{ip_address}"
        
        cache.delete(email_key)
        cache.delete(ip_key)
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class LLMResponseView(APIView):
    @extend_schema(
        tags=["LLM"],
        request=db_serializers.NAMSerializer,
        responses={
            200: db_serializers.NAMSerializer,
            400: "Bad Request - Band name required",
            500: "Internal Server Error"
        },
        description="Get NAM gear recommendations for a band"
    )
    def post(self, request):
        try:
            band = request.data.get("band")
            
            if not band:
                return Response(
                    {"error": "Band name is required"}, 
                    status=status.HTTP_400_BAD_REQUEST  
                )
            
            recommendations = gear_recommender.get_nam_recommendations(band, return_parsed=True)
            
            if 'error' in recommendations:
                logger.error(f"LLM service error for band '{band}': {recommendations['error']}")
                return Response(
                    {"error": "Failed to get recommendations"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            response_data = {
                "band": band,
                "description": recommendations['description'],
                "amp": recommendations['amp'],
                "ir": recommendations['ir']
            }
            
            logger.info(f"Successfully generated recommendations for band: {band}")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Unexpected error in LLMResponseView: {str(e)}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UpdateUser(APIView):
    @extend_schema(
        tags=["Change Credentials"],
        request=auth_serializers.ChangeCredentialsSerializer,
        responses={
            200: "Successfully updated credentials",
            401: "Unauthorized",
            400: "Bad Request - Band name required",
            500: "Internal Server Error"
        },
        description="Updates user credentials"
    )
    def put(self, request):
        try:
            if request.method == "PUT":
                data = {
                    'email': request.data.get("email"),
                    'new_email': request.data.get("new_email"),
                    'password': request.data.get("password"),
                    'new_password': request.data.get("new_password")
                }
                
                changed_cred = user_serv.changeUsersCredentials(
                    email=data["email"], 
                    new_email=data["new_email"], 
                    password=data["password"], 
                    new_password=data["new_password"]
                )
                if changed_cred:
                    return JsonResponse(data={"message": changed_cred})
        except Exception as e:
            return JsonResponse(data={"message": f"Server error: {str(e)}"})



class ReadAmpsFromDB(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description='Search query for amplifier names',
                required=True
            ),
            OpenApiParameter(
                name='field',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Field to search in (default: name)',
                required=False
            ),
            OpenApiParameter(
                name='case_sensitive',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Case sensitive search (default: false)',
                required=False
            )
        ],
        tags=["Amplifier"],
        responses={
            200: db_serializers.ReadAmpModelResponse,
            400: "Bad Request",
            500: "Internal Server Error"
        },
        description="Search for amplifiers by query string"
    )
    def get(self, request, q):
        """
        Retrieve NAM amplifiers from database based on query string.
        
        Args:
            q (str): Search query string to match amplifier names/models
        """
        try:
            field = request.query_params.get('field', 'brand')
            case_sensitive = request.query_params.get('case_sensitive', 'false').lower() == 'true'
            

            amps = read_service.search_amps(
                search_term=q,
                field=field,

            )
            
            serializer = db_serializers.ReadAmpSerializerResponse(amps, many=True)
            
            response_data = {
                'count': len(serializer.data),
                'query': q,
                'field': field,
                'case_sensitive': case_sensitive,
                'data': serializer.data
            }
            
            logger.info(f"Retrieved {len(amps)} amps for query '{q}' in field '{field}'")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Invalid search parameters for query '{q}': {str(e)}")
            return Response({
                'error': 'Invalid search parameters',
                'query': q,
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DatabaseError as e:
            logger.error(f"Database error retrieving amps for query '{q}': {str(e)}")
            return Response({
                'error': 'Database error occurred',
                'query': q
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Unexpected error retrieving amps for query '{q}': {str(e)}")
            return Response({
                'error': 'Failed to retrieve amplifiers',
                'query': q
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReadAmpByIdView(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='amp_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='Amplifier ID',
                required=True
            )
        ],
        tags=["Amplifier"],
        responses={
            200: db_serializers.ReadAmpModelResponse,
            400: "Bad Request - Invalid ID",
            404: "Amplifier not found",
            500: "Internal Server Error"
        },
        description="Get amplifier by ID"
    )
    def get(self, request, amp_id):
        """
        Retrieve a single amplifier by ID.
        
        Args:
            amp_id (int): The ID of the amplifier to retrieve
        """
        try:
            amp = read_service.get_amp_by_id(amp_id)
            
            if amp is None:
                return Response({
                    'error': 'Amplifier not found',
                    'amp_id': amp_id
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = db_serializers.ReadAmpSerializerResponse(amp)
            
            logger.info(f"Retrieved amp with ID {amp_id}")
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Invalid amp_id '{amp_id}': {str(e)}")
            return Response({
                'error': 'Invalid amplifier ID',
                'amp_id': amp_id,
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DatabaseError as e:
            logger.error(f"Database error retrieving amp ID {amp_id}: {str(e)}")
            return Response({
                'error': 'Database error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Unexpected error retrieving amp ID {amp_id}: {str(e)}")
            return Response({
                'error': 'Failed to retrieve amplifier'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReadAmpsListView(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='limit',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Maximum number of amps to return',
                required=False
            ),
            OpenApiParameter(
                name='offset',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description='Number of amps to skip',
                required=False
            )
        ],
        tags=["Amplifier"],
        responses={
            200: db_serializers.ReadAmpSerializerResponse,
            400: "Bad Request - Invalid pagination parameters",
            500: "Internal Server Error"
        },
        description="Get all amplifiers with optional pagination"
    )
    def get(self, request):
        """
        Retrieve all amplifiers with optional pagination.
        """
        try:

            limit = request.query_params.get('limit')
            offset = int(request.query_params.get('offset', 0))
            
            if limit:
                limit = int(limit)
            
            # Use improved get_all_amps method
            amps = read_service.get_all_amps(limit=limit, offset=offset)
            total_count = read_service.count_amps()
            
            serializer = db_serializers.ReadAmpSerializerResponse(amps, many=True)
            
            response_data = {
                'count': len(serializer.data),
                'total_count': total_count,
                'offset': offset,
                'limit': limit,
                'amps': serializer.data
            }
            
            logger.info(f"Retrieved {len(amps)} amps (offset: {offset}, limit: {limit})")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Invalid pagination parameters: {str(e)}")
            return Response({
                'error': 'Invalid pagination parameters',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DatabaseError as e:
            logger.error(f"Database error retrieving amps list: {str(e)}")
            return Response({
                'error': 'Database error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Unexpected error retrieving amps list: {str(e)}")
            return Response({
                'error': 'Failed to retrieve amplifiers'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReadAmpsByQueryView(APIView):
    @extend_schema(
        tags=["Amplifier"],
        request=db_serializers.Read,
        responses={
            200: db_serializers.ReadAmpSerializerResponse,
            400: "Bad Request - Invalid query parameters",
            500: "Internal Server Error"
        },
        description="Filter amplifiers by multiple criteria"
    )
    def post(self, request):
        """
        Retrieve amplifiers based on multiple filter criteria.
        
        Expected request body:
        {
            "brand": "Fender",
            "model": "Twin Reverb",
            "power_rating__gte": 50
        }
        """
        try:
            query = request.data
            
            if not query:
                return Response({
                    'error': 'Query parameters required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Use improved get_amps_from_db method
            amps = read_service.get_amps_from_db(query)
            
            serializer = db_serializers.ReadAmpSerializer(amps, many=True)
            
            response_data = {
                'count': len(serializer.data),
                'query': query,
                'amps': serializer.data
            }
            
            logger.info(f"Retrieved {len(amps)} amps with query: {query}")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Invalid query parameters: {str(e)}")
            return Response({
                'error': 'Invalid query parameters',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DatabaseError as e:
            logger.error(f"Database error with query {query}: {str(e)}")
            return Response({
                'error': 'Database error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Unexpected error with query {query}: {str(e)}")
            return Response({
                'error': 'Failed to retrieve amplifiers'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ReadIrsFromDB(APIView):
    @extend_schema(
        tags=["Impulse Responses"],
         parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                description='Search query for impulse response names',
                required=True
            ),
            OpenApiParameter(
                name='field',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Field to search in (default: name)',
                required=False
            ),
            OpenApiParameter(
                name='case_sensitive',
                type=OpenApiTypes.BOOL,
                location=OpenApiParameter.QUERY,
                description='Case sensitive search (default: false)',
                required=False
            )
        ],
        request=db_serializers.Read,
        responses=db_serializers.ReadIrsResponse,
        description="Filter impulse responses by multiple criteria"
        
    )
    def get(self, request,q):
        try:
            field=request.query_params.get("field")
            case_sensitive = request.query_params.get('case_sensitive', 'false').lower() == 'true'

            irs = read_service.search_irs(
                search_term=q,

            )            
            serializer = db_serializers.ReadIRSerializerResponse(irs, many=True)
            response_data = {
                'count': len(serializer.data),
                'query': q,
                'field': field,
                'case_sensitive': case_sensitive,
                'data': serializer.data
            }
            
            logger.info(f"Retrieved {len(irs)} amps for query '{q}' in field '{field}'")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            logger.warning(f"Invalid search parameters for query '{q}': {str(e)}")
            return Response({
                'error': 'Invalid search parameters',
                'query': q,
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except DatabaseError as e:
            logger.error(f"Database error retrieving amps for query '{q}': {str(e)}")
            return Response({
                'error': 'Database error occurred',
                'query': q
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            logger.error(f"Unexpected error retrieving amps for query '{q}': {str(e)}")
            return Response({
                'error': 'Failed to retrieve amplifiers',
                'query': q
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return

            
        