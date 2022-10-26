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

    num_pages = 5
    page_size = 10000

    load_categories = True

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
        products_response = requests.get("https://api.bigbuy.eu/rest/catalog/products.json?isoCode=en&pageSize=" + str(page_size) + "&page=" + str(i), 
        headers = {"Authorization": "Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw"})
        products_response.raise_for_status()
        products = products_response.json()

        for product in products:
            id = product["id"]
            sku = product["sku"]
            category = product["category"]
            wholesale_price = product["wholesalePrice"]
            retail_price = product["retailPrice"]
            in_shop_price = product["inShopsPrice"]

            data = supabase.table("Product").insert({
                "id": id,
                "sku": sku,
                "category": category,
                "wholesalePrice": wholesale_price,
                "retailPrice": retail_price,
                "inShopPrice": in_shop_price
            }).execute()
            print(data)

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

                data = supabase.table("ProductInfo").insert({
                    "id": id,
                    "name": name,
                    "description": description
                }).execute()
                print(data)

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
                    
                    data = supabase.table("ProductImage").insert({
                        "id": id,
                        "isCover": is_cover,
                        "url": image
                    }).execute()
                    print(data)
            except:
                continue

            time.sleep(5.0)

if __name__ == "__main__":
    run_database = True

    if run_database:
        main()
