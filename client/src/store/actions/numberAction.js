import axios from "axios";
import Swal from "sweetalert2";

import {
  API_URL,
  ADD_COUNTER,
  LIST_DOCNUMBER,
  LIST_DOCTYPE,
  SET_PAGE,
  LIST_UKER,
  DETAIL_DOCNUMBER,
  DELETE_DOCNUMBER,
  EDIT_DOCNUMBER,
  SHOW_LOADING,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT
} from "../actionTypes";

export const addDocNumber = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "POST",
      url: `${API_URL}/number/addDocNumber`,
      headers: {
        access_token: localStorage.getItem("access_token")
      },
      data
    })
      .then(({data}) => {
        dispatch({
          type: ADD_COUNTER,
          payload: data
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Nomor dokumen berhasil diambil",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in addDocNumber numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "error in addDocNumber numberAction"
        });
      })
  }
}

export const listDocnumber = (qParams) => {
  return (dispatch, getState) => {
    const {
      page=0,
      search="",
      type="",
      uker=""
    } = qParams;

    axios({
      method: "GET",
      url: `${API_URL}/number/listDocNumber?page=${page}&search=${search}&type=${type}&uker=${uker}`,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: LIST_DOCNUMBER,
          payload: data
        });
        dispatch({
          type: SHOW_LOADING,
          payload: false
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in listDocnumber numberAction");
      });
    
  }
}

export const listDocType = () => {
  return (dispatch, getState) => {
    axios({
      method: "GET",
      url: `${API_URL}/number/listDoctype`,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: LIST_DOCTYPE,
          payload: data
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in listDocType numberAction");
      });
  }
}

export const setPage = (page) => {
  return {
    type: SET_PAGE,
    page
  }
}

export const listUker = () => {
  return (dispatch, getState) => {
    axios({
      method: "GET",
      url: `${API_URL}/number/listUker`,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: LIST_UKER,
          payload: data
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in listUker numberAction");
      });
  }
}

export const detailDocNumber = (id) => {
  return (dispatch, getState) => {
    axios({
      method: "GET",
      url: `${API_URL}/number/detailDocNumber?id=${id}`,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: DETAIL_DOCNUMBER,
          payload: data
        });
        dispatch({
          type: SHOW_LOADING,
          payload: false
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in detailDocNumer numberAction");
      });
  }
}

export const deleteDocNumber = (_id, navigate) => {
  return (dispatch, getState) => {
    axios({
      method: "DELETE",
      url: `${API_URL}/number/deleteDocNumber`,
      headers: {
        access_token: localStorage.getItem("access_token")
      },
      data: {
        _id
      }
    })
      .then(({data}) => {
        dispatch({
          type: DELETE_DOCNUMBER,
          payload: data
        });
        navigate("/home");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Nomor dokumen berhasil dihapus",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(err => {
        console.error(err, "<<<< error in deletedDocNumber numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "error in addDocNumber numberAction"
        });
      });
  }
}

export const editDocNumber = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "PUT",
      url: `${API_URL}/number/editDocNumber`,
      headers: {
        access_token: localStorage.getItem("access_token")
      },
      data
    })
      .then(({data}) => {
        dispatch({
          type: EDIT_DOCNUMBER,
          payload: data
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Info dokumen berhasil diedit",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in editDocNumber numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "error in addDocNumber numberAction"
        });
      });
  }
}

export const showLoading = (data) => {
  return (dispatch, getState) => {
    dispatch({
      type: SHOW_LOADING,
      payload: data
    });
  }
}

export const uploadToOneDrive = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "POST",
      url: `${API_URL}/number/uploadToOneDrive`,
      data,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: UPLOAD_DOCUMENT,
          payload: data
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Dokumen berhasil diupload",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in uploadToOneDrive numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "error in uploadToOneDrive numberAction"
        });
      })
      .finally(() => {
        dispatch({
          type: SHOW_LOADING,
          payload: false
        });
      });
  }
}

export const deleteOnOneDrive = (data) => {
  return (dispatch, getState) => {
    axios({
      method: "DELETE",
      url: `${API_URL}/number/deleteOnOneDrive`,
      data,
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
      .then(({data}) => {
        dispatch({
          type: DELETE_DOCUMENT,
          payload: data
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Dokumen berhasil dihapus",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(err => {
        console.error(err.response, "<<<< error in deleteOnOneDrive numberAction");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "error in uploadToOneDrive numberAction"
        });
      })
      .finally(() => {
        dispatch({
          type: SHOW_LOADING,
          payload: false
        });
      });
  }
}