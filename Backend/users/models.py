from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"))
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "password", "fullname"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Budget(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    budgetname = models.CharField(max_length=100)
    monthlyPayment=  models.DecimalField(max_digits=10, decimal_places=2)
    yearlyIncome=models.DecimalField(max_digits=10, decimal_places=2)
    effectiveInterestRate=models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.user.email
class BudgetEntry(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=100)
    monthlyAmount=  models.DecimalField(max_digits=10, decimal_places=2)
    yearlyTimes=models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Expense for {self.budget.budgetname}"