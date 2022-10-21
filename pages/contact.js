import { Navbar } from ".";
import styles from '../styles/Contact.module.css'
import {FaCheck} from 'react-icons/fa'


export default function Contact() {
    return (
        <main className={styles.container}>
            <Navbar title="Contact"/>

            <section>
                <h1 className={styles.hook}>Please let us know about any concerns or feedback you have. We want to hear about it!</h1>
            </section>

            <section className={styles.contact}>
                <div className={styles.email}>
                    <h1 className={styles.text}>Email: </h1>
                    <input className={styles.message_area} type="email"/>
                </div>
                <div className={styles.message}>
                    <h1 className={styles.text}>Message: </h1>
                    <textarea className={styles.message_area} rows='20'/>
                </div>
                <div>
                    <button className={styles.submit}><FaCheck/></button>
                </div>
            </section>
        </main>
    )
}