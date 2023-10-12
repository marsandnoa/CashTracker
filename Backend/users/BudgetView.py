from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from .models import CustomUser
from .serializers import BudgetSerializer

@api_view(['POST'])
def create_budget(request):
    if request.method == 'POST':
        budgetname = request.data.get('budgetname')
        username = request.data.get('username')  

        if not budgetname or not username:
            return Response({'error': 'Both budgetname and username are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            custom_user = get_object_or_404(CustomUser, username=username)

            budget = Budget.objects.create(user=custom_user, budgetname=budgetname)

            return Response({'id': budget.id, 'budgetname': budget.budgetname}, status=status.HTTP_201_CREATED)
        except CustomUser.DoesNotExist:
            return Response({'error': 'CustomUser with the provided username does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(['GET'])
def get_all_budgets(request):
    budgets = Budget.objects.all()
    serializer = BudgetSerializer(budgets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_budget_by_id(request, budget_id):
    try:
        budget = Budget.objects.get(pk=budget_id)
    except Budget.DoesNotExist:
        return Response({'error': 'Budget not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = BudgetSerializer(budget)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
def update_budget(request, pk):
    try:
        budget = Budget.objects.get(pk=pk)
    except Budget.DoesNotExist:
        return Response({'error': 'Budget not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = BudgetSerializer(budget, data=request.data)
    elif request.method == 'PATCH':
        serializer = BudgetSerializer(budget, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save() 
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_budget(request, pk):
    try:
        budget = Budget.objects.get(pk=pk)
    except Budget.DoesNotExist:
        return Response({'error': 'Budget not found'}, status=status.HTTP_404_NOT_FOUND)

    budget.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_budget_by_username(request, username):
    
    user = get_object_or_404(CustomUser, username=username)
    try:
        budget = Budget.objects.get(user=user)
    except Budget.DoesNotExist:
        return Response({'error': 'Budget not found for the specified username'}, status=status.HTTP_404_NOT_FOUND)

    serializer = BudgetSerializer(budget)
    return Response(serializer.data,status=status.HTTP_200_OK)
