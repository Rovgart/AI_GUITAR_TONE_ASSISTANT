from rest_framework import serializers

class LoginRequestSerializer(serializers.Serializer):
    email=serializers.CharField()
    password=serializers.CharField()
class LoginResponseSerializer(serializers.Serializer):
    message=serializers.CharField()
class RegisterRequestSerializer(serializers.Serializer):
    username=serializers.CharField()
    email=serializers.CharField()
    password=serializers.CharField()

class ChangeCredentialsSerializer(serializers.Serializer):
    new_email=serializers.CharField()
    new_password=serializers.CharField()