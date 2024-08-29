import React,{useState} from 'react';
import { IoIosEye } from 'react-icons/io';
import {REFUNDED} from '../../../helpers/paymentStatus';
import Paginate from './paginate.component';

const Orders = (props) =>  {
    let allOrders = [];

    //Filter all records
    const filterAllRecords = () => {
        if(props.searchOrders == "") { 
            allOrders = props.orders; 
            return; 
        }
        props.orders.filter((item)=>{
           for(let key in item){
                if(key == 'id' || key == 'payment_received' || key == 'status')
                {
                    if (item[key].toString().toLowerCase().includes(props.searchOrders.toString().toLowerCase())) 
                    {
                        allOrders.push(item);
                        break;
                    }
                }
                else if(key == 'user')
                {
                    if (item[key].name.toString().toLowerCase().includes(props.searchOrders.toString().toLowerCase()) || item[key].email.toString().toLowerCase().includes(props.searchOrders.toString().toLowerCase())) 
                    {
                        allOrders.push(item);
                        break;
                    }
                }
            };
        });
    }
    filterAllRecords();

    //Filter data based on pagination
    const filteredOrders =() => {
        //paginate data
        const indexLastItem = props.currentPage * props.ordersPerPage;
        const indexFirstItem = indexLastItem - props.ordersPerPage;
        const currentData = allOrders.slice(indexFirstItem,indexLastItem);
        return currentData;
    }
    return (
        <div>
            <div className='row mt-3'>
                    <div className='col-md-1'>Order No.</div>
                    <div className='col-md-1'>Order Amount</div>
                    <div className='col-md-1'>Amount Received</div>
                    <div className='col-md-2'>User Name</div>
                    <div className='col-md-2'>User Email</div>
                    <div className='col-md-2'>Products</div>
                    <div className='col-md-2'>Payment Status</div>
                    <div className='col-md-1'>Action</div>
            </div>
            <hr />
        {
            filteredOrders() && filteredOrders().length>0 ?
            filteredOrders().map((item,index)=>(
                    <div className='row mt-2' key={index}>
                        <div className='col-md-1'>{item?.id}</div>
                        <div className='col-md-1'>${item?.total_amount}</div>
                        <div className='col-md-1'>${item?.payment_received}</div>
                        <div className='col-md-2'>{item?.user?.name}</div>
                        <div className='col-md-2'>{item?.user?.email}</div>
                        <div className='col-md-2'> <button className='btn btn-primary' onClick={()=>props.handleFindProduct(item?.id)} value={item?.id}><IoIosEye/></button> </div>                               
                        <div className='col-md-2'>{item?.status}</div> 
                        <div className='col-md-1'> {
                            REFUNDED != item?.status ?
                            <button className='btn btn-danger' onClick={props.handleRefund} value={[item.id,item?.latest_charge]}>Refund Payment</button> 
                            :<div className='text-center'>-</div> 
                            }
                        </div>
                    </div>
                ))
            :'Data not found' 
        }
        <Paginate ordersPerPage={props.ordersPerPage} length={allOrders?.length} changePageNo={props.changePageNo} currentPage={props.currentPage}/>
        </div>
    );
}
  
  export default Orders;
  