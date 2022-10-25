import { Navbar } from "..";
import styles from '../../styles/Shop.module.css'
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

export async function getServerSideProps() {
    const db = await sqlite.open({filename: "./database.sqlite", driver: sqlite3.Database})
    let cats = await db.all("select * from Category where parentCategory = 2")


    return {
        props: {
            categories: cats
        }
    }
}

export function Category({category, image, link}) {
    return (
        <li>
            <a href={link}>
                <section className={styles.category} style={{'backgroundImage': `url(${image})`}}>
                    <text>{category.name.replaceAll(' | ', ' ')}</text>
                </section>
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
                        return <Category category={cat} image={cat.image} link={"/shop/" + cat.id} key={index}/>
                    })}
                </ul>
            </section>

        </main>
    )
}