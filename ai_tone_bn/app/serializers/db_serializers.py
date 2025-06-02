from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import re


class RegisterRequestSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        min_length=3,
        help_text="Username must be between 3-150 characters"
    )
    email = serializers.EmailField(
        help_text="Valid email address required"
    )
    password = serializers.CharField(
        min_length=8,
        write_only=True,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )

    def validate_username(self, value):
        """Validate username format and uniqueness"""
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores"
            )
        
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists"
            )
        
        return value

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists"
            )
        return value

    def validate_password(self, value):
        """Validate password strength"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value


class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="User's email address"
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="User's password"
    )


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)


class LoginResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField(
        read_only=True,
        help_text="JWT access token for authentication"
    )
    refresh_token = serializers.CharField(
        read_only=True,
        help_text="JWT refresh token for token renewal"
    )
    user = UserSerializer(
        read_only=True,
        help_text="User information"
    )


class ChangeCredentialsSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="Current email address"
    )
    new_email = serializers.EmailField(
        required=False,
        allow_blank=True,
        help_text="New email address (optional)"
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Current password"
    )
    new_password = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        style={'input_type': 'password'},
        help_text="New password (optional)"
    )

    def validate(self, data):
        """Validate that at least one field is being changed"""
        if not data.get('new_email') and not data.get('new_password'):
            raise serializers.ValidationError(
                "At least one of new_email or new_password must be provided"
            )
        return data

    def validate_new_email(self, value):
        """Validate new email uniqueness if provided"""
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists"
            )
        return value

    def validate_new_password(self, value):
        """Validate new password strength if provided"""
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(list(e.messages))
        return value


# Database/NAM Serializers
class NAMSerializer(serializers.Serializer):
    band = serializers.CharField(
        max_length=200,
        help_text="Name of the band to get gear recommendations for"
    )
    description = serializers.CharField(
        read_only=True,
        help_text="Description of the band's sound and recommended gear"
    )
    amp = serializers.CharField(
        read_only=True,
        help_text="Recommended amplifier model"
    )
    ir = serializers.CharField(
        read_only=True,
        help_text="Recommended impulse response"
    )

    def validate_band(self, value):
        """Validate band name"""
        if not value.strip():
            raise serializers.ValidationError("Band name cannot be empty")
        return value.strip()


class ReadAmpSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        max_length=200,
        help_text="Amplifier name/model"
    )
    brand = serializers.CharField(
        max_length=100,
        help_text="Amplifier brand/manufacturer"
    )
    model = serializers.CharField(
        max_length=100,
        help_text="Specific model name"
    )
    power_rating = serializers.IntegerField(
        help_text="Power rating in watts",
        allow_null=True,
        required=False
    )
    tube_type = serializers.CharField(
        max_length=50,
        help_text="Type of tubes used",
        allow_blank=True,
        required=False
    )
    channels = serializers.IntegerField(
        help_text="Number of channels",
        allow_null=True,
        required=False
    )
    description = serializers.CharField(
        help_text="Amplifier description",
        allow_blank=True,
        required=False
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class ReadAmpSerializerResponse(ReadAmpSerializer):
    """Extended serializer for API responses with additional metadata"""
    pass


class ReadAmpModelResponse(serializers.Serializer):
    """Wrapper serializer for single amp responses"""
    count = serializers.IntegerField(
        read_only=True,
        help_text="Number of amplifiers returned"
    )
    query = serializers.CharField(
        read_only=True,
        help_text="Search query used",
        required=False
    )
    field = serializers.CharField(
        read_only=True,
        help_text="Field searched in",
        required=False
    )
    case_sensitive = serializers.BooleanField(
        read_only=True,
        help_text="Whether search was case sensitive",
        required=False
    )
    total_count = serializers.IntegerField(
        read_only=True,
        help_text="Total number of amplifiers in database",
        required=False
    )
    offset = serializers.IntegerField(
        read_only=True,
        help_text="Pagination offset",
        required=False
    )
    limit = serializers.IntegerField(
        read_only=True,
        help_text="Pagination limit",
        required=False
    )
    amps = ReadAmpSerializerResponse(
        many=True,
        read_only=True,
        help_text="List of amplifiers"
    )

class ReadIrsRequest(serializers.Serializer):
    case_sensitive=serializers.BooleanField(
        read_only=True,
        help_text="Whether search was case sensitive",
        required=False
    )
    query=serializers.CharField(
        read_only=True,
        help_text="Search query used",
        required=False
    )
    field=serializers.CharField(
        read_only=True,
        help_text="Searching field",
        required=False
    )
class ReadIRSerializerResponse(serializers.Serializer):
    name=serializers.CharField(
        read_only=True,
        help_text="Name of an Impulse Response",
        required=False
    )
    cabinet_type=serializers.CharField(
        read_only=True,
        help_text="Cabinet type ",
        required=False,
    )
    microphone=serializers.CharField(
        read_only=True,
        help_text="Microphone ex. Shure SM57, Royer R-121, Senheiser M421",
        required=False,
    )
    description=serializers.CharField(
        read_only=True,
        help_text="Description of impulse response",
        required=False,
    )
class ReadIrsResponse(serializers.Serializer):
    count = serializers.IntegerField(
        read_only=True,
        help_text="Number of impulse responses returned",
        required=False,
    )
       
    query = serializers.CharField(
        read_only=True,
        help_text="Search query used",
        required=False
    )
    field = serializers.CharField(
        read_only=True,
        help_text="Field searched in",
        required=False
    )
    case_sensitive = serializers.BooleanField(
        read_only=True,
        help_text="Whether search was case sensitive",
        required=False
    )
    total_count = serializers.IntegerField(
        read_only=True,
        help_text="Total number of impulse responses in database",
        required=False
    )
    offset = serializers.IntegerField(
        read_only=True,
        help_text="Pagination offset",
        required=False
    )
    limit = serializers.IntegerField(
        read_only=True,
        help_text="Pagination limit",
        required=False
    )
    irs = ReadIRSerializerResponse(
        many=True,
        read_only=True,
        help_text="List of amplifiers"
    )
    

class Read(serializers.Serializer):
    brand = serializers.CharField(
        max_length=100,
        required=False,
        help_text="Filter by brand"
    )
    model = serializers.CharField(
        max_length=100,
        required=False,
        help_text="Filter by model"
    )
    power_rating__gte = serializers.IntegerField(
        required=False,
        help_text="Minimum power rating"
    )
    power_rating__lte = serializers.IntegerField(
        required=False,
        help_text="Maximum power rating"
    )
    channels = serializers.IntegerField(
        required=False,
        help_text="Number of channels"
    )
    tube_type = serializers.CharField(
        max_length=50,
        required=False,
        help_text="Tube type"
    )

    def validate(self, data):
        """Validate that at least one filter is provided"""
        if not any(data.values()):
            raise serializers.ValidationError(
                "At least one filter parameter must be provided"
            )
        return data


class TestSerializer(serializers.Serializer):
    message = serializers.CharField(
        default="Test endpoint",
        help_text="Test message"
    )



class ErrorResponseSerializer(serializers.Serializer):
    error = serializers.CharField(
        help_text="Error message"
    )
    details = serializers.CharField(
        required=False,
        help_text="Additional error details"
    )


class ValidationErrorResponseSerializer(serializers.Serializer):
    error = serializers.CharField(
        help_text="Error message"
    )
    details = serializers.DictField(
        help_text="Field-specific validation errors"
    )


class SuccessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(
        help_text="Success message"
    )


class MessageResponseSerializer(serializers.Serializer):
    message = serializers.CharField(
        help_text="Response message"
    )