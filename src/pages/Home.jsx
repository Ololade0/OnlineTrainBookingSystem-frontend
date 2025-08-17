import React from "react";
import Layout from "../components/Layout";
import styles from "../styles/HomePage.module.css";

const Home = () => {
  return (
    <Layout>
      <section className={styles.hero}>
        <h1>Welcome to Ololade TrainBooking 🚆</h1>
        <p>Book your train tickets easily and securely</p>
        <a href="/book" className={styles.cta}>
          Book Ticket Now
        </a>
      </section>
            <section className={styles.features}>
        <div className={styles.card}>
          <h3>📅 Train Timetable</h3>
          <p>Check upcoming train routes and timings.</p>
        </div>
        <div className={styles.card}>
          <h3>💳 Payment Options</h3>
          <p>Learn more about available payment methods and security.</p>
        </div>
        <div className={styles.card}>
          <h3>📞 Contact Us</h3>
          <p>Need help? Reach out to our support team anytime.</p>
        </div>
      </section>


    </Layout>
  );
};

export default Home;
