# serializers.py
from rest_framework import serializers
from .models import CustomUser, Budget, BudgetEntry

class CustomUserSerializerFull(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__' 
class CustomUserSerializerPartial(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email','fullname','id')
        
class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__' 
class BudgetEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetEntry
        fields = '__all__' 