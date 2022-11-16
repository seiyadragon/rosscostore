import { Navbar } from ".";
import styles from '../styles/Cart.module.css'
import { CategorySelector } from "./shop";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", process.env.SUPABASE_AUTH)

export async function getServerSideProps(context) {
    const {data: categories, err3} = await supabase.from("Category").select('*').eq('parentCategory', 2)

    return {
        props: {
            categories: categories,
        }
    }
}

export default function Cart({categories}) {
    return (
        <main>
            <Navbar title="Cart"/>
            <section className={styles.category}>
                <CategorySelector categories={categories}/>
                <section className={styles.categoryBody}>
                    <section className={styles.productWrapper}>
                        
                    </section>
                </section>
            </section>
        </main>
    )
}