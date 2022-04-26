//% libs
import {useState} from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success: PositionCallback = ({
    coords: {latitude, longitude},
  }: GeolocationPosition) => {
    setLatLong(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsFindingLocation(false);
  };

  const error: PositionErrorCallback = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latLong,
    locationErrorMsg,
    isFindingLocation,
    handleTrackLocation,
  };
};

export default useTrackLocation;
