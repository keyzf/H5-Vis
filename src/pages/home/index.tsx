import React from 'react';
import {Tabs, message, Button} from 'antd';
import { history} from 'umi';

const Home = () => {
  const handleGo = (type: string) => {
    if (type === 'H5') {
      history.push('/editor?tid=123')
    } else {
      history.push('/ide');
    }
  }
  return (
    <div>
      <div>
       <div onClick={() => handleGo('H5')}>
            <div>制作H5页面</div>
          </div>
      </div>
    </div>
  )
}
export default Home;