import { Navbar } from "..";
import styles from '../../styles/Category.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'
import { CategorySelector } from ".";
import Image from "next/image";

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp" + 
"uYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY")

//Load data from server
export async function getServerSideProps(context) {
    const {data: allCategories, err} = await supabase.from('Category').select('*')
    const {data: categories, err2} = await supabase.from('Category').select('*').eq('parentCategory', 2)
    const {data: currentCategory, err3} = await supabase.from('Category').select('*').eq('id', context.query.id)

    const {data: products, err4} = await supabase.from('Product').select('*')
    const {data: infos, err5} = await supabase.from('ProductInfo').select('*')

    let subCategories = []
    for (let i = 0; i < allCategories.length; i++) 
        if (allCategories[i].parentCategory == currentCategory[0].id) 
            subCategories.push(allCategories[i])

    for (let j = 0; j < subCategories.length; j++)
        for (let i = 0; i < allCategories.length; i++)
            if (allCategories[i].parentCategory == subCategories[j].id)
                subCategories.push(allCategories[i])

    let infosDict = {}
    for (let i = 0; i < infos.length; i++)
        infosDict[infos[i].id] = infos[i]

    return {
        props: {
            categories: categories,
            currentCategory: currentCategory[0],
            subCategories: subCategories,
            products: products,
            infos: infosDict
        }
    }
}

export function Product({product, info}) {
    return (
        <Link href="/">
            <section className={styles.product}>
                <section>
                    <Image src={`${info.images[0].url}`} width={640} height={360} />
                </section>
                <section className={styles.productInfo}>
                    <text>{info.name}</text>
                    <br />
                    <text dangerouslySetInnerHTML={{__html: info.description}}></text>
                </section>
            </section>
        </Link>
    )
}

export function SubCategory({category, products, infos}) {
    return (
        <section className={styles.subCategory}>
            <section className={styles.title}>
                <text>{category.name}</text>
            </section>
            <section className={styles.subBody}>
                <ul>
                    {products.map((product) => {
                        if (product.category === category.id)
                            return <li><Product product={product} info={infos[product.id]}/></li>
                    })}
                </ul>
            </section>
        </section>
    )
}

export default function CategoryPage({categories, currentCategory, subCategories, products, infos}) {
    return (
        <main className={styles.container}>
            <Navbar title={currentCategory.name}/>
            <section className={styles.category}>
                <CategorySelector categories={categories} currentCategory={currentCategory}/>
                <section className={styles.categoryBody}>
                    <ul>
                        {subCategories.map((category) => {
                            return (
                                <li key={category.id}>
                                    <SubCategory category={category} products={products} infos={infos}/>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            </section>
        </main>
    )
}