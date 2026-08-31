from pymongo import MongoClient
from django.conf import settings

# Connect to the local MongoDB server using the URI from settings.py
client = MongoClient(settings.MONGO_URI)

# Select the specific database for this project
db = client[settings.MONGO_DB_NAME]
