import React,{useEffect, useState} from 'react';
import AdminLayout from '../../../layouts/admin.layout';
import axios from 'axios';
import helpers from '../../../helpers/helper';

const Refunded = () =>  {
    const [refunded,setRefunded] = useState([]);
    useEffect (()=>{
        axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/get-refunded-payments`,helpers.getHeaders())
        .then((resp)=>{
            console.log(resp.data.refunded);
            setRefunded(resp.data.refunded);
        }).catch((err)=>{
            console.log(err);
        });
    },[]);
	return (
      <AdminLayout>
        <div className='content'>
            <div className='container'>
                <h3 className='text-center'>Refunded Payments</h3>
                <div className='row mt-3'>
                    <div className='col-md-3'>Amount</div>
                    <div className='col-md-3'>status</div>
                </div>
                {
                    refunded && refunded.length>0 ? 
                    refunded.map(item=>
                            <div className='row mt-2'>
                                <div className='col-md-3'>{item?.amount/100}</div>
                                <div className='col-md-3'>{item.status}</div>
                            </div>
                        )
                    :'' 
                }
            </div>
        </div>
      </AdminLayout>
	);
}
  
  export default Refunded;
  