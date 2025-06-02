# Save this as: app/management/commands/load_sample_irs.py
from django.core.management.base import BaseCommand
from app.models import ImpulseResponse

class Command(BaseCommand):
    help = 'Load sample IRS (Impulse Response) data'

    def handle(self, *args, **options):
        sample_irs = [
            {
                'name': 'Marshall 4x12 Vintage',
                'cabinet_type': 'Marshall 1960A',
                'microphone': 'Shure SM57',
                'description': 'Classic Marshall cabinet with Celestion Vintage 30 speakers'
            },
            {
                'name': 'Mesa Boogie Rectifier',
                'cabinet_type': 'Mesa Boogie Rectifier 4x12',
                'microphone': 'Royer R-121',
                'description': 'High-gain cabinet perfect for metal and rock'
            },
            {
                'name': 'Vox AC30 Combo',
                'cabinet_type': 'Vox AC30',
                'microphone': 'AKG C414',
                'description': 'Vintage British combo amp with distinctive chime'
            },
            {
                'name': 'Fender Twin Reverb',
                'cabinet_type': 'Fender Twin Reverb 2x12',
                'microphone': 'Neumann U87',
                'description': 'Clean American tone with sparkling highs'
            },
            {
                'name': 'Orange 4x12',
                'cabinet_type': 'Orange PPC412',
                'microphone': 'Shure SM57',
                'description': 'British cabinet with thick, saturated midrange'
            },
            {
                'name': 'Gibson Les Paul Studio',
                'cabinet_type': 'Gibson 2x12',
                'microphone': 'Sennheiser MD421',
                'description': 'Warm, woody tone with excellent sustain'
            },
            {
                'name': 'Bogner Uberkab',
                'cabinet_type': 'Bogner Uberkab 4x12',
                'microphone': 'Coles 4038',
                'description': 'Modern boutique cabinet with exceptional clarity'
            },
            {
                'name': 'Mesa Boogie 2x12 Vertical',
                'cabinet_type': 'Mesa Boogie 2x12 Vertical',
                'microphone': 'Electro-Voice RE20',
                'description': 'Compact cabinet with punchy low-mids'
            },
            {
                'name': 'Engl Pro 4x12',
                'cabinet_type': 'Engl Pro Cabinet E412VG',
                'microphone': 'Audio-Technica AT4050',
                'description': 'German engineering for precise metal tones'
            },
            {
                'name': 'Friedman 4x12',
                'cabinet_type': 'Friedman 4x12',
                'microphone': 'Shure Beta 57A',
                'description': 'Modern boutique cabinet with vintage character'
            },
            {
                'name': 'Laney 4x12',
                'cabinet_type': 'Laney GS412IA',
                'microphone': 'Beyerdynamic M160',
                'description': 'British cabinet favored by doom and stoner rock'
            },
            {
                'name': 'Blackstar 2x12',
                'cabinet_type': 'Blackstar HTV212',
                'microphone': 'Blue Woodpecker',
                'description': 'Modern British design with ISF technology'
            },
            {
                'name': 'EVH 5150III 4x12',
                'cabinet_type': 'EVH 5150III 4x12',
                'microphone': 'Heil PR30',
                'description': 'High-gain cabinet designed for modern metal'
            },
            {
                'name': 'Soldano 4x12',
                'cabinet_type': 'Soldano 4x12',
                'microphone': 'Telefunken M80',
                'description': 'Boutique American cabinet with tight low-end'
            },
            {
                'name': 'Diezel 4x12',
                'cabinet_type': 'Diezel 412FV',
                'microphone': 'Oktava MK-319',
                'description': 'German precision cabinet for progressive metal'
            }
        ]

        created_count = 0
        for irs_data in sample_irs:
            irs, created = ImpulseResponse.objects.get_or_create(
                name=irs_data['name'],
                cabinet_type=irs_data['cabinet_type'],
                microphone=irs_data['microphone'],
                defaults=irs_data
            )
            if created:
                created_count += 1
                self.stdout.write(f"Created: {irs}")
            else:
                self.stdout.write(f"Already exists: {irs}")

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new IRS records')
        )