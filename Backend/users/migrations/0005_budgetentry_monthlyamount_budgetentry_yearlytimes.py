# Generated by Django 4.2.5 on 2023-10-19 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_budgetentry_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='budgetentry',
            name='monthlyAmount',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='budgetentry',
            name='yearlyTimes',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]