import { Navbar } from "../../";
import styles from '../../../styles/Product.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'
import { CategorySelector } from "..";
import Image from "next/image";
import { useState } from "react";

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp" + 
"uYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY")

export async function getServerSideProps(context) {
    const {data: product, err} = await supabase.from("Product").select('*').eq("id", context.query.product)
    const {data: categories, err3} = await supabase.from("Category").select('*').eq('parentCategory', 2)

    let currentCategory
    for (let i = 0; i < categories.length; i++)
        if (categories[i].id == context.query.id)
            currentCategory = categories[i]

    return {
        props: {
            product: product[0],
            categories: categories,
            currentCategory: currentCategory
        }
    }
}

export function ProductDetails({product}) {
    let [currentUrl, setCurrentUrl] = useState(product.images[0].url)
    
    function onButtonClick(url) {
        setCurrentUrl(url)
    }

    return (
        <section className={styles.product}>
            <section className={styles.title}>
                <span><strong>{product.name}</strong></span>
            </section>
            <section className={styles.images}>
                <Image src={`${currentUrl}`} width={1920} height={1080}/>
                <ul>
                    {product.images.map((image) => {
                        return (
                            <li key={image.id}>
                                <button 
                                    style={{'border': currentUrl == image.url ? 'solid 3px darkred' : 'solid 3px darkgoldenrod'}}
                                    onClick={() => onButtonClick(image.url)}
                                >
                                    <Image src={`${image.url}`} width={1920/16} height={1080/16}/>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>
            <section className={styles.productBody}>
                <strong>
                    <span>{"Price: $" + product.retailPrice}</span><br />
                    <span>{"Shipping: $" + "9.99"}</span><br />
                    <span>{"SKU: " + product.sku}</span><br />
                    <span>{"Stock: " + product.quantity + " left!"}</span><br />
                    <br />
                </strong>
                <span dangerouslySetInnerHTML={{__html: product.description}}></span>
            </section>
        </section>
    )
}

export default function ProductPage({product, categories, currentCategory}) {
    return (
        <main className={styles.container}>
            <Navbar title={currentCategory.name}/>
            <section className={styles.category}>
                <CategorySelector categories={categories} currentCategory={currentCategory}/>
                <section className={styles.categoryBody}>
                    <ProductDetails product={product} />
                </section>
            </section>
        </main>
    )
}