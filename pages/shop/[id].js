import { Navbar } from "..";
import styles from '../../styles/Category.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp" + 
"uYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY")

//Load data from server
export async function getServerSideProps(context) {
    let catId = context.query.id
    let page = context.query.page

    if (page < 0)
        page = 0

    //Load sql stuff
    let {data: cat, error} = await supabase.from("Category").select("*").eq("id", catId)
    if (error != null)
        console.log(error.details)

    let {data: childCats, error2} = await supabase.from("Category").select("*").eq("parentCategory", catId)
    if (error2 != null)
        console.log(error.details)
    
    //Select category in page
    let pageCats = [childCats[page]]
    
    //Load the children categories of the children categories of the main category
    for (let childCat of pageCats) {
        let {data: childrenChildren, error} = await supabase.from("Category").select("*").eq("parentCategory", childCat.id)
        if (error != null)
        console.log(error.details)
        
        childrenChildren.forEach((child, index) => {
            pageCats.push(child)
        })
    }
    
    //Load the products for all the children categories
    let products = {}
    for (let cat2 of pageCats) {
        let {data: catItems, error} = await supabase.from("Product").select("*").eq("category", cat2.id)
        if (error != null)
            console.log(error.details)

        for (let catItem of catItems) {
            products[catItem.id] = catItem
        }
    }

    //Load all the info fro all the products
    let productsInfo = {}
    for (let [key, value] of Object.entries(products)) {
        let {data: info, error} = await supabase.from("ProductInfo").select("*").eq("id", key)
        if (error != null)
            console.log(error.details)

        if (info == null || typeof info[0] === 'undefined')
            continue

        productsInfo[key] = info[0]
    }

    //Load the images for the products
    let productsImages = {}
    for (let [key, value] of Object.entries(products)) {
        let {data: images, error} = await supabase.from("ProductImage").select("*").eq("id", key)
        if (error != null)
            console.log(error.details)

        if (images == null || typeof images[0] === 'undefined')
            continue

        for (let image of images) {
            if (image.isCover)
                productsImages[key] = image
        }
    }

    let contextJson = {
        "id": catId,
        "page": page
    }

    return {
        props: {
            category: cat[0],
            products: products,
            productsInfo: productsInfo,
            productsImages: productsImages,
            childCategories: pageCats,
            context: contextJson
        }
    }
}

//Select pages
export function PageSelector({context}) {
    return (
        <section className={styles.page_selector}>
            <a><Link href={"/shop/" + context.id + "?page=" + (parseInt(context.page) - 1)}><text>{"<"}</text></Link></a>
            <text>{context.page}</text>
            <a><Link href={"/shop/" + context.id + "?page=" + (parseInt(context.page) + 1)}><text>{">"}</text></Link></a>
        </section>
    )
}

//Represents item in the store
export function Product({product, productInfo, image, parentCategory}) {
    return (
        <a>
            <Link href={`/shop/${parentCategory.id}/${product.id}`}>
                <li className={styles.product} style={{'backgroundImage': `url(${image})`}}>
                    <text className={styles.product_title}><strong>{productInfo.name}</ strong><br/></text>
                </li>
            </Link>
        </a>
    )
}

//Represent child category
export function Category({category, products, productsInfo, productsImages, parentCategory}) {
    return (
        <li className={styles.category}>
            <h1>{category.name}</h1>
            <ul>
                {Object.values(products).map((product) => {
                    if (product.category == category.id) {
                        if (typeof productsInfo[product.id] !== 'undefined' && typeof productsImages[product.id] !== 'undefined') {
                            return <Product key={products.id} product={product} productInfo={productsInfo[product.id]}
                                image={productsImages[product.id].url} parentCategory={parentCategory} />
                        } else {
                            return <li key={product.id}><text>{product.id}</text></li>
                        }
                    }
                })}
            </ul>
        </li>
    )
}

//Represents parent category
export default function categoryPage({category, products, productsInfo, childCategories, productsImages, context}) {
    return (
        <main className={styles.container}>
            <Navbar title={category.name}/>
            <PageSelector context={context} />
            <ul>
                {childCategories.map((cat, index) => {
                    return <Category key={cat.id} category={cat} products={products} productsInfo={productsInfo} productsImages={productsImages} parentCategory={category}/>
                })}
            </ul>
        </main>
    )
}