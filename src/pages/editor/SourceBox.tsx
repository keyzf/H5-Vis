
import React, {memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {connect} from 'dva';
import {Dispatch} from 'umi';
import {StateWithHistory} from 'redux-undo';

import { useDrop } from 'react-dnd';
import Draggable, { DraggableEvent, DraggableData} from 'react-draggable';
import GridLayout,{ItemCallback} from 'react-grid-layout';

import DynamicEngine from '@/components/DynamicEngine';

import styles from './index.less';

import { hVisContext } from '@/layouts';
import {uuid} from '@/utils/tool';

interface SourceBoxPros {
    pstate:{pointData:{id:string;item:any;point:any;isMenu?:any}[];curPoint:any};
    cstate:{pointData:{id:string;item:any;point:any}[];curPoint:any};
    scaleNum:number;
    canvasId:string;
    allType:string[];
    dragState:{x:number; y:number};
    dispatch: Dispatch;
    setDragState: React.Dispatch<
    React.SetStateAction<{
        x:number;
        y:number;
    }>
    >;
}
const SourceBox = memo((props: SourceBoxPros) => {
    // console.log(props);
    const {pstate,scaleNum,canvasId,allType,dragState,setDragState,cstate,dispatch} = props;
    const context = useContext(hVisContext);
    
    const pointData = pstate ? pstate.pointData : [];
    const cpointData = cstate ? cstate.pointData : [];

    const [canvasRect, setCanvasRect] = useState<number[]>([]);
    const [isShowTip,setIsShowTip] = useState(true);
    
    //从组件拖过来的目标Drop
    const [{isOver}, drop] = useDrop({
        accept: allType,
        drop:(item:{h:number;type:string;x:number},monitor) => {
            let parentDiv = document.getElementById(canvasId),
            pointRect = parentDiv!.getBoundingClientRect(),
            top = pointRect.top,
            pointEnd = monitor.getSourceClientOffset(),
            y = pointEnd!.y < top ? 0 : pointEnd!.y - top,
            col = 24,
            cellHeight = 2,
            w = item.type === 'Icon' ? 3 : col;

            let gridY = Math.ceil(y/ cellHeight);

            if (context.theme === 'h5') {
                dispatch({
                    type:'editorModal/addPointData',
                    payload:{
                        id:uuid(6,10),
                        item,
                        point:{i:`x-${pointData.length}`,x:0,y:gridY,w,h:item.h,isBounded:true},
                        status:'inToCanvas',
                    }
                })
            } else {
                dispatch({
                type: 'editorPcModal/addPointData',
                payload: {
                    id: uuid(6, 10),
                    item,
                    point: {
                    i: `x-${cpointData.length}`,
                    x: item.x || 0,
                    y: gridY,
                    w,
                    h: item.h,
                    isBounded: true,
                    },
                    status: 'inToCanvas',
                },
                });
                
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            item: monitor.getItem(),
        })
    })


    const onDragStart: ItemCallback = useMemo(()=>{
        return (layout, oldItem, newItem, placeholder, e, element) => {
            const curPointData = pointData.filter(item => item.id === newItem.i)[0];
            dispatch({
                type:'editorMoal/modPointData',
                payload:{...curPointData, status:'inToCanvas'}
            })
        }
    },[dispatch,pointData]);

    const onDragStop: ItemCallback = useMemo(()=>{
        return (layout, oldItem, newItem, placeholder, e, element) => {
            const curPointData = pointData.filter(item => item.id === newItem.i)[0];
            dispatch({
                type:'editorModal/modPointData',
                payload:{...curPointData, point:newItem, status:'inToCanvas'}
            })
        }
    },[context.theme, cpointData, dispatch, pointData]);

    const onResizeStop: ItemCallback = useMemo(()=>{
        return (layout, oldItem, newItem, placeholder, e, element) => {
            const curPointData = pointData.filter(item => item.id === newItem.i)[0];
            dispatch({
                type: 'editorModal/modPointData',
                payload: { ...curPointData, point: newItem, status: 'inToCanvas' },
            });
        }
       
    },[dispatch, pointData]);

    
    useEffect(()=>{
        let {width, height} = document.getElementById(canvasId)!.getBoundingClientRect();
        setCanvasRect([width,height]);
    },[canvasId]);

    useEffect(() => {
        let timer = window.setTimeout(()=>{
            setIsShowTip(false);
        },3000);
        return () => {
            window.clearTimeout(timer);
        }
    },[])

    const render = useMemo(()=>{
        return (
            <Draggable 
               position={dragState}
               handle = ".js_box"
               onStop={(e:DraggableEvent,data:DraggableData) => {
                   setDragState({x:data.x,y:data.y});
               }}
            >
            <div className={styles.canvasBox}>
                <div style={{
                    transform:`scale(${scaleNum})`,
                    position:'relative',
                    width:'100%',
                    height:'100%'
                }}>
                <div 
                id={canvasId}
                className={styles.canvas}
                ref={drop}
                >
                    {pointData.length > 0 ?(
                        <GridLayout
                           className={styles.layout}
                           cols={24}
                           rowHeight={2}
                           width={canvasRect[0] || 0}
                           margin={[0,0]}
                           onDragStart = {onDragStart}
                           onDragStop = {onDragStop}
                           onResizeStop = {onResizeStop}
                        >
                            {pointData.map(value => (
                                <div 
                                 className={value.isMenu ? styles.selected : styles.dragItem}
                                key={value.id} 
                                data-grid={value.point}
                                >
                                    <DynamicEngine {...value.item} isTpl={false}/>
                                </div>
                            ))}
                        </GridLayout>
                    ):null}
                </div>
                </div>
            </div>
            </Draggable>
        )
    },[
        canvasId,
        dragState,
        pointData,
        drop,
        onDragStart,
        onDragStop,
        onResizeStop,
        scaleNum,
        canvasRect,
    ])
    return (
    <>
        {render}
    </>)
})

// export default SourceBox

export default connect((state: StateWithHistory<any>) => ({
    pstate: state.present.editorModal,
    cstate: state.present.editorPcModal,
  }))(SourceBox);