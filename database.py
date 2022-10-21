import sqlite3
import requests

connection = sqlite3.connect("database.sqlite")
db = connection.cursor()

numPages = 1

for i in range(0, numPages):
    
