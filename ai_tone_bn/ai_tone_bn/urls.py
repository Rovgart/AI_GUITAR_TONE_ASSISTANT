"""
URL configuration for ai_tone_bn project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from app import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', views.TestView.as_view(), name="test"),
    path("api/LLM", views.LLMResponseView.as_view(), name="LLMResponse"),
    path("api/get_ir/<str:q>", views.ReadIrsFromDB.as_view(), name='Read IRs from DB'),
    path('api/login/', views.LoginView.as_view(), name="sign in"), 
    path("api/register", views.RegisterView.as_view(), name="register"),
    path("api/me", views.MeAPIView.as_view(), name="current_user"),
    path("api/change_credentials", views.UpdateUser.as_view(), name="update_credentials"),
    path("api/get_amp/<str:q>", views.ReadAmpsFromDB.as_view(), name="Read amps from db"),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

]