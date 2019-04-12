import axios from "axios";

export function getRandomDialogs() {
  return dispatch => {
    axios
      .get("/candidates")
      .then(res => {
        dispatch({
          type: GET_CANDIDATES,
          candidates: res.data
        });
      })
      .catch(err => {
        console.log("Get candidates action: ", err);
      });
  };
}

export function getNextDialogs() {}
