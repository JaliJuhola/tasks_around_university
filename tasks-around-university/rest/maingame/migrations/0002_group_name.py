# Generated by Django 2.0.1 on 2018-11-13 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maingame', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='name',
            field=models.CharField(default='moi', max_length=100),
            preserve_default=False,
        ),
    ]
