import { useParams } from 'react-router-dom';
import './Card.css'


const AddTripOptionCard = (props) =>  {
  const {destination_id} = useParams();

  const addToTrip = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/trips_destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_id: props.id, destination_id: parseInt(destination_id, 10) })
      });
      if (!res.ok) throw new Error('Failed to add destination to trip');
      alert('Destination added to trip');
      // navigate back to destinations or trip details
      window.location.href = `/trip/get/${props.id}`;
    } catch (err) {
      console.error(err);
      alert('Could not add destination to trip');
    }

  }

  return (
      <div className="Card" style={{ backgroundImage:`url(${props.img_url})`}} >
        <div className="card-info">
          <h2 className="title">{props.title}</h2>
          <p className="description">{props.description}</p>
          <button className="addToTrip" onClick={addToTrip}>+ Add to Trip</button>
        </div>
      </div>
  );
};

export default AddTripOptionCard;