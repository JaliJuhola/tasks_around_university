# Generated by Django 2.0.1 on 2019-01-05 16:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('maingame', '0006_player_icon_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='last_connection',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
