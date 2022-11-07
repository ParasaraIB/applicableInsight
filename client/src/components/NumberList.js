import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { listDocnumber, setPage, showLoading } from "../store/actions/numberAction";
import { style } from "glamor";
import Pagination from "../components/Pagination";
import axios from "axios";
import FileDownload from "js-file-download";
import { API_URL } from "../store/actionTypes";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const NumberList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hoverStyle = {backgroundColor: "#ffffff", height: "30px", width: "100%", padding: "6px", fontsize: "16px", transition: "all ease .5s", ":hover": {cursor: "pointer", backgroundColor: "#E0E0E0", color: "#000000" }};
  
  const [, setCurrentPage] = useState("");
  const [search, setSearch] = useState("");
  const [qParams, setQParams] = useState({});
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  
  const numberInfos = useSelector(state => state.numberReducer.numberInfos);
  const pages = useSelector(state => state.numberReducer.pages);
  const numberInfosPage = useSelector(state => state.numberReducer.page);
  const isShowLoading = useSelector(state => state.numberReducer.isShowLoading);

  const getCurrentPage = (page=0) => {
    setCurrentPage(page);
    setQParams({...qParams, page});
    dispatch(showLoading(true));
    dispatch(setPage(page));
  }

  const inputSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleDownloadRekap = (e) => {
    setIsDownloadLoading(true);
    const currentDate = new Date();
    axios({
      method: "GET",
      url: `${API_URL}/number/downloadDocNumber`,
      headers: {
        access_token: localStorage.getItem("access_token")
      },
      responseType: "blob"
    })
      .then(({data}) => {
        const filename = `${currentDate.toISOString().split('T')[0].replaceAll("-", "")}RekapPengambilanNomor.xlsx`;
        FileDownload(data, filename);
        setIsDownloadLoading(false);
      })
      .catch(err => {
        console.error(err, "<<< error in handleDownloadRekap");
      });
  }

  const handleSearchPress = (e) => {
    if (e.key === "Enter") {
      const newQParams = {
        ...qParams,
        search
      }
      setQParams(newQParams);
      dispatch(listDocnumber(newQParams));
    }
  }

  const handleDetail = (e, numId) => {
    navigate(`/numberDetail/${numId}`);
  }

  useEffect(() => {
    const newQParams = {
      ...qParams,
      page: numberInfosPage
    }
    dispatch(listDocnumber(newQParams));
  }, [dispatch, qParams, numberInfosPage]);


  return (
    <div className="col">
      <div className="container">
        <div className="row">
          <div className="row mt-3">
            <div className="input-group mb-3" >
              <input type="text" className="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1" onChange={inputSearch} onKeyUp={handleSearchPress} required />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {
              !isDownloadLoading ? (
                <button type="submit" className="btn btn-sm btn-secondary" onClick={handleDownloadRekap}>
                  <i className="bi bi-filetype-xlsx"></i>Download Rekap
                </button>
              ) : (
                <button class="btn btn-sm btn-secondary" type="button" disabled>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Loading...
                </button>
              )
            }
          </div>
        </div>
        <div className="row mt-3">
          {
            isShowLoading ? (
              <Loader />
            ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nomor Dokumen</th>
                  <th scope="col">Tanggal Pengambilan</th>
                  <th scope="col">Ditujukan Kepada</th>
                  <th scope="col">Perihal</th>
                  <th scope="col">PIC</th>
                </tr>
              </thead>
              <tbody>
                {
                  numberInfos.map(num => {
                    return (
                      <tr key={num._id} {...style(hoverStyle)} onClick={(e) => handleDetail (e,num._id )}>
                        <td>{num.doc_number}</td>
                        <td>{num.created_at.split('T')[0]} {new Date(num.created_at).toLocaleTimeString("en-US")}</td>
                        <td>{num.directed_to}</td>
                        <td>{num.regarding}</td>
                        <td>{num.pic_name}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
            )
          }
        </div>
      </div>
      <Pagination onPaginationClick={getCurrentPage} pages={pages} />
    </div>
  )
}

export default NumberList;