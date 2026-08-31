from django.contrib import admin
from django.urls import path
from routes import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/base-route/', views.save_base_route),
    path('api/log-trip/', views.log_trip),
    path('api/dashboard/', views.get_dashboard_data),
]
