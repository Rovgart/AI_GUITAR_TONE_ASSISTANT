git clone https://github.com/Rovgart/AI_GUITAR_TONE_ASSISTANT.git
pip install -r requirements.txt
cd ai_tone_bn
cd ai_tone_bn

# Create env
DJANGO_SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
ALGORITHM=HS256
DEBUG=True

# Run Server and make db migrations
python manage.py migrate
python manage.py runserver

