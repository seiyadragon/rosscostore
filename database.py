from concurrent.futures import thread
from multiprocessing import connection
import sqlite3
from unicodedata import category
import requests
import time


def table_setup(connection, db):
    db.execute("drop table Category;")
    db.execute("create table Category (id integer, name text, parentCategory integer, image text);")

    db.execute("drop table Product;")
    db.execute("create table Product (id integer, sku integer, category integer);")

    db.execute("drop table ProductInfo;")
    db.execute("create table ProductInfo (id integer, name text, description text);")

    db.execute("drop table ProductImage;")
    db.execute("create table ProductImage (id integer, isCover boolean, image text)")
    
    connection.commit()

def main():
    print("Initializing database...")
    connection = sqlite3.connect("./database.sqlite")
    db = connection.cursor()

    table_setup(connection, db)

    num_pages = 5
    page_size = 10000

    categories_respose = requests.get("https://api.bigbuy.eu/rest/catalog/categories.json?isoCode=en",
    headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})

    categories_respose.raise_for_status()
    categories = categories_respose.json()

    print("Loading Categories...")
    for cat in categories:
        id = cat["id"]
        name = cat["name"]
        parentCategory = cat["parentCategory"]
        images = cat["urlImages"]
        values = [id, name, parentCategory, images[1]]

        db.execute("insert into Category (id, name, parentCategory, image) values(?, ?, ?, ?);", values)
        print(values)
    connection.commit()

    print("Loading Products...")
    for i in range(0, num_pages):
        print("Loading Page... " + str(i))
        products_response = requests.get("https://api.bigbuy.eu/rest/catalog/products.json?isoCode=en&pageSize=" + str(page_size) + "&page=" + str(i), 
        headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
        products_response.raise_for_status()
        products = products_response.json()

        for product in products:
            id = product["id"]
            sku = product["sku"]
            category = product["category"]
            values = [id, sku, category]

            db.execute("insert into Product (id, sku, category) values(?, ?, ?);", values)
            print(values)

        for product in products:
            try:
                print("Loading Product Info... " + str(product["id"]))
                product_info_response = requests.get("https://api.bigbuy.eu/rest/catalog/productinformation/" + str(product["id"]) + ".json?isoCode=en", 
                headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
                product_info_response.raise_for_status()
                product_info = product_info_response.json()

                id = product_info[0]["id"]
                name = product_info[0]["name"]
                description = product_info[0]["description"]
                values = [id, name, description]

                db.execute("insert into ProductInfo (id, name, description) values(?, ?, ?);", values)
                print(values)

                print("Loading Product Images... " + str(id))
                product_images_response = requests.get("https://api.bigbuy.eu/rest/catalog/productimages/" + str(product["id"]) + ".json?isoCode=en", 
                headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
                product_images_response.raise_for_status()
                product_images = product_images_response.json()

                for image in product_images["images"]:
                    id = product_images["id"]
                    is_cover = image["isCover"]
                    image = image["url"]
                    values = [id, is_cover, image]
                    db.execute("insert into ProductImage (id, isCover, image) values(?, ?, ?)", values)
                    print(values)
            except:
                continue

            connection.commit()
            time.sleep(5.0)

    connection.close()

if __name__ == "__main__":
    run_database = True

    if run_database:
        main()
