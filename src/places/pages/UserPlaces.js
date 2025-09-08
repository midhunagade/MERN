import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`
        );
        console.log(responseData.places);
        setLoadedPlaces(responseData.places)
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
  }

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && <LoadingSpinner />}
    {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
    </>
  );
};

export default UserPlaces;
