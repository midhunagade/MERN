import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlaceById = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`
        );
        console.log(responseData.place);
        setIdentifiedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place?.title,
              isValid: true,
            },
            description: {
              value: responseData.place?.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlaceById();
  }, [sendRequest, placeId, setFormData]);

  /* useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace?.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace?.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]); */

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!identifiedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the place!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push(`/${auth.userId}/places`)
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            type="text"
            label="Title"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={identifiedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            label="Description"
            element="textarea"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)"
            onInput={inputHandler}
            initialValue={identifiedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {" "}
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
