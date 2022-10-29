import { Navbar } from "..";
import styles from '../../styles/Shop.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp" + 
"uYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY")

export async function getServerSideProps() {
    const {data: cats, error} = await supabase.from('Category').select('*').eq('parentCategory', 2) 

    if (error != null)
        console.log(error.details)

    return {
        props: {
            categories: cats
        }
    }
}

export function Category({category, backgroundColor, link}) {
    return (
        <li style={{"backgroundColor": backgroundColor}}>
            <a>
                <Link href={link}>
                    <section className={styles.category}>
                        <text>{category.name.replaceAll(' | ', ' ')}</text>
                    </section>
                </Link>
            </a>
        </li>
    )
}

export function CategorySelector({categories, currentCategory}) {
    return (
        <section className={styles.categories}>
            {currentCategory == null &&
                <section className={styles.noCategory}>
                    <text>{"There is nothing you won't find at RoßCo!"}</text>
                </section>
            }
            
            <ul>
                {categories.map((cat, index) => {
                    if (currentCategory != null && cat.id === currentCategory.id)
                        return <Category category={cat} backgroundColor="orangered" link={"/shop/" + cat.id} key={index}/>
                    else {
                        return <Category category={cat} backgroundColor="#810020" link={"/shop/" + cat.id} key={index}/>
                    }
                })}
            </ul>
        </section>
    )
}

export default function Shop({categories}) {
    return (
        <main className={styles.container}>
            <Navbar title="Shop"/>

            <CategorySelector categories={categories} />

        </main>
    )
}