import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "../components/Navbar";

import {addDocNumber} from "../store/actions/numberAction";

const Home = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [directedTo, setDirectedTo] = useState("");
  const [regarding, setRegarding] = useState("");
  const [picName, setPicName] = useState("");
  const [selected, setSelected] = useState("");
  const [docNum, setDocNum] = useState("");

  const numberInfo = useSelector((state) => state.numberReducer.numberInfo);

  const inputJenisDokumen = (e) => {
    const jenisDoc = JSON.parse(e.target.value);
    setName(jenisDoc.name);
    setType(jenisDoc.type);
    setSelected(e.target.value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDocNumber = {
      name,
      type,
      directed_to: directedTo,
      regarding,
      pic_name: picName
    };
    dispatch(addDocNumber(newDocNumber));
    setName("");
    setType("");
    setSelected("");
    setDirectedTo("");
    setRegarding("");
    setPicName("");
  }

  useEffect(() => {
    if (numberInfo) {
      setDocNum(numberInfo)
    }
  }, [numberInfo, docNum])

  return (
    <div className="container-fluid">
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
                    <option value={JSON.stringify({name: "MEMORANDUM", type: "M.01/Rhs"})}>MEMORANDUM - M.01/Rhs</option>
                    <option value={JSON.stringify({name: "MEMORANDUM", type: "M.01/B"})}>MEMORANDUM - M.01/B</option>
                    <option value={JSON.stringify({name: "SURAT", type: "Srt/Rhs"})}>SURAT - Srt/Rhs</option>
                    <option value={JSON.stringify({name: "SURAT", type: "Srt/B"})}>SURAT - Srt/B</option>
                    <option value={JSON.stringify({name: "FAKSIMILI", type: "Fax/Rhs"})}>FAKSIMILI - Fax/Rhs</option>
                    <option value={JSON.stringify({name: "FAKSIMILI", type: "Fax/B"})}>FAKSIMILI - Fax/B</option>
                    <option value={JSON.stringify({name: "BERITA ACARA", type: "BA/Rhs"})}>BERITA ACARA - BA/Rhs</option>
                    <option value={JSON.stringify({name: "BERITA ACARA", type: "BA/B"})}>BERITA ACARA - BA/B</option>
                    <option value={JSON.stringify({name: "PERJANJIAN", type: "P/Rhs"})}>PERJANJIAN - P/Rhs</option>
                    <option value={JSON.stringify({name: "PERJANJIAN", type: "P/B"})}>PERJANJIAN - P/B</option>
                    <option value={JSON.stringify({name: "SURAT KUASA", type: "SK/Rhs"})}>SURAT KUASA - SK/Rhs</option>
                    <option value={JSON.stringify({name: "SURAT KUASA", type: "SK/B"})}>SURAT KUASA - SK/B</option>
                    <option value={JSON.stringify({name: "RISALAH RAPAT", type: "Rsl/Rhs"})}>RISALAH RAPAT - Rsl/Rhs</option>
                    <option value={JSON.stringify({name: "RISALAH RAPAT", type: "Rsl/B"})}>RISALAH RAPAT - Rsl/B</option>
                    <option value={JSON.stringify({name: "RISALAH RAPAT", type: "KEP.GBI/KPa"})}>RISALAH RAPAT - KEP.GBI/KPa</option>
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-2">
                  <label>Kepada</label>
                </div>
                <div className="col-4">
                  <div className="input-group">
                    <input type="text" className="form-control" aria-label="Kepada" aria-describedby="basic-addon1" value={directedTo} onChange={inputDirectedTo} required />
                  </div>
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
                  <div className="input-group">
                    <input type="text" className="form-control" aria-label="PIC" aria-describedby="basic-addon1" value={picName} onChange={inputPicName} required />
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-6 d-flex justify-content-end">
                  <button type="submit" className="btn btn-dark">
                    Generate
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
                      <button type="button" className="btn btn-outline-secondary btn-clipboard" data-clipboard-target="#copas">
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
        </div>
      </div>
    </div>
  );

}

export default Home;