import schemaH5 from '@/components/ComponentShop/schema';
import { hVisContext } from '@/layouts';
import React,{CSSProperties, memo, ReactNode, useContext, useMemo} from 'react';
import { useDrag } from 'react-dnd';


import styles from './index.less';


interface TargetBoxProps {
    item: any;
    children: ReactNode;
    canvasId:string;
}

const TargetBox = memo((props: TargetBoxProps) =>{
    // console.log(props)
    const { item } = props;

    const context = useContext(hVisContext);

    // const schema = useMemo(()=> {
    //     if (context.theme === 'h5') {
    //         return schemaH5;
    //     }
    // },[context.theme])

    const [{isDragging}, drag] = useDrag({
        item: {
            type:item.type,
            config: schemaH5[item.type as keyof typeof schemaH5].config,
            h:item.h,
            editableEl:schemaH5[item.type as keyof typeof schemaH5].editData,
            category: item.category,
            x:item.x || 0,
        },
        collect: monitor => ({
            isDragging:monitor.isDragging(),
        })
    })

    const containerStyle: CSSProperties = useMemo(
        ()=>({
            opacity:isDragging ? 0.4 : 1,
            cursor:'move',
            // height:'10px',
        }),
        [isDragging],
    )

    return (
        <> 
         <div className={styles.listWrap}>
             <div className={styles.module} style={{...containerStyle }} ref={drag}>
                 <div 
                   style = {{
                       height:'100px',
                       display:'flex',
                       justifyContent:'center',
                       alignItems:'center',
                       flexDirection:'column',
                       overflow:'hidden',
                   }}
                 >
                     {props.children}
                 </div>
                 <div
                    style={{
                        height:'20px',
                        lineHeight:'20px',
                        textAlign:'center',
                        backgroundColor:'rgba(245,245,245,1)',
                        color:'rgba(118,118,118,1)',
                    }}
                 >
                     {props.item.displayName}
                 </div>
             </div>
         </div>
        </>
    )
})

export default TargetBox
