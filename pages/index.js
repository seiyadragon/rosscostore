import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {FaHome, FaStore, FaUser, FaShoppingCart} from 'react-icons/fa'

export function Navbar({title}) {
  return (
    <section className={styles.navbar}>
      <Head>
        <title>{"RoßCo " + title}</title>
        <link rel="icon" href="/rossco_logo.png" />
      </Head>

      <section className={styles.nav_backdrop}>
        <section className={styles.nav}>
          <Link href='/'><span><FaHome /></span></Link>
          <Link href='/shop'><span><FaStore /></span></Link>
          <Link href='/cart'><span><FaShoppingCart /></span></Link>
          <Link href='/account'><span><FaUser /></span></Link>
        </section>
      </section>
      <h1 className={styles.title}>{title}</h1>
    </section>
  )
}

export function PictureText({text, image}) {
  return (
    <section className={styles.goals} style={{"backgroundImage": `url(${image})`}}>
        <span>{text}</span>
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

      <PictureText
        text="Here at RoßCo we love technology!"
        image = '/gpu-image.jpg'
      />

    </main>
  )
}
