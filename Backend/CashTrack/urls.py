"""
URL configuration for CashTrack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users import CustomUserView, BudgetView, BudgetEntryView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/create/', CustomUserView.create_my_CustomUser, name='create_my_CustomUser'),
    path('user/findall/', CustomUserView.get_all_my_CustomUsers, name='get_my_CustomUser'),
    path('user/findbyid/<int:CustomUser_id>/', CustomUserView.get_CustomUser_by_id, name='get_CustomUser_by_id'),
    path('user/update/<int:pk>/', CustomUserView.update_my_CustomUser, name='update_my_CustomUser'),
    path('user/delete/<int:pk>/', CustomUserView.delete_my_CustomUser, name='delete_my_CustomUser'),
    path('user/login/', CustomUserView.login_custom_user, name='login_my_CustomUser'),

    path('budget/create/', BudgetView.create_budget, name='create_budget'),
    path('budget/findall/', BudgetView.get_all_budgets, name='get_all_budgets'),
    path('budget/findbyid/<int:budget_id>/', BudgetView.get_budget_by_id, name='get_budget_by_id'),
    path('budget/findbyusername/<str:username>/', BudgetView.get_budget_by_username, name='get_budget_by_username'),
    path('budget/update/<int:pk>/', BudgetView.update_budget, name='update_budget'),
    path('budget/delete/<int:pk>/', BudgetView.delete_budget, name='delete_budget'),

    path('budgetentry/create/', BudgetEntryView.create_budget_entry, name='create_budget_entry'),
    path('budgetentry/findall/', BudgetEntryView.get_all_budget_entries, name='get_all_budget_entries'),
    path('budgetentry/findbyid/<int:budget_entry_id>/', BudgetEntryView.get_budget_entry_by_id, name='get_budget_entry_by_id'),
    path('budgetentry/findbybudgetid/<int:budget_id>/', BudgetEntryView.get_budget_entries_by_budget_id, name='get_budget_entry_by_Budget_id'),
    path('budgetentry/update/<int:pk>/', BudgetEntryView.update_budget_entry, name='update_budget_entry'),
    path('budgetentry/delete/<int:pk>/', BudgetEntryView.delete_budget_entry, name='delete_budget_entry'),
]
