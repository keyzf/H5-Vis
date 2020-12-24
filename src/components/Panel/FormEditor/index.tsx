import React, { memo,RefObject, useEffect} from 'react';
import {Form,Input,Select, InputNumber,Switch,Radio} from 'antd';

import Upload from '../Upload';
import Color from '../Color';
import CardPicker from '../CardPicker';
import Table from '../Table';
import DataList from '../DataList';
import MutiText from '../MutiText';
import Pos from '../Pos';
import {Store} from 'antd/lib/form/interface';
import FormItems from '../FormItems';

interface FormEditorProps {
    uid: string;
    onSave:Function;
    onDel: Function;
    defaultValue:{[key:string]:any};
    config:Array<any>;
    rightPannelRef: RefObject<HTMLDivElement>;
}
const {TextArea} = Input;
const {Option} = Select;

const FormEditor = (props: FormEditorProps) => {
    const {config, defaultValue, onSave, uid, rightPannelRef} = props

    const onFinish = (values: Store) => {
        onSave && onSave(values)
    }
    const [form] = Form.useForm()

    useEffect(()=>{
        return () => {
            form.resetFields()
        }
    },[uid, form])

    const handleChange = () => {
        onFinish(form.getFieldsValue())
    }
    const formItemLayout = {
        labelCol: {span:6},
        wrapperCol:{span:16}
    }
    return (
        <Form
           form = {form}
           {...formItemLayout}
           name = {`form_editor`}
           onFinish={onFinish}
           initialValues={defaultValue}
           onValuesChange = {handleChange}
        >
            {config.map((item,i)=>{
                return(
                    <React.Fragment key={i}>
                        {item.type === 'Text' && (
                            <Form.Item label={item.name} name={item.key}>
                               <Input />
                            </Form.Item>
                        )}
                        {item.type === 'Number' && (
                            <Form.Item label={item.name} name={item.key}>
                                <InputNumber max={item.range && item.range[1]} />
                            </Form.Item>
                        )}
                        {item.type === 'Color' && (
                            <Form.Item label={item.name} name={item.key}>
                                <Color />
                            </Form.Item>
                        )}
                        {item.type === 'Select' && (
                            <Form.Item label={item.name} name={item.key}>
                                <Select placeholder="请选择">
                                {item.range.map((v: any, i: number) => {
                                    return (
                                    <Option value={v.key} key={i}>
                                        {v.text}
                                    </Option>
                                    );
                                })}
                                </Select>
                            </Form.Item>
                        )}
                    </React.Fragment>
                )
            })} 
        </Form>
    )
}
export default memo(FormEditor);