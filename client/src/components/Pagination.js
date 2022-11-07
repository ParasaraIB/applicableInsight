import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const handlePageClick = (data) => props.onPaginationClick(data.selected);

  return (
    <div className="container mt-3">
      <ReactPaginate 
        previousLabel={"<<"}
        nextLabel={">>"}
        breakLabel={"..."}
        pageCount={props.pages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default Pagination;