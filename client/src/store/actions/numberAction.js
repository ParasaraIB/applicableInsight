import axios from "axios";
import Swal from "sweetalert2";

import {
  API_URL,
  ADD_COUNTER
} from "../actionTypes";

export const addDocNumber = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "POST",
      url: `${API_URL}/number/addDocNumber`,
      data
    })
      .then(({data}) => {
        dispatch({
          type: ADD_COUNTER,
          payload: data
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< addDocNumber numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message
        });
      })
  }
}