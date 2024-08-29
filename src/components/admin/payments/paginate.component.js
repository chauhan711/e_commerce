import React from 'react';
  
const Paginate = (props) =>  {
	const paginationNumbers = [];
	for (let i = 1; i <= Math.ceil(props.length / props.ordersPerPage); i++) {
		paginationNumbers.push(i);
	}
	return (
		<div className='row'>
			{paginationNumbers?.length>0 &&
			<div className='col-md-12 mt-3' style={{textAlign:'center'}}>
				{props.currentPage != `${1}` &&
				 <button className='btn btn-secondary mx-1' key={0} onClick={()=>props.changePageNo(props.currentPage-1)}>Previous</button>
				}
				{paginationNumbers.map((pageNumber) => (
					<button className='btn btn-secondary mx-1' key={pageNumber} onClick={()=>props.changePageNo(pageNumber)} style={{backgroundColor:props.currentPage == pageNumber? 'black':''}}>{pageNumber}</button>
				))}
				{paginationNumbers.length != props.currentPage &&
				 <button className='btn btn-secondary mx-1' onClick={()=>props.changePageNo(props.currentPage+1)}>Next</button>
				}
			</div>
			}
	  </div>
	);
}
  
export default Paginate;