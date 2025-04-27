import React ,{ Fragment }from 'react';
import {AiFillTwitterCircle} from 'react-icons/ai'
import {BsFacebook} from 'react-icons/bs'
import{SiYoutubemusic} from 'react-icons/si';
import {BsGithub} from 'react-icons/bs'
import {AiFillGoogleCircle} from 'react-icons/ai'
import  "../Footer/footer.scss";
const Footer = () => {
    return (
      <Fragment>
      <div className='Footer-main'>
          <br/>
          <div className='contain1'>
              <a href='/About' className='text1'>About</a>
              <a href='/About' className='text1'>Products</a>
              <a href='/About'className='text1' >Pricing</a>
              <a href='/About'className='text1' >Help</a>
              <a href='/About' className='text1'>Terms& Privacy</a>
          </div>
          <br/>
          <div className='contain2 space-x-2'>
              <a href='/#'><AiFillTwitterCircle className='sicons2' /></a>
              <a href='/#'><BsFacebook className='sicons'/></a>
              <a href='/#'><SiYoutubemusic className='sicons'/></a>
              <a href='/#'><BsGithub className='sicons'/></a>
              <a href='/#'><AiFillGoogleCircle className='sicons2'/></a>
          
          </div>
          <br/>
          <div className='contain3'>
          
              <p className='text2'> &copy;{new Date().getFullYear()} All rights reserved.</p>

          </div>
      </div>
      </Fragment>
 
  )
}
export default Footer