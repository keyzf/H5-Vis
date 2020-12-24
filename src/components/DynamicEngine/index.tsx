import React, {useMemo, memo, FC, useContext} from 'react';
import {dynamic} from 'umi';
import { hVisContext, hVisContextType } from '@/layouts';
import Loading from '../Loading';

export type componentsType = 'media' | 'base' | 'visible'

const DynamicFunc = (type: string, componentsType: string, context: hVisContextType) => {
    const prefix = context === 'pc' ? 'Pc' : '';
    return dynamic({
        loader: async function() {
            let Component: FC<{ isTpl: boolean}>;
            
            if (componentsType === 'base') {
                const {default: Graph} = await import(
                    `@/components/Component${prefix}Shop/Basic/${type}`
                );
                Component = Graph;

            } else if (componentsType === 'media') {
                const {default: Graph} = await import(
                    `@/components/Component${prefix}Shop/Media/${type}`
                );
                Component = Graph;
            } else {
                const {default: Graph} = await import(
                    `@/components/Component${prefix}Shop/Visual/${type}`
                )
                Component = Graph;
            }
            return (props:DynamicType) => {
                const {config,isTpl} = props;
                return <Component {...config} isTpl={isTpl} />;
            }
        },
        loading:() => (
            <div style={{paddingTop:10, textAlign:'center'}}>
              <Loading/>
            </div>
        )
    })
}

type DynamicType = {
    isTpl: boolean;
    config: {[key: string]:any};
    type:string;
    componentsType: componentsType;
    category:string
}
const DynamicEngine = memo((props: DynamicType) => {
    const {type, config, category} = props;
    const context = useContext(hVisContext);
    
    const Dynamic = useMemo(() => {
       return (DynamicFunc(type, category, context.theme) as unknown as FC<DynamicType>);
    },[config,context.theme]);

    return <Dynamic {...props} />
})

export default DynamicEngine;