
import React, { useEffect, useState } from "react";
import styles from "../styles/SeatOverview.module.css";
import { useAuth } from "../context/AuthContext";

const SeatOverview = () => {
  const { auth } = useAuth();
  const [trains, setTrains] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState("");
  const [seatData, setSeatData] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all trains on mount
  useEffect(() => {
    if (!auth?.token || !auth.roles.includes("SUPERADMIN_ROLE")) {
      setError("You are not authorized to view this data.");
      setLoadingTrains(false);
      return;
    }

    const fetchTrains = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/train/get-all-train?page=0&size=100`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch trains");
        const data = await res.json();
        setTrains(data.content || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingTrains(false);
      }
    };

    fetchTrains();
  }, [auth]);

  // Fetch seat summary when train is selected
  useEffect(() => {
    if (!selectedTrainId) return;

    const fetchSeats = async () => {
      setLoadingSeats(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/seat/${selectedTrainId}/seats/summary`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch seat summary");
        const data = await res.json();
        setSeatData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [selectedTrainId, auth]);

  if (loadingTrains) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading trains...</p>
      </div>
    );
  }

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Seat Overview</h1>

      {/* <label htmlFor="train-select">Select Train:</label>
      <select
        id="train-select"
        value={selectedTrainId}
        onChange={(e) => setSelectedTrainId(e.target.value)}
      >
        <option value="">-- Choose a Train --</option>
        {trains.map((train) => (
          <option key={train.id} value={train.id}>
            {train.name || train.trainName}
          </option>
        ))}
      </select> */}

      <label htmlFor="train-select">Select Train:</label>
<select
  id="train-select"
  className={styles.trainSelect} // use CSS Module class
  value={selectedTrainId}
  onChange={(e) => setSelectedTrainId(e.target.value)}
>
  <option value="">-- Choose a Train --</option>
  {trains.map((train) => (
    <option key={train.id} value={train.id}>
      {train.name || train.trainName}
    </option>
  ))}
</select>


      {loadingSeats && (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Loading seat summary...</p>
        </div>
      )}

      {!loadingSeats && seatData.length > 0 && (
        <div className={styles.cards}>
          {seatData.map((seatClass, idx) => (
            <div key={idx} className={`${styles.card} ${styles.cardHeader}`}>
              <h3>{seatClass.trainClass.replace("_", " ")}</h3>
              <p>Total Seats: {seatClass.totalSeats}</p>
              {/* <p>Available: {seatClass.availableSeats}</p> */}
              <p>Booked: {seatClass.Booked}</p>
              {/* <p>Locked: {seatClass.locked}</p> */}
              {/* <p>Unavailable: {seatClass.unAvailable}</p> */}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${
                      (seatClass.availableSeats / seatClass.totalSeats) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatOverview;
