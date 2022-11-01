import axios from "axios";
import Swal from "sweetalert2";

import {
  API_URL,
  LOGIN_ADMIN,
  CLEAR_TOKEN
} from "../actionTypes";

export const loginAdmin = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "POST",
      url: `${API_URL}/admin/adminLogin`,
      data
    })
      .then(({data}) => {
        dispatch({
          type: LOGIN_ADMIN,
          payload: data.access_token
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error ini loginAdmin adminAction");
        Swal.fire({
          icon: "error",
          title: "Invalid",
          text: err.response.data.message
        });
      });
  }
}

export const clearToken = () => {
  return {
    type: CLEAR_TOKEN
  }
}