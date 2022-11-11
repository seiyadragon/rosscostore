import { Navbar } from "../../";
import styles from '../../../styles/Product.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'
import { CategorySelector } from "..";
import Image from "next/image";
import { useState } from "react";
import { AddToCart } from ".";

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", process.env.SUPABASE_AUTH)

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
                <section className={styles.images_main} style={{"backgroundImage": `url(${currentUrl})`}} />
                <ul>
                    {product.images.map((image) => {
                        return (
                            <li key={image.id}>
                                <button 
                                    style={{'border': currentUrl == image.url ? 'solid 6px red' : 'solid 6px azure'}}
                                    onClick={() => onButtonClick(image.url)}
                                >
                                    <section className={styles.images_button} style={{"backgroundImage": `url(${image.url})`}}/>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>
            <section className={styles.productBody}>
                <strong>
                    <span>{"Price: $" + product.retailPrice}</span><br />
                    <span>{"Shipping: $" + "8.99"}</span><br />
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
                <section className={styles.categoryBody} style={{"backgroundImage": `url(${product.images[0].url})`}}>
                    <section className={styles.productWrapper}>
                        <ProductDetails product={product} />
                    </section>
                    <section className={styles.addToCartWrapper}>
                        <AddToCart />
                    </section>
                </section>
            </section>
        </main>
    )
}