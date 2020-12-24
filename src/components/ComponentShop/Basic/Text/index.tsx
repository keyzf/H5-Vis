import React, { memo } from 'react';
import {iTextConfig} from './schema';
import logo from '@/assets/12-文本.png';

const Text  = memo((props: iTextConfig & {isTpl:boolean}) => {
    const {align, text, fontSize, color, lineHeight, isTpl} = props;
    return (
        <>
           {isTpl? (
               <div>
                   <img src={logo} alt="这是一个文本组件"/>
               </div>
           ) : (
               <div style={{color,textAlign:align,fontSize,lineHeight}}>
                   {text}
               </div>
           )}
        </>
    )
})



export default Text;