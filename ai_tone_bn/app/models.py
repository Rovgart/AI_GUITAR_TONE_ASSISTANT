from typing import Any
from django.db import models

# Create your models here.
class Amp(models.Model):
    name=models.CharField(max_length=100, unique=True)
    brand=models.CharField(max_length=100)
    amp_type=models.CharField(max_length=50, choices=[
        ('tube', 'Tube'),
        ('solid_state', 'Solid State'),
        ('hybrid', 'Hybrid'),
        ('digital', 'Digital'),
    ])
    channels=models.PositiveSmallIntegerField(default=1)
    gain_range=models.CharField(max_length=50, help_text="e.g. Low, Medium, High")
    has_reverb=models.BooleanField(default=True)
    description=models.TextField(blank=True, null=True)
    image=models.URLField(blank=True, null=True)
    release_year=models.PositiveIntegerField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering=["brand","name"]
    
    def __str__(self) -> str:
        return f"{self.brand} {self.name}"


class IR(models.Model):
    name = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=100)
    format = models.CharField(
        max_length=20,
        choices=[
            ("wav", "WAV"),
            ("aiff", "AIFF"),
            ("flac", "FLAC"),
        ],
        default="wav"
    )
    sample_rate = models.PositiveIntegerField(default=44100)
    bit_depth = models.PositiveSmallIntegerField(default=24)
    file_url = models.URLField(help_text="Direct link to download or stream the IR")
    compatible_amps = models.ManyToManyField("Amp", blank=True, related_name="compatible_irs")

    mic_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g. SM57, Royer R-121"
    )
    cabinet_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g. 4x12, 2x12, Open Back"
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["manufacturer", "name"]

    def __str__(self):
        return f"{self.manufacturer} {self.name}"
    