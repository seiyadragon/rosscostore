import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export function Navbar({title}) {
  return (
    <div className={styles.navbar}>
      <Head>
        <title>{"RoßCo " + title}</title>
        <link rel="icon" href="/rossco_logo.png" />
      </Head>

      <div className={styles.nav}>
        <a><Link href='/'><text>Home</text></Link></a>
        <a><Link href='/shop'><text>Shop</text></Link></a>
        <a><Link href='/contact'><text>Contact</text></Link></a>
      </div>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}

export function PictureText({text, image}) {
  return (
    <section className={styles.goals}>
        <section><Image src={image} width='1920' height='1080'></Image></section>
        <text>{text}</text>
    </section>
  )
}

export default function Home() {
  return (
    <main className={styles.container}>
      <Navbar title="Home"/>

      <section>
        <section className={styles.logo}><Image src='/rossco_logo.png' width='1920' height='1080'></Image></section>
        <h1 className={styles.hook}>Everything you need. No need to leave!</h1>
      </section>

      <PictureText text="Here at RoßCo we love technology! And therefore want to bring you the latest and best in gadets at the lowest price!." image = '/gpu-image.jpg'/>

    </main>
  )
}
