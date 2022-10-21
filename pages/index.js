import Head from 'next/head'
import styles from '../styles/Home.module.css'

export function Navbar({title}) {
  return (
    <div className={styles.navbar}>
      <Head>
        <title>{"RoßCo " + title}</title>
        <link rel="icon" href="/rossco_logo.png" />
      </Head>

      <img className={styles.logo} src='/rossco_logo.png'></img>
      <div className={styles.nav}>
        <a href='/'><text>Home</text></a>
        <a href='/shop'><text>Shop</text></a>
        <a href='/contact'><text>Contact</text></a>
      </div>
      <h1 className={styles.title}>{title}</h1>
    </div>
  )
}

export function PictureText({text, image}) {
  return (
    <section className={styles.goals}>
        <img src={image}></img>
        <text>{text}</text>
      </section>
  )
}

export default function Home() {
  return (
    <main className={styles.container}>
      <Navbar title="Home"/>

      <section>
        <h1 className={styles.hook}>Everything you need. No need to leave!</h1>
      </section>

      <PictureText text="Here at RoßCo we love technology! And therefore want to bring you the latest and best in gadets at the lowest price!." image = 'gpu-image.jpg'/>

    </main>
  )
}
