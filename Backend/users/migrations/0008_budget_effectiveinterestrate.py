# Generated by Django 4.2.5 on 2023-10-19 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_budget_yearlyincome'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='effectiveInterestRate',
            field=models.DecimalField(decimal_places=2, default=0.07, max_digits=10),
            preserve_default=False,
        ),
    ]