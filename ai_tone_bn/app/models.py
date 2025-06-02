from typing import Any
from django.db import models
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(models.Model):
    username=models.CharField(max_length=50, unique=True)
    email=models.CharField(max_length=50, unique=True)
    password=models.CharField(max_length=50, unique=True)
    created_at=models.DateTimeField(auto_now_add=True)


class Amp(models.Model):
    """NAM Amplifier model for storing amplifier information"""
    
    name = models.CharField(
        max_length=200,
        help_text="Amplifier name/model",
        db_index=True
    )
    brand = models.CharField(
        max_length=100,
        help_text="Amplifier brand/manufacturer",
        db_index=True
    )
    model = models.CharField(
        max_length=100,
        help_text="Specific model name",
        db_index=True
    )
    power_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        help_text="Power rating in watts"
    )
    tube_type = models.CharField(
        max_length=50,
        blank=True,
        help_text="Type of tubes used (e.g., 12AX7, EL34)"
    )
    channels = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Number of channels"
    )
    description = models.TextField(
        blank=True,
        help_text="Amplifier description and characteristics"
    )
    release_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1900), MaxValueValidator(2030)],
        help_text="Year the amplifier was released"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'app_amp'
        verbose_name = 'Amplifier'
        verbose_name_plural = 'Amplifiers'
        ordering = ['brand', 'model']
        indexes = [
            models.Index(fields=['brand', 'model']),
            models.Index(fields=['power_rating']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.brand} {self.model}" if self.model else self.name
    
    def get_full_name(self):
        """Return the full amplifier name"""
        if self.model and self.model != self.name:
            return f"{self.brand} {self.model}"
        return self.name
    
    @property
    def power_category(self):
        """Categorize amplifier by power rating"""
        if not self.power_rating:
            return "Unknown"
        elif self.power_rating <= 15:
            return "Practice/Studio"
        elif self.power_rating <= 30:
            return "Small Venue"
        elif self.power_rating <= 50:
            return "Medium Venue"
        else:
            return "Large Venue/Stadium"


# Optional: Additional models for more complex relationships
class ImpulseResponse(models.Model):
    """Model for storing impulse response information"""
    
    name = models.CharField(max_length=200, help_text="IR name")
    cabinet_type = models.CharField(max_length=100, help_text="Cabinet type")
    microphone = models.CharField(max_length=100, blank=True, help_text="Microphone used")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'app_impulse_response'
        verbose_name = 'Impulse Response'
        verbose_name_plural = 'Impulse Responses'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class NAMRecommendation(models.Model):
    """Model for storing NAM gear recommendations"""
    
    band_name = models.CharField(max_length=200, help_text="Band name")
    description = models.TextField(help_text="Recommendation description")
    recommended_amp = models.ForeignKey(
        Amp,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Recommended amplifier"
    )
    recommended_ir = models.ForeignKey(
        ImpulseResponse,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Recommended impulse response"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'app_nam_recommendation'
        verbose_name = 'NAM Recommendation'
        verbose_name_plural = 'NAM Recommendations'
        ordering = ['-created_at']
        unique_together = ['band_name']  # One recommendation per band
    
    def __str__(self):
        return f"Recommendation for {self.band_name}"