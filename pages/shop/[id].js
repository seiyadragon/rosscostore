import { Navbar } from "..";
import styles from '../../styles/Category.module.css'
import Link from "next/link";

const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

//Load data from server
export async function getServerSideProps(context) {
    let catId = context.query.id

    //Load sql stuff
    const db = await sqlite.open({filename: "./database.sqlite", driver: sqlite3.Database})
    let cat = await db.all("select * from Category where id = ?;", [catId])
    let childCats = await db.all("select * from Category where parentCategory = ?;", [catId])

    //Load the children categories of the children categories of the main category
    for (let childCat of childCats) {
        let childrenChildren = await db.all("select * from Category where parentCategory = ?;", [childCat.id])

        childrenChildren.map((child) => {
            childCats.push(child)
        })
    }
    
    //Load the products for all the children categories
    let products = {}
    for (let i = 0; i < childCats.length; i++) {
        let catItems = await db.all("select * from Product where category = ?;", [childCats[i].id])

        catItems.map((item, index) => {
            products[item.id] = item
        })
    }

    //Load all the info fro all the products
    let productsInfo = {}
    for (let [key, value] of Object.entries(products)) {
        let info = await db.all("select * from ProductInfo where id = ?;", [key])

        if (info == null || typeof info[0] === 'undefined')
            continue

        productsInfo[key] = info[0]
    }

    //Load the images for the products
    let productsImages = {}
    for (let [key, value] of Object.entries(products)) {
        let images = await db.all("select * from ProductImage where id = ?;", [key])
        images.forEach((image) => {
            if (image.isCover)
                productsImages[key] = image
        })
    }

    return {
        props: {
            category: cat[0],
            products: products,
            productsInfo: productsInfo,
            productsImages: productsImages,
            childCategories: childCats
        }
    }
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
                        if (typeof productsInfo[product.id] !== 'undefined') {
                            return <Product key={products.id} product={product} productInfo={productsInfo[product.id]}
                                image={productsImages[product.id].image} parentCategory={parentCategory} />
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
export default function category({category, products, productsInfo, childCategories, productsImages}) {
    return (
        <main className={styles.container}>
            <Navbar title={category.name}/>

            <ul>
                {childCategories.map((cat, index) => {
                    return <Category key={cat.id} category={cat} products={products} productsInfo={productsInfo} productsImages={productsImages} parentCategory={category}/>
                })}
            </ul>
        </main>
    )
}