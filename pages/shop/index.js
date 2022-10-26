import { Navbar } from "..";
import styles from '../../styles/Shop.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp" + 
"uYm56dXlpdXVhb2NibHR3ZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY3MjExMjEsImV4cCI6MTk4MjI5NzEyMX0.vnmH8LhJevM1ju-l9d0MnRXL6BmGNjOTw5XS0vO6NHY")

export async function getServerSideProps() {
    const {data: cats, error} = await supabase.from('Category').select().eq('parentCategory', 2) 

    if (error != null)
        console.log(error.details)

    return {
        props: {
            categories: cats
        }
    }
}

export function Category({category, image, link}) {
    return (
        <li>
            <a>
                <Link href={link}>
                    <section className={styles.category} style={{'backgroundImage': `url(${image})`}}>
                        <text>{category.name.replaceAll(' | ', ' ')}</text>
                    </section>
                </Link>
            </a>
        </li>
    )
}

export default function Shop({categories}) {
    return (
        <main className={styles.container}>
            <Navbar title="Shop"/>

            <section className={styles.categories}>
                <ul>
                    {categories.map((cat, index) => {
                        return <Category category={cat} image={cat.imageUrl} link={"/shop/" + cat.id + "?page=0"} key={index}/>
                    })}
                </ul>
            </section>

        </main>
    )
}