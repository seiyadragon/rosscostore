import { Navbar } from "..";
import styles from '../../styles/Shop.module.css'
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jnbnzuyiuuaocbltwewu.supabase.co", process.env.SUPABASE_AUTH)

export async function getStaticProps() {
    const {data: cats, error} = await supabase.from('Category').select('*').eq('parentCategory', 2) 

    if (error != null)
        console.log(error.details)

    return {
        props: {
            categories: cats
        }
    }
}

export function Category({category, backgroundColor, color, link}) {
    let name = category.name.split(" | ")

    return (
        <li>
            <Link href={link} style={{"textDecoration": "none"}}>
                <section className={styles.category} style={{"backgroundColor": backgroundColor, "color": color}}>
                    <strong><span>{name[0]}</span></strong>
                </section>
            </Link>
        </li>
    )
}

export function CategorySelector({categories, currentCategory}) {
    return (
        <section className={styles.categories}>
            {currentCategory == null &&
                <section className={styles.noCategory}>
                    <span>{"There is nothing you won't find at RoßCo!"}</span>
                </section>
            }
            
            <ul>
                {categories.map((cat, index) => {
                    if (currentCategory != null && cat.id === currentCategory.id)
                        return <Category category={cat} backgroundColor="orangered" color="black" link={"/shop/" + cat.id} key={index}/>
                    else {
                        return <Category category={cat} backgroundColor="#810020" color="orangered" link={"/shop/" + cat.id} key={index}/>
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