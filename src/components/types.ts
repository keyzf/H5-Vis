
export type tTextDefault = string;
export type tColorDefault = string;
export type tNumberDefault = number;
export type tSelectDefault<KeyType> = KeyType;

export interface iTextConfig {
    key: string;
    name: string;
    type: 'Text';
}

export interface iColorConfig {
    key: string;
    name: string;
    type: 'Color';
}

export interface iNumberConfig {
    key: string;
    name: string;
    type: 'Number';
    range?: [number,number];
    step?:number;
}

export interface iSelectConfig<KeyType> {
    key:string;
    name:string;
    type:'Select';
    range: Array<{
        key: KeyType;
        text: string;
    }>
}


//文本
export type tTextSelectKey = 'left'|'right'|'center';
export type tTextEditData = Array<
 iTextConfig | iColorConfig | iNumberConfig | iSelectConfig<tTextSelectKey>
>;