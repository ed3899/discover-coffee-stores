//% libs
import {useState} from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");

  const success: PositionCallback = ({
    coords: {latitude, longitude},
  }: GeolocationPosition) => {
    setLatLong(`${latitude},${longitude}`);
    setLocationErrorMsg("");
  };

  const error: PositionErrorCallback = () => {
    setLocationErrorMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latLong,
    locationErrorMsg,
    handleTrackLocation,
  };
};

export default useTrackLocation;
