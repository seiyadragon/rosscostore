const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const numPages = 1
const pageSize = 100

async function loadCategories() {
    console.log("Loading Categories...")

    let result = null
    try {
        result = await (await fetch("https://api.bigbuy.eu/rest/catalog/categories.json?isoCode=en", {
            method: "GET",
            mode: "cors",
            headers: {Authorization: `Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw`}
            })).json()
    } catch (error) {
        console.log("Could not load any categoriues...")
    }

    return result
}

async function loadProducts(numPages) {
    console.log("Loading Products...")

    let productsInfo = null
    let result = []

    for (let i = 0; i < numPages; i++) {
        try {
            productsInfo = await (await fetch("https://api.bigbuy.eu/rest/catalog/products.json?isoCode=en&pageSize=" + pageSize + "&page=" + i, {
            method: "GET",
            mode: "cors",
            headers: {Authorization: `Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw`}
            })).json()
        } catch (error) {
            console.log("Could not load products page " + i + "...")
        }

        productsInfo.map((info, index) => {
            let prodInfo = {
                id: info["id"],
                sku: info["sku"],
                category: info["category"],
            }

            result.push(prodInfo)
        })

        console.log("Loaded products page " + i + "...")
    }

    console.log("Loaded products info...")

    return result
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function setup() {
    const db = await sqlite.open({filename: "./database.sqlite", driver: sqlite3.Database})
    await db.migrate({force: "last"})

    console.log("Updating Database")

    //let categories = await loadCategories()

    //categories.map(async (category, index) => {
    //    await db.all("insert into Category (id, name, parentCategory) values(?, ?, ?);", [category.id, category.name, category.parentCategory])
    //    console.log(index + " Category: " + category.name)
    //})

    let products = await loadProducts(numPages)
    products.map(async (info, index) => {
        await db.all("insert into Product (id, sku) values(?, ?);", [info.id, info.sku])
        console.log(index + " " + info.id + " " + info.sku)
    })

    products.map(async (info, index) => {
        console.log("Loading Product... " + info.id)
        await delay(index * 5000)
        let dinfo = null
        try {
            dinfo = await (await fetch("https://api.bigbuy.eu/rest/catalog/productinformation/" + info.id + ".json?isoCode=en", {
            method: "GET",
            mode: "cors",
            headers: {Authorization: `Bearer NjU5YzM3MzllNjM5YzFiYzNkMTkxZmQ0NTMyNGI4MzU0NzViZDAyOTI3NWZlZDliYzdkNmRjYWM5OTRkNjc1Nw`}
            })).json()
        } catch (error) {
            console.log("Could not load products info page...")
            dinfo = []
        }

        await db.all("insert into ProductInfo (id, sku, name, description, category) values(?, ?, ?, ?, ?);", [info.id, info.sku, dinfo["name"], dinfo["description"], info.category])
        console.log([info.id, info.sku, dinfo["name"], dinfo["description"], info.category])
    })
}

setup()