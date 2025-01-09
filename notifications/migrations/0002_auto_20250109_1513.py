# Generated by Django 3.2.25 on 2025-01-09 15:13

from django.db import migrations, models
import django.db.models.deletion
import notifications.models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='related_object_id',
            new_name='object_id',
        ),
        migrations.AddField(
            model_name='notification',
            name='content_type',
            field=models.ForeignKey(default=notifications.models.get_default_content_type, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
        ),
    ]
