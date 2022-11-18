import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "../components/Navbar";
import NumberList from "../components/NumberList";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {addDocNumber, listDocType, listUker} from "../store/actions/numberAction";
import Swal from "sweetalert2";

const Home = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [directedTo, setDirectedTo] = useState("");
  const [regarding, setRegarding] = useState("");
  const [picName, setPicName] = useState("");
  const [selected, setSelected] = useState("");
  const [docNum, setDocNum] = useState("");
  const [isM02, setIsM02] = useState(false);
  const [selectedUker, setSelectedUker] = useState("");
  const [uker, setUker] = useState("");
  const [isBackDate, setIsBackDate] = useState("");
  const [backDate, setBackDate] = useState("");
  const [isSendEmail, setIsSendEmail] = useState("");
  const [mailTo, setMailTo] = useState("");
  const [showClipboardMsg, setShowClipboardMsg] = useState(false);

  const numberInfo = useSelector(state => state.numberReducer.numberInfo);
  const docTypes = useSelector(state => state.numberReducer.docTypes);
  const ukers = useSelector(state => state.numberReducer.ukers);

  const inputJenisDokumen = (e) => {
    const typeOfDoc = JSON.parse(e.target.value);
    setName(typeOfDoc.name);
    setType(typeOfDoc.type);
    setSelected(e.target.value);
    if (typeOfDoc.type.includes("M.02")) setIsM02(true);
    else {
      setIsM02(false);
      setUker("");
      setSelectedUker("");
    }
  }
  const inputUker = (e) => {
    const typeOfUker = JSON.parse(e.target.value);
    setUker(typeOfUker.abbreviation);
    setSelectedUker(e.target.value);
  }
  const inputDirectedTo = (e) => {
    setDirectedTo(e.target.value);
  }
  const inputRegarding = (e) => {
    setRegarding(e.target.value);
  }
  const inputPicName = (e) => {
    setPicName(e.target.value);
  }
  const inputIsBackdate = (e) => {
    if (e.target.value === "true") {
      setIsBackDate("true");
      setBackDate(new Date());
    } else {
      setIsBackDate("false");
      setBackDate("");
    };
  }
  const inputBackDate = (date) => {
    setBackDate(date);
  }
  const inputSendEmail = (e) => {
    if (e.target.value === "true") {
      setIsSendEmail("true");
    } else {
      setIsSendEmail("false");
      setMailTo("");
    };
  }
  const inputMailTo = (e) => {
    setMailTo(e.target.value);
  }

  const handleClipboardClick = (e) => {
    setShowClipboardMsg(true);
  }
  const handleNotifClose = (e) => {
    setShowClipboardMsg(false);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !name || 
      (isM02 && !uker) || 
      !type || 
      !directedTo || 
      !regarding || 
      !picName || 
      (isBackDate === "true" && !backDate) ||
      (isSendEmail === "true" && !mailTo)
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "Isilah data dengan lengkap!",
      });
    } else {
      const newDocNumber = {
        name,
        uker,
        type,
        directed_to: directedTo,
        regarding,
        pic_name: picName,
        isBackDate: isBackDate === "true" ? true : false,
        backDate,
        mail_to: mailTo
      };
      dispatch(addDocNumber(newDocNumber));
      setName("");
      setUker("");
      setSelectedUker("");
      setType("");
      setSelected("");
      setDirectedTo("");
      setRegarding("");
      setPicName("");
      setIsBackDate("");
      setBackDate("");
      setIsSendEmail("");
      setMailTo("");
    }
  }

  useEffect(() => {
    if (numberInfo) {
      setDocNum(numberInfo);
    }
    dispatch(listDocType());
    dispatch(listUker());
  }, [numberInfo, docNum, dispatch])

  return (
    <div className="container-fluid">
      {
        showClipboardMsg ? (
        <div className="row position-fixed" style={{backgroundColor: "#FFD966", width: "100%"}}>
          <div className="col text-center" style={{color: "#843C0C"}}>
            <strong>Nomor dokumen berhasil di salin ke clipboard!</strong>
          </div>
          <button type="button" className="btn-close" aria-label="Close" onClick={handleNotifClose}></button>
        </div>
        ) : (
          <></>
        )
      }
      <div className="row flex-nowrap">
        <Navbar />
        <div className="col ms-5">
          <form onSubmit={handleSubmit}>
            <div className="container mt-5">

              <div className="row">
                <div className="col-2">
                  <label>Jenis Dokumen</label>
                </div>
                <div className="col-4">
                  <select className="form-select" aria-label="Default select example" onChange={inputJenisDokumen} value={selected} required>
                    <option value="" disabled>Jenis Dokumen...</option>
                    {
                      docTypes.map(doc => {
                        return (
                          <option key={doc._id} value={JSON.stringify(doc)}>{doc.name} - {doc.type}</option>
                        );
                      })
                    }
                  </select>
                </div>
              </div>

              {
                isM02 ? (
                  <div className="row mt-3">
                    <div className="col-2">
                      <label>Unit Kerja</label>
                    </div>
                    <div className="col-4">
                      <select className="form-select" aria-label="Defalult select example" onChange={inputUker} value={selectedUker} required>
                        <option value="" disabled>Unit Kerja...</option>
                        {
                          ukers.map(el => {
                            return (
                              <option key={el._id} value={JSON.stringify(el)}>{el.abbreviation}</option>
                            ); 
                          })
                        }
                      </select>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }

              <div className="row mt-3">
                <div className="col-2">
                  <label>Kepada</label>
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" aria-label="Kepada" aria-describedby="basic-addon1" value={directedTo} onChange={inputDirectedTo} required />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-2">
                  <label>Perihal</label>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={regarding} onChange={inputRegarding}></textarea>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-2">
                  <label>Nama PIC</label>
                </div>
                <div className="col-4">
                  <input type="text" className="form-control" aria-label="Nama PIC" aria-describedby="basic-addon1" value={picName} onChange={inputPicName} required />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-2">
                  <label>Jenis Penomoran</label>
                </div>
                <div className="col-2">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="false" checked={isBackDate === "false"} onChange={inputIsBackdate} required />
                  <label className="form-check-label ms-2" htmlFor="inlineRadio1">NORMAL</label>
                </div>
                <div className="col-2">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="true" checked={isBackDate === "true"} onChange={inputIsBackdate} required />
                  <label className="form-check-label ms-2" htmlFor="inlineRadio2">BACKDATE</label>
                </div>
              </div>

              {
                isBackDate === "true" ? (
                  <div className="row mt-3">
                    <div className="col-2">
                      <label>Tanggal Backdate</label>
                    </div>
                    <div className="col-4">
                      <DatePicker selected={backDate} onChange={inputBackDate} />
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }

              <div className="row mt-3">
                <div className="col-2">
                  <label>Kirimkan Nomor</label>
                </div>
                <div className="col-2">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio3" value="true" checked={isSendEmail === "true"} onChange={inputSendEmail} required />
                  <label className="form-check-label ms-2" htmlFor="inlineRadio3">Ya</label>
                </div>
                <div className="col-2">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio4" value="false" checked={isSendEmail === "false"} onChange={inputSendEmail} required />
                  <label className="form-check-label ms-2" htmlFor="inlineRadio4">Tidak</label>
                </div>
              </div>

              {
                isSendEmail === "true" ? (
                  <div className="row mt-3">
                    <div className="col-2">
                      <label>Email</label>
                    </div>
                    <div className="col-4">
                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="address@example.com" value={mailTo} onChange={inputMailTo} />
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }

              <div className="row mt-3">
                <div className="col-6 d-flex justify-content-end">
                  <button type="submit" className="btn btn-dark">
                    <i className="bi bi-arrow-repeat"></i>Generate
                  </button>
                </div>
              </div>

              {
                docNum ? (
                  <div className="row mt-5">
                    <div className="col-3">
                      <p>Nomor Dokumen Anda: <strong id="copas">{docNum.doc_number}</strong>
                      </p>
                    </div>
                    <div className="col-1">
                      <button type="button" className="btn btn-outline-secondary btn-clipboard" data-clipboard-target="#copas" onClick={handleClipboardClick}>
                        <i className="bi bi-clipboard2"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }

            </div>
          </form>
          <div className="row mt-5 d-flex justify-content-center">
            <NumberList />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );

}

export default Home;