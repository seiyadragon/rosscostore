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
    const {data: info, err2} = await supabase.from("ProductInfo").select('*').eq("id", context.query.product)
    const {data: categories, err3} = await supabase.from("Category").select('*').eq('parentCategory', 2)

    let currentCategory
    for (let i = 0; i < categories.length; i++)
        if (categories[i].id == context.query.id)
            currentCategory = categories[i]

    return {
        props: {
            product: product[0],
            info: info[0],
            categories: categories,
            currentCategory: currentCategory
        }
    }
}

export function ProductDetails({product, info}) {
    let [currentUrl, setCurrentUrl] = useState(info.images[0].url)
    
    function onButtonClick(url) {
        setCurrentUrl(url)
    }

    return (
        <section className={styles.product}>
            <section className={styles.title}>
                <text><strong>{info.name}</strong></text>
            </section>
            <section className={styles.images}>
                <Image src={`${currentUrl}`} width={1920} height={1080}/>
                <ul>
                    {info.images.map((image) => {
                        return (
                            <li key={image.id}>
                                <button style={{'border': currentUrl == image.url ? 'solid 1px black' : 'none'}}onClick={() => onButtonClick(image.url)}>
                                    <Image src={`${image.url}`} width={1920/16} height={1080/16}/>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </section>
            <section className={styles.productBody}>
                <text dangerouslySetInnerHTML={{__html: info.description}}></text>
            </section>
        </section>
    )
}

export default function ProductPage({product, info, categories, currentCategory}) {
    return (
        <main className={styles.container}>
            <Navbar title={currentCategory.name}/>
            <section className={styles.category}>
                <CategorySelector categories={categories} currentCategory={currentCategory}/>
                <section className={styles.categoryBody}>
                    <ProductDetails product={product} info={info}/>
                </section>
            </section>
        </main>
    )
}