from more_itertools import quantify
import requests
import time
from supabase import create_client, Client

def main():
    print("Initializing database...")

    supabase: Client = create_client(
        "https://jnbnzuyiuuaocbltwewu.supabase.co", 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6Im" +
        "Fub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY"
    )

    num_pages = 10
    page_size = 10000
    to_dollars = 0.9965
    profit_margin = 1.05

    load_categories = False

    if load_categories:
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

            data = supabase.table("Category").insert({
                "id": id,
                "name": name,
                "parentCategory": parentCategory,
                "imageUrl": images[1]
            }).execute()
            print(data)
    else: print("Skipping Categories...")

    print("Loading Products...")
    for i in range(0, num_pages):
        print("Loading Page... " + str(i))

        products_response = requests.get("https://api.bigbuy.eu/rest/catalog/productsstockavailable.json?isoCode=en&pageSize=" + str(page_size) + "&page=" + str(i), 
        headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
        products_response.raise_for_status()
        products = products_response.json()

        for product in products:
            try:
                id = product["id"]

                print("Loading Product Info... " + str(id))
                product_info_response = requests.get("https://api.bigbuy.eu/rest/catalog/productinformation/" + str(id) + ".json?isoCode=en", 
                headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
                product_info_response.raise_for_status()
                product_info = product_info_response.json()

                print("Loading Product Images... " + str(id))
                product_images_response = requests.get("https://api.bigbuy.eu/rest/catalog/productimages/" + str(id) + ".json?isoCode=en", 
                headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
                product_images_response.raise_for_status()
                product_images = product_images_response.json()

                print("Loading product category info... " + str(id))
                product_category_response = requests.get("https://api.bigbuy.eu/rest/catalog/product/" + str(id) + ".json", 
                headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
                product_category_response.raise_for_status()
                product_category = product_category_response.json()
                
                sku = product_category["sku"]
                category = product_category["category"]
                wholesale_price = round((product_category["wholesalePrice"] * to_dollars) * profit_margin, 2)
                retail_price = round((product_category["retailPrice"] * to_dollars) * profit_margin, 2)
                in_shop_price = round((product_category["inShopsPrice"] * to_dollars) * profit_margin, 2)

                name = product_info[0]["name"]
                description = product_info[0]["description"]
                images = product_images["images"]

                quantity = product["stocks"][0]["quantity"]

                data = supabase.table("Product").insert({
                    "id": id,
                    "sku": sku,
                    "category": category,
                    "wholesalePrice": wholesale_price,
                    "retailPrice": retail_price,
                    "inShopPrice": in_shop_price,
                    "name": name, 
                    "description": description,
                    "images": images,
                    "quantity": quantity
                }).execute()

                print(data)
                time.sleep(5.0)
                
            except:
                print("Cant load item... " + str(id))
                continue

if __name__ == "__main__":
    run_database = True

    if run_database:
        main()
