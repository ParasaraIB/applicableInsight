import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import jwt_decode from "jwt-decode";
import { deleteDocNumber, deleteOnOneDrive, detailDocNumber, editDocNumber, showLoading, uploadToOneDrive } from "../store/actions/numberAction";

const NumberDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const hiddenFileInput = useRef(null);

  const docInfo = useSelector(state => state.numberReducer.detailDocNumber);
  const isShowLoading = useSelector(state => state.numberReducer.isShowLoading);
  const loggedInPic = jwt_decode(localStorage.getItem("access_token"));


  const [directedTo, setDirectedTo] = useState("");
  const [regarding, setRegarding] = useState("");
  const [picName, setPicName] = useState("");
  const [enableDirectedTo, setEnableDirectedTo] = useState(false);
  const [enableRegarding, setEnableRegarding] = useState(false);
  const [enablePicName, setEnablePicName] = useState(false);
  
  const handleBack = (e) => {
    navigate(-1);
  }

  const handleRenderHomeMenu = () => {
    return true;
  }

  const inputDirectedTo = (e) => {
    setDirectedTo(e.target.value);
  }

  const handleEnableDirectedTo = (e, obj) => {
    setEnableDirectedTo(obj.decision);
    if (obj.initialValue) setDirectedTo(obj.initialValue);
  }

  const inputRegarding = (e) => {
    setRegarding(e.target.value);
  }

  const handleEnableRegarding = (e, obj) => {
    setEnableRegarding(obj.decision);
    if (obj.initialValue) setRegarding(obj.initialValue);
  }

  const inputPicName = (e) => {
    setPicName(e.target.value);
  }

  const handlePicName = (e, obj) => {
    setEnablePicName(obj.decision);
    if (obj.initialValue) setPicName(obj.initialValue);
  }

  const handleDelete = (e) => {
    Swal.fire({
      title: "Hapus nomor dokumen?",
      text: "Nomor yang dihapus akan tersedia di pengambilan berikutnya",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDocNumber(id, navigate));
      }
    });
  }

  const handleSubmitEdit = (e) => {
    if (!directedTo || !regarding || !picName) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "Isilah data dengan lengkap!",
      });
    } else {
      Swal.fire({
        title: "Edit info dokumen?",
        text: "Pastikan data sudah benar dan lengkap",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Simpan"
      }).then((result) => {
        if (result.isConfirmed) {
          const editedDocNumber = {
            _id: id,
            directed_to: directedTo,
            regarding,
            pic_name: picName
          };
          dispatch(editDocNumber(editedDocNumber));
        }
      });
      setDirectedTo(docInfo.directed_to);
      setRegarding(docInfo.regarding);
      setPicName(docInfo.pic_name);
      setEnableDirectedTo(false);
      setEnableRegarding(false);
      setEnablePicName(false);
    }
  }

  const handleUpload = (e) => {
    hiddenFileInput.current.click();
  }

  const handleHiddenFileInput = (e) => {
    if(e.target.files.length > 1) {
      Swal.fire({
        icon: "error",
        title: "Jumlah File Melebihi Kapasitas",
      });
    } else {
      const fileUploaded = e.target.files[0];
      if (fileUploaded.size > 4 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Ukuran File Melebihi 4 MB",
        });
      } else {
        const data = new FormData();
        data.append("file", fileUploaded);
        data.append("fileName", fileUploaded.name);
        data.append("_id", id);
        dispatch(showLoading(true));
        dispatch(uploadToOneDrive(data));
      }
    }
  }

  const handleDeleteDocs = (e, oneDrive_ItemId) => {
    Swal.fire({
      title: "Hapus dokumen?",
      text: "Cek kembali dokumen yang akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(showLoading(true));
        dispatch(deleteOnOneDrive({_id: id, oneDrive_ItemId}));
      }
    });
  }

  useEffect(() => {
    dispatch(detailDocNumber(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (docInfo) {
      setDirectedTo(docInfo.directed_to);
      setRegarding(docInfo.regarding);
      setPicName(docInfo.pic_name);
    }
  }, [dispatch, docInfo]);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Navbar onNavbarRendered={handleRenderHomeMenu} />
        <div className="col ms-5 mt-5">
          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-start" style={{marginRight: 0}}>
                <h3 style={{cursor: "pointer", color: "#045498"}} onClick={handleBack}><i className="bi bi-arrow-left"></i></h3>
                <h4 className="ms-4" style={{color: "#045498"}}>Document Detail</h4>
              </div>
              <hr />
            </div>
          </div>
          {isShowLoading && <Loader />}
          {
            docInfo ? (
            <div className="container mt-3">
              <div className="row">
                <div className="col-2">
                  <label>Nomor Dokumen</label>
                </div>
                <div className="col-4">
                  <h6>{docInfo.doc_number}</h6>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Jenis Penomoran</label>
                </div>
                <div className="col-4">
                  <h6>{docInfo.isBackDate ? "BACKDATE" : "NORMAL"}</h6>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Tanggal Pengambilan</label>
                </div>
                <div className="col-4">
                  <h6>{docInfo.created_at.split('T')[0]} {new Date(docInfo.created_at).toLocaleTimeString("en-US")}</h6>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Kepada</label>
                </div>
                <div className="col-6 d-flex">
                  <input type="text" className="form-control" aria-label="Kepada" aria-describedby="basic-addon1" value={directedTo} onChange={inputDirectedTo} disabled={!enableDirectedTo} />
                  {
                    !enableDirectedTo ? (
                      <>
                        <button type="submit" className="btn btn-sm btn-secondary ms-3" onClick={(e) => handleEnableDirectedTo(e, {decision: true})} disabled={loggedInPic.visitor ? true : false}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Edit</div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="btn btn-sm btn-primary ms-3" onClick={handleSubmitEdit}>
                          <div className="col d-flex"><i className="bi bi-check-circle"></i>Save</div>
                        </button>
                        <button type="submit" className="btn btn-sm btn-warning ms-3" onClick={(e) => handleEnableDirectedTo(e, {decision: false, initialValue: docInfo.directed_to})}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Cancel</div>
                        </button>
                      </>
                    )
                  }
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Perihal</label>
                </div>
                <div className="col-6 d-flex">
                  <input type="text" className="form-control" aria-label="Perihal" aria-describedby="basic-addon1" value={regarding} onChange={inputRegarding} disabled={!enableRegarding} />
                  {
                    !enableRegarding ? (
                      <>
                        <button type="submit" className="btn btn-sm btn-secondary ms-3" onClick={(e) => handleEnableRegarding(e, {decision: true})} disabled={loggedInPic.visitor ? true : false}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Edit</div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="btn btn-sm btn-primary ms-3" onClick={handleSubmitEdit}>
                          <div className="col d-flex"><i className="bi bi-check-circle"></i>Save</div>
                        </button>
                        <button type="submit" className="btn btn-sm btn-warning ms-3" onClick={(e) => handleEnableRegarding(e, {decision: false, initialValue: docInfo.regarding})}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Cancel</div>
                        </button>
                      </>
                    )
                  }
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>PIC</label>
                </div>
                <div className="col-6 d-flex">
                  <input type="text" className="form-control" aria-label="PIC" aria-describedby="basic-addon1" value={picName} onChange={inputPicName} disabled={!enablePicName} />
                  {
                    !enablePicName ? (
                      <>
                        <button type="submit" className="btn btn-sm btn-secondary ms-3" onClick={(e) => handlePicName(e, {decision: true})} disabled={loggedInPic.visitor ? true : false}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Edit</div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="btn btn-sm btn-primary ms-3" onClick={handleSubmitEdit}>
                          <div className="col d-flex"><i className="bi bi-check-circle"></i>Save</div>
                        </button>
                        <button type="submit" className="btn btn-sm btn-warning ms-3" onClick={(e) => handlePicName(e, {decision: false, initialValue: docInfo.pic_name})}>
                          <div className="col d-flex"><i className="bi bi-pencil-square"></i>Cancel</div>
                        </button>
                      </>
                    )
                  }
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Diambil Oleh</label>
                </div>
                <div className="col-4">
                  <h6>{docInfo.created_by.nip} - {docInfo.created_by.full_name}</h6>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-2">
                  <label>Link Dokumen</label>
                </div>
                <div className="col-4">
                  {
                    (docInfo.document_links && docInfo.document_links.length) ? (
                      <>
                        {
                          docInfo.document_links.map ((el, index) => {
                            return (
                              <div className="container p-0" key={index}>
                                <div className={index > 0 ? "row mt-2" : "row"}>
                                  <div className="col d-flex">
                                    <a href={el.webUrl} target="_blank" rel="noreferrer">{el.webUrl}</a>
                                    <button type="submit" className="btn btn-sm btn-warning ms-2" onClick={(e) => handleDeleteDocs(e, el.oneDrive_ItemId)}>
                                      <i className="bi bi-trash3"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        }
                      </>
                    ): (
                      <></>
                    )
                  }
                  <button type="submit" className="btn btn-primary btn-sm mt-3" onClick={handleUpload} disabled={(docInfo.document_links && docInfo.document_links.length >= 3) || loggedInPic.visitor ? true : false}>
                    <i className="bi bi-file-earmark-arrow-up"></i>Upload Dokumen
                  </button>
                  <input 
                    name="file"
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleHiddenFileInput}
                    style={{display: "none"}}
                  />
                  <p className="text-muted">
                    <em>
                      <small>*Ukuran file maksimal 4 MB</small>
                    </em>
                  </p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-8 d-flex justify-content-end">
                  <button type="submit" className="btn btn-danger" onClick={handleDelete} disabled={loggedInPic.visitor ? true : false}>
                    <i className="bi bi-trash3"></i>Delete
                  </button>
                </div>
              </div>
            </div>
            ) : (
              <></>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default NumberDetail;