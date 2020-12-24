import React,{useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Result, Tabs, Button} from 'antd';
import {AreaChartOutlined,VideoCameraAddOutlined,AppstoreAddOutlined,DoubleLeftOutlined,DoubleRightOutlined} from '@ant-design/icons';

import {connect} from 'dva';

import HeaderComponent from './components/Header';
import CanvasControl from './components/CanvasControl';


import TargetBox from './TargetBox';
import Calibration from '../../components/Calibration';
import SourceBox from './SourceBox';

//渲染组件引擎
import DynamicEngine,{componentsType} from '../../components/DynamicEngine';
//表单编辑配置
import FormEditor from '../../components/Panel/FormEditor';

//组件库模版
import BasicTemplate from '../../components/ComponentShop/Basic/template'
// import mediaTpl from '../../components/componentShop/Media/template'
// import graphTpl from '../../components/componentShop/Visual/template'

//组件库配置
import schemaH5 from '../../components/ComponentShop/schema'

//防抖
import {throttle} from '@/utils/tool';
import { hVisContext } from '@/layouts';

import { ActionCreators, StateWithHistory } from 'redux-undo';

import styles from './index.less';

const {TabPane} = Tabs;

const Container = (props:{
    history?:any;
    location?:any;
    dispatch?:any;
    pstate?:any;
    cstate?:any;
}) => {
    //指定画布Id
    let canvasId = 'js_canvas';
    const context = useContext(hVisContext);

    const {pstate, cstate, dispatch} = props;

    const pointData = pstate ? pstate.pointData : [];
    const cpointData = cstate ? cstate.pointData : [];
    const curPoint = pstate ? pstate.curPoint: {}; 

    const [scaleNum, setScale] = useState(1);
    const [dragstate, setDragState] = useState({x:0,y:0});
   
    //设置抽屉
    const [rightColla, setRightColla] = useState(true);
    const changeRightColla = useMemo(()=> {
        return (c: boolean) => {
            setRightColla(c);
        }
    },[])
  
    

//tab 头
const tIcon = {
    base: <AppstoreAddOutlined/>,
    media: <VideoCameraAddOutlined />,
    visible: <AreaChartOutlined />
}
const generateHeader = useMemo(()=>{
    return (type: componentsType) => {
        return (
        <div>
            {tIcon[type]}
        </div>
        )
    }
},[tIcon])

//基础组件模版
const basicTpls = useMemo(() => {
    return BasicTemplate
},[])

//媒体组件模版
// const mediaTpls = useMemo(() => {
//     return mediaTpl
// },[])

//数据图表模板
// const graphTpls = useMemo(() => {
//     return graphTpl
// },[])

//获取全部模版类型
const allType = useMemo(()=>{
    let arr:string[] = [];
        basicTpls.forEach(v=>{
            arr.push(v.type);
        })
        // mediaTpls.forEach(v=>{
        //     arr.push(v.type);
        // })
        // graphTpls.forEach(v=>{
        //     arr.push(v.type);
        // })
    return arr;
}, [basicTpls])


//左边组件库
 const tabRender = useMemo(() => {
     return (
         <>
          <TabPane tab={generateHeader('base')} key="1">
              <div>基本组件</div>
              {basicTpls.map((value,i) =>{
                //   console.log(schemaH5[value.type as keyof typeof schemaH5].config)
                  return (
                     <TargetBox item={value} key={i} canvasId={canvasId}>
                         <DynamicEngine 
                            {...value}
                            config = {schemaH5[value.type as keyof typeof schemaH5].config}
                            componentsType="base"
                            isTpl = {true}
                         />
                     </TargetBox>
                    )
              })}
          </TabPane>
          <TabPane tab={generateHeader('media')} key="2">
              <div>媒体组件</div>
              {/* {mediaTpls} */}
          </TabPane>
          <TabPane tab={generateHeader('visible')} key="3">
              <div>可视化组件</div>
              {/* {graphTpls} */}
          </TabPane>
         </>
     );

 },[generateHeader,canvasId,schemaH5,basicTpls])

 //画布上的鼠标事件
  const containerRef = useRef<HTMLDivElement>(null);
  const [diffMove, setDiffMove] =useState({
      start:{x:0,y:0},
      move:false,
  })
  const mouseDownFn = useMemo(()=>{
      return(e:React.MouseEvent<HTMLDivElement>) =>{
          if (e.target === containerRef.current){
            setDiffMove({
                start:{
                    x: e.clientX,
                    y: e.clientY,
                },
                move:true,
            })
          }
      }
  },[]);
  const mouseMoveFn = useMemo(()=> {
      return(e:React.MouseEvent<HTMLDivElement>) => {
          if (diffMove.move) {
              let diffx: number;
              let diffy: number;
              const newX = e.clientX;
              const newY = e.clientY;
              diffx = newX - diffMove.start.x;
              diffy = newY - diffMove.start.y;
              setDiffMove({
                  start:{
                      x: newX,
                      y: newY,
                  },
                  move: true,
              });
              setDragState(prev => {
                  return {
                      x: prev.x + diffx,
                      y: prev.y + diffy
                  }
              })
          }
      }
  },[diffMove.move,diffMove.start.x,diffMove.start.y]);
  const mouseUpFn = useMemo(()=>{
      return() => {
          setDiffMove({
              start:{x:0,y:0},
              move:false,
          })
      }

  },[]);
  const onWhellFn = useMemo(()=> {
      return(e:React.WheelEvent<HTMLDivElement>) => {
          if (e.deltaY < 0) {
              setDragState(prev => ({
                  x: prev.x,
                  y: prev.y + 40,
              }))
          } else {
              setDragState(prev => ({
                  x: prev.x,
                  y: prev.y - 40,
              }))
          }
      }
  },[]);
  useEffect(() => {
      if (diffMove.move && containerRef.current) {
          containerRef.current.style.cursor = 'move';
      } else {
          containerRef.current!.style.cursor = 'default';
      }
  },[diffMove.move])

 //画布的控制器
 const backSize = () => {
     setScale(1);
     setDragState({x:0,y:0})
 }
 const handleSlider = useMemo(()=>{
     return(type:any) => {
         if (type) {
            setScale((prev:number) => + (prev + 0.1).toFixed(1));
         } else {
            setScale((prev:number) => + (prev - 0.1).toFixed(1));
         }
     }
 },[]);

 //左边配置
 const ref = useRef<HTMLDivElement>(null);

 //表单项配置
 const handleFormSave = useMemo(()=>{
     if(context.theme === 'h5') {
         return (data: any) => {
             dispatch({
                 type:'editorModal/modPointData',
                 payload:{...curPoint, item:{...curPoint.item,config:data}}
             })
         }
     } else {
         return (data: any) => {
             dispatch({
                 type:'editorModal/modPointData',
                 payload:{...curPoint,item:{...curPoint.item,config:data}},
             })
         }
     }
 },[context.theme,curPoint,dispatch])

 const handleDel = useMemo(()=> {
     if (context.theme === 'h5') {
         return (id:any) => {
             dispatch({
                 type:'editorModal/delPointData',
                 payload:{id},
             })
         }
     } else {
         return (id:any) => {
             dispatch({
                 type:'editorPcModal/delPointData',
                 payload:{id},
             })
         }
     }

 },[context.theme,dispatch])

 //头部相关操作
 const redohandler = useMemo(()=> {
     return() => {
         dispatch(ActionCreators.redo())
     }
 },[dispatch])

 const undohandler = useMemo(()=>{
     return() => {
         dispatch(ActionCreators.undo())
     }
 },[dispatch])

 const clearData = useCallback(()=>{
     if (context.theme === 'h5') {
         dispatch({type:'editorModal/clearAll'});
     } else {
         dispatch({type:'editorPcModal/clearAll'});
     }
 },[context.theme,dispatch])

 const importTpl = data => {
     dispatch({
         type:'editorModal/importTplData',
         payload:data,
     })
 }
 //右边配置
 const renderRight = useMemo(()=> {
     if (context.theme === 'h5') {
         return (
             <div className={styles.attrSetting}
                style={{
                    transition: 'all ease-in-out 0.5s',
                    transform: rightColla ? 'translate(100%,0)' : 'translate(0,0)',
                }}
             >

                {pointData.length && curPoint ? (
                <>
                <div className={styles.tit}>属性设置</div>

                <FormEditor
                    config={curPoint.item.editableEl}
                    uid={curPoint.id}
                    defaultValue={curPoint.item.config}
                    onSave={handleFormSave}
                    onDel={handleDel}
                    rightPannelRef={ref}
                />
                </>

                ) : (

                <div style={{ paddingTop: '100px' }}>
                <Result
                    status="404"
                    title="还没有数据"
                    subTitle="拖拽组件来生成H5页面吧～"
                />
                </div>

            )}

          </div>
         )
     } else {
         return (
             <div 
             className={styles.attrSetting}
             style={{
                transition: 'all ease-in-out 0.5s',
                transform: rightColla ? 'translate(100%,0)' : 'translate(0,0)',
              }}
             >

               {pointData.length && curPoint ? (
                    <>
                    <div className={styles.tit}>属性设置</div>
                    <FormEditor
                        config={curPoint.item.editableEl}
                        uid={curPoint.id}
                        defaultValue={curPoint.item.config}
                        onSave={handleFormSave}
                        onDel={handleDel}
                        rightPannelRef={ref}
                    />
                    </>
                ) : (
                    <div style={{ paddingTop: '100px' }}>
                    <Result
                        status="404"
                        title="还没有数据"
                        subTitle="拖拽组件生成H5页面吧～"
                    />
                    </div>
                )}

            </div>
         )
     }
 },[
     context.theme,
     pointData.length,
     cpointData.length,
     curPoint,
     handleFormSave,
     handleDel,
     rightColla,
 ])
  return (
    <div className={styles.editorWrap}>
      <HeaderComponent
          undohandler={undohandler}
          redohandler = {redohandler}
          pointData = {pointData}
          clearData = {clearData}
          importTpl = {importTpl}
          location = {props.location}
       />

      <div className={styles.container}>
          {/* 组件库 */}
          <div className={styles.list}
          >
              <div className={styles.componentList}>
                 <Tabs 
                 className="editorTabClass" 
                 defaultActiveKey="1"
                 tabPosition={'left'}
                //  onTabClick={()=> changeCollapse(false)}
                 >
                     {tabRender}
                 </Tabs>
              </div>

               {/* <div
                    className={styles.collapsed}
                    style={{ position: 'absolute', bottom: '80px', left: '20px' }}
                    // onClick={() => changeCollapse(!collapsed)}
                >
                    {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                </div> */}
          </div>

          {/* 画布 */}
          <div 
          className ={styles.tickMark}
          id="calibration"
          ref={containerRef}
          onMouseDown={mouseDownFn}
          onMouseMove = {throttle(mouseMoveFn,500)}
          onMouseUp = {mouseUpFn}
          onMouseLeave = {mouseUpFn}
          onWheel = {onWhellFn}
          >
              {/* 校准线 */}
              <div className={styles.tickMarkTop}>
                <Calibration direction="up" id="calibrationUp" multiple={scaleNum}/>
              </div>

              <div className={styles.tickMarkLeft}>
                <Calibration direction="left" id="calibrationRight" multiple={scaleNum}/>
              </div>

              {/* 画布 */}
              <SourceBox
                 dragState={dragstate}
                 setDragState = {setDragState}
                 scaleNum = {scaleNum}
                 canvasId={canvasId}
                 allType = {allType}
              />

              {/* 画布控制器 */}
              <CanvasControl scaleNum={scaleNum} handleSlider={handleSlider} backSize={backSize}/>
          </div>

          {/* 配置器 */}
          {renderRight}
          
        {/* 抽屉 */}
        <div
          className={styles.rightcolla}
          style={{
            position: 'absolute',
            right: rightColla ? 0 : '304px',
            transform: 'translate(0,-50%)',
            transition: 'all ease-in-out 0.5s',
          }}
          onClick={() => changeRightColla(!rightColla)}
        >
          {!rightColla ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>

        <div
          style={{
            width: rightColla ? 0 : '279px',
            position: 'absolute',
            transform: 'translate(0,-10%)',
            transition: 'all ease-in-out 0.5s',
            textAlign: 'center',
            bottom: -5,
            right: rightColla ? 0 : 16,
            background: 'hsla(0,0%,88.2%,.7)',
            padding: rightColla ? 0 : '10px',
          }}
        >
          <Button block type="primary" onClick={() => handleDel(curPoint.id)}>
            删除
          </Button>
        </div>
        
        <div
          style={{
            width: rightColla ? 0 : '304px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>

      </div>
    </div>
  );

}

export default connect((state: StateWithHistory<any>) => {
    return { pstate: state.present.editorModal, cstate: state.present.editorPcModal };
})(Container);

