import React, { memo } from 'react';
import {Button,Modal} from 'antd';

// import req from '@/utils/req';

import styles from './index.less';

const isDev = process.env.NODE_ENV === 'development';

interface HeaderComponentProps {
    pointData: any;
    undohandler:any;
    redohandler:any;
    clearData:any;
    importTpl:any;
    location:any;
}
const HeaderComponent = memo((props:HeaderComponentProps) => {
const { pointData, location, clearData, undohandler, redohandler, importTpl } = props;
    const deleteAll = () => {
        Modal.confirm({
          title: '确认清空画布?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            clearData();
          },
        });
     };

     const toPreview = () => {
        // localStorage.setItem('pointData', JSON.stringify(pointData));
        // savePreview();
        // setTimeout(() => {
        //   window.open(
        //     isDev
        //       ? `/preview?tid=${props.location.query.tid}`
        //       : `/preview?tid=${props.location.query.tid}`,
        //   );
        // }, 600);
      };
        const savePreview = () => {
            const { tid } = props.location.query || '';
            req.post('/visible/preview', { tid, tpl: pointData });
        };

    return (
        <div className={styles.header}>
            <div className={styles.tools}>
                <Button
                    type="link"
                    style={{ marginRight: '9px' }}
                    title="清空"
                    onClick={deleteAll}
                    disabled={!pointData.length}
                    >
                   清空
                </Button>

                 <Button type="link" onClick={toPreview} disabled={!pointData.length}>
                    预览
                 </Button>
            </div>
        </div>
    )
})

export default HeaderComponent;