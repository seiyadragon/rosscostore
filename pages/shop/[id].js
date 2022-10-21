import { Navbar } from "..";
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

export async function getServerSideProps(context) {
    let catId = context.query.id

    const db = await sqlite.open({filename: "./database.sqlite", driver: sqlite3.Database})
    let cat = await db.all("select * from Category where id = ?;", [catId])
    let childCats = await db.all("select * from Category where parentCategory = ?;", [catId])
    
    let products = []
    for (let i = 0; i < childCats.length; i++) {
        let catItems = await db.all("select * from ProductInfo where category = ?;", [childCats[i].id])

        if (catItems.length > 0)
            catItems.map((item, index) => {
                products.push(item)
            })
    }

    return {
        props: {
            category: cat[0],
            products: products,
            childCategories: childCats
        }
    }
}

export default function category({category, products, childCategories}) {
    return (
        <main>
            <Navbar title={category.name}/>

            <ul>
                {childCategories.map((cat, index) => {
                    return (
                        <li>
                            <section>
                                <h1>{cat.name}</h1>
                                <ul>
                                    {products.map((prod, index) => {
                                        return <li><text>{prod.id}</text></li>
                                    })}
                                </ul>
                            </section>
                        </li>
                    )
                })}
            </ul>
        </main>
    )
}