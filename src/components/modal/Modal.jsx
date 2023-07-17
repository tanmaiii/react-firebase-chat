import React,{useRef} from 'react'
import './modal.scss'
import {GrFormClose} from 'react-icons/gr'
import img from '../../assets/nofile.jpg'
 
export default function Modal(props) {
    const modalRef = useRef()
    const file = props.file

    const handleCLickCLose = (e) => {
        modalRef.current.classList.remove('active')
    }   
    
  return (
    <div id='modal' ref={modalRef} className={`modal overlay`}>
        <a href=""></a>
        <div className='modal_body'>
            <button onClick={(e) => handleCLickCLose(e)} className='modal_body_btn'><GrFormClose/></button>
            <div className='modal_body_img'>
                {file ? <img src={file} alt="" /> : <img src={img} alt="" />}
            </div>
        </div>
    </div>
  )
}
