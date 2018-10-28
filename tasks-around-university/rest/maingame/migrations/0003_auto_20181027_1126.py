# Generated by Django 2.0.1 on 2018-10-27 11:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('maingame', '0002_auto_20181027_1125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hotspot',
            name='x',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='hotspot',
            name='y',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='player',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='maingame.Group'),
        ),
        migrations.AlterField(
            model_name='player',
            name='x',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='player',
            name='y',
            field=models.IntegerField(default=0),
        ),
    ]
