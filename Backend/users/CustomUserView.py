from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from .serializers import CustomUserSerializerFull,CustomUserSerializerPartial, BudgetSerializer
from .models import CustomUser, Budget
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
@api_view(['POST'])
def create_my_CustomUser(request):
    if request.method == 'POST':
        user_serializer = CustomUserSerializerFull(data=request.data)

        if user_serializer.is_valid():
            hashed_password = make_password(request.data.get('password'))
            user_serializer.validated_data['password'] = hashed_password
            user = user_serializer.save()

            budget_data = {
                'user': user.id,
                'budgetname': f'{user.email} Budget'
            }

            budget_serializer = BudgetSerializer(data=budget_data)
            if budget_serializer.is_valid():
                budget_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
            else:
                user.delete()
                return Response(budget_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_my_CustomUsers(request):
        my_CustomUsers = CustomUser.objects.all()

        serializer = CustomUserSerializerFull(my_CustomUsers, many=True)

        return Response(serializer.data)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_CustomUser_by_id(request, CustomUser_id):
    try:
        CustomUserFound = CustomUser.objects.get(pk=CustomUser_id)
    except CustomUserFound.notExist:
        return Response({'error': 'CustomUser not found'}, status=status.HTTP_404_NOT_FOUND)
    
    username=CustomUserFound.username
    fullname=CustomUserFound.fullname
    email=CustomUserFound.email
    id=CustomUserFound.id
    user_data={
        'username':username,
        'fullname':fullname,
        'email':email,
        'id':id
    }
    serializer = CustomUserSerializerPartial(user_data)

    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_my_CustomUser(request, pk):
    try:
        my_CustomUser = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CustomUserSerializerFull(my_CustomUser, data=request.data)
    elif request.method == 'PATCH':
        serializer = CustomUser(my_CustomUser, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save() 
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_my_CustomUser(request, pk):
    try:
        my_CustomUser = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

    my_CustomUser.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
def login_custom_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            Token.objects.filter(user=user).delete()
            token, _ = Token.objects.get_or_create(user=user)

            user_data = {
                'username': user.username,
                'email': user.email,
                'fullname': user.fullname,
                'id': user.id
            }

            return Response({'token': token.key, 'user': user_data, 'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


