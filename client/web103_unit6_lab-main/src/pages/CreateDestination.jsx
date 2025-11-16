import { useState } from "react";
import { useParams } from "react-router-dom";
import "./CreateDestination.css";

const CreateDestination = () => {
  const [destination, setDestination] = useState({
    destination: "",
    description: "",
    city: "",
    country: "",
    img_url: "",
    flag_img_url: "",
  });
  const { trip_id } = useParams();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDestination((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createDestination = async (event) => {
    event.preventDefault();

    try {
      // create destination
      const createRes = await fetch("http://localhost:3001/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destination),
      });
      if (!createRes.ok) throw new Error("Failed to create destination");
      const created = await createRes.json();

      // link destination to trip
      const linkRes = await fetch(
        "http://localhost:3001/api/trips_destinations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trip_id: parseInt(trip_id, 10),
            destination_id: created.id,
          }),
        }
      );
      if (!linkRes.ok) throw new Error("Failed to link destination to trip");

      // go to trip details
      window.location.href = `/trip/get/${trip_id}`;
    } catch (err) {
      console.error(err);
      alert("Could not create destination");
    }
  };

  return (
    <div>
      <center>
        <h3>Add Destination</h3>
      </center>
      <form>
        <label>Destination</label> <br />
        <input
          type="text"
          id="destination"
          name="destination"
          value={destination.destination}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Description</label>
        <br />
        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          value={destination.description}
          onChange={handleChange}
        ></textarea>
        <br />
        <label>City </label>
        <br />
        <input
          type="text"
          id="city"
          name="city"
          value={destination.city}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Country</label>
        <br />
        <input
          type="text"
          id="country"
          name="country"
          value={destination.country}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Image URL </label>
        <br />
        <input
          type="text"
          id="img_url"
          name="img_url"
          value={destination.img_url}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Flag Image URL</label>
        <br />
        <input
          type="text"
          id="flag_img_url"
          name="flag_img_url"
          value={destination.flag_img_url}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Trip ID</label>
        <br />
        <input
          type="text"
          id="flag_img_url"
          name="flag_img_url"
          value={trip_id}
          readOnly
        />
        <br />
        <br />
        <input type="submit" value="Submit" onClick={createDestination} />
      </form>
    </div>
  );
};

export default CreateDestination;
