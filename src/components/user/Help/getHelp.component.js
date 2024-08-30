import React, { useEffect,useState } from 'react';
import User from '../../../layouts/user.layout';
import axios from 'axios';
import helpers from '../../../helpers/helper';
import {io} from 'socket.io-client'

  const GetHelp = () =>  {
    const keys = {message:'',user_two:helpers.getAdminName()};
    const [form,setForm] = useState(keys);
    const [formErr,setFormErr] = useState(keys);
    const [conversation,setConversation] = useState({});

    //sockets
    const socket = io(process.env.REACT_APP_BASE_URL);
    socket.on('connect', ()=>console.log(socket.id))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect(),5000)
    });
    socket.on('disconnect',()=>setTimeout('server disconnected'));
    // socket.on('UserNewMessage',function(){
    //     getAllMessages();
    // });
    
    //get All Messages
    const getAllMessages = () => {
        axios.get(`${process.env.REACT_APP_USER_BASE_URL}/user-conversations/${helpers.getAdminName()}`,helpers.getHeaders())
            .then((res)=>{
            //    console.log(res);
               setConversation(res.data.data)
            }).catch((err)=>{
                console.log(err);
            });
    }

    //type anything in text box
    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm({...form,[name]:value})
    }

    //submit message
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(form);
        let error = null;
        if(form.message == '')
        {
            error = true;
            setFormErr({...formErr,message:'Please fill the message'})
        }
        if(!error){
            axios.post(`${process.env.REACT_APP_USER_BASE_URL}/user-chat`,form,helpers.getHeaders())
            .then((res)=>{
                if(res.data.message){
                    setForm(keys);
                    setFormErr(keys)
                    // getAllMessages();
                }
            }).catch((err)=>{
                console.log(err);
            });
        }
    }
    useEffect(()=>{
        getAllMessages();
    },[]);
	return (
      <User>
	    <div className='container'>
            <h2 className='text-center'>Chat With us</h2>
            <div className='container msgContainer' style={{ width:'50%'}}>
                {
                    // console.log(conversation)
                    Object.keys(conversation).length > 0 && 
                    <div className='row'>
                        <div className='col-md-12' style={{textAlign:'end'}}>
                            <span>{conversation?.user_conversation.length > 0 ? `${conversation?.user_conversation[0]?.title} - You`:''} </span>
                        </div>
                        {conversation?.user_conversation.length > 0 &&
                            conversation?.user_conversation[0]?.messages.map(item=>
                                <div className={`col-md-12 ${helpers.getCurrentUser()?.id == item?.userId ? 'rightSide':'leftSide'}`}>
                                    <span>{helpers.getCurrentUser()?.id != item?.userId ? 'Admin- ':''}{item?.reply} {helpers.getCurrentUser()?.id == item?.userId ? ' - You':''}</span>
                                </div>
                            )
                        }
                    </div>
                }
                <form className='chatBox' onSubmit={handleSubmit}> 
                    <div className='row mt-5'>
                        <div className='col-md-6' style={{textAlign: 'end'}}>
                        <input className="form-group" type='text' name='message' placeholder='type you message' onChange={handleChange} value={form?.message}/><br></br>
                        <span style={{color:'red'}}>{formErr?.message}</span>
                        </div>
                        <div className='col-md-3'>
                            <button type="submit" className='btn btn-primary'>Send</button>
                        </div>
                    </div>
                </form>
            </div>
	    </div>
      </User>
	);
  }
  
  export default GetHelp;
  