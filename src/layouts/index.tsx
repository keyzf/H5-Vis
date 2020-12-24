import React, { createContext, useState } from 'react';
import {IRouteComponentProps} from 'umi';

export type hVisContextType = 'h5' | 'pc';

export interface IhVisContextType {
  theme: hVisContextType;
  setTheme: Function;
}

export const hVisContext = createContext<IhVisContextType>({
  theme:'h5',
  setTheme: () => {}
})

export default function Layout({children}:IRouteComponentProps){
  const [state, setState] = useState<hVisContextType>('h5');
  return (
    <hVisContext.Provider 
      value={{
        theme:state,
        setTheme:setState,
      }}
    >
      {children}
    </hVisContext.Provider>
  );
}
