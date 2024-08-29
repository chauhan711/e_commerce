import React, { useEffect,useState } from 'react';
import User from '../../../layouts/user.layout';
import axios from 'axios';
import helpers from '../../../helpers/helper';
  const GetHelp = () =>  {
    const keys = {message:''};
    const [form,setForm] = useState(keys);
    const [formErr,setFormErr] = useState(keys);
    const [conversation,setConversation] = useState({});

    const getAllMessages = () => {
        axios.get(`${process.env.REACT_APP_USER_BASE_URL}/user-conversations/${helpers.getAdminName()}`,helpers.getHeaders())
            .then((res)=>{
               console.log(res);
               setConversation(res.data.data)
            }).catch((err)=>{
                console.log(err);
            });
    }
    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm({...form,[name]:value})
    }
    const handleSubmit = () => {
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
                    getAllMessages();
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
            <div className='container msgContainer'>
                {
                    // console.log(conversation)
                    Object.keys(conversation).length > 0 && 
                    <div className='row'>
                        <div className='col-md-8' style={{textAlign:'end'}}>
                            {conversation?.user_conversation.length > 0 ? `${conversation?.user_conversation[0]?.title} - You`:''} 
                        </div>
                        {console.log(conversation?.user_conversation[0]?.messages)}
                        {conversation?.user_conversation.length > 0 &&
                            conversation?.user_conversation[0]?.messages.map(item=>
                                <div className={`col-md-8 ${helpers.getCurrentUser()?.id == item?.userId ? 'rightSide':'leftSide'}`}>
                                    {helpers.getCurrentUser()?.id != item?.userId ? 'Admin- ':''}{item?.reply} {helpers.getCurrentUser()?.id == item?.userId ? ' - You':''}
                                </div>
                            )
                        }
                    </div>
                }
                <form className='chatBox'>
                    <div className='row mt-5'>
                        <div className='col-md-7' style={{textAlign: 'end'}}>
                        <input className="form-group" type='text' name='message' placeholder='type you message' onChange={handleChange} value={form?.message}/><br></br>
                        <span style={{color:'red'}}>{formErr?.message}</span>
                        </div>
                        <div className='col-md-3'>
                            <button type="button" className='btn btn-primary' onClick={handleSubmit}>Send</button>
                        </div>
                    </div>
                </form>
            </div>
	    </div>
      </User>
	);
  }
  
  export default GetHelp;
  