import React from 'react'
import { connect, Route } from 'umi'
import styled from 'styled-components'
import _, { indexOf } from 'lodash'
import { useState, useMemo, useEffect } from 'react'
import { Modal, Input } from 'antd'
const { Search } = Input
import { useToggle, useUnmount, useAntdTable, useUpdateEffect, useDynamicList } from 'ahooks'
import { MinusCircleOutlined, PlusOutlined, CloseOutlined ,FormOutlined } from '@ant-design/icons'
const { ipcRenderer } = require('electron')
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import ModalConfig from '@/components/ModalConfig/index'
import { Collapse, Button, Space } from 'antd'
import { Form } from 'antd'
import { Select } from 'antd'
const { Option } = Select
const { Panel } = Collapse

export interface Iconf {
  disabled: boolean
  size?: 'large' | 'middle' | 'small'
  style: {
    width: string
  }
}

export interface Ifield {
  col?: 7
  type?: 'input' | 'inputNumber'
  props?: Iconf
  name?: string
}

export interface IitemData {
  name?: string
  width?: string
  height?: string
  label: {
    name: string
    col?: number
    style?: { [k: string]: any }
  }
  field: Ifield
  rules?: [
    {
      required: boolean
      message: string
    }
  ]
}

const WrapEdit = styled.div`
  width: 100%;
  height: 50vh;
`
const CloseIcon = styled(CloseOutlined)`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10;
`
const EditIcon = styled(FormOutlined)`
  cursor: pointer;
  position: absolute;
  right: 40px;
  top: 10px;
  z-index: 10;
`

const ModalInfo: React.FC = props => {
  const { dispatch, onSubmit, modalId } = props
  const { modal_info, configType, configData_configPage, DATALIST } = props.common

  const [form] = Form.useForm()
  const [TIPS, setTIPS] = useState(null)
  const [stautsSelect, setstautsSelect] = useState(true)
  const [Title, setTitle] = useState('')
  const [selType, setselType] = useState('')  //作为默认保存项和修改临时保存项
  const [DATA, setDATA] = useState([])
  const [requiredState, setrequiredState] = useState(true)

  const callback = code => {
    return
  }
  useUpdateEffect(() => {}, [])

  useUnmount(() => {}, [])

  useEffect(() => {

    setDATA(_.cloneDeep(DATALIST) ? _.cloneDeep(DATALIST) : [])
  }, [DATALIST])



  const delIndex = () => {
    const data = _.cloneDeep(DATA)
    data.splice(TIPS, 1)
    setDATA(data)
    setTIPS(null)
  }

  const changeSelect = (e)=>{
    //如果组件不包含关联信息 则重置关联数据
    if(selType && selType.indexOf('Select,CheckBox,Radio,SelectMultiple,SelectSingleTree') < 0){
      let data = form.getFieldsValue();
      if(data.field.props) data.field.props.relateList=[];
      form.setFieldsValue(data)
    }
    setselType(e)
  }


  return (
    <ModalConfig
      modalId={modalId}
      modalKey={'modal_info'}
      handleOk={data => {
        // 向上传递
        onSubmit(DATA);
      }}
      handleCancel={()=>{
          setDATA(_.cloneDeep(DATALIST))
      }}
    >
      <Modal
        title='警告'
        visible={TIPS === null ? false : true}
        onOk={() => {
          delIndex()
        }}
        onCancel={() => {
          setTIPS(null)
        }}
      >
        是否删除
      </Modal>
      <Modal
        title='编辑组件'
        visible={TIPS === null ? false : true}
        onOk={() => {
          
          let data = _.cloneDeep(form.getFieldsValue()) ;

          data.rules = [data.rules];
          if(typeof(data.field.props.style)=='string') data.field.props.style = JSON.parse(data.field.props.style);
          setselType(data)
          let _data = DATA;
          //将对象包裹
          if(TIPS !=null){
            if(TIPS == -1){
              _data.push(data);
            }else{
              _data[TIPS] = data ;
            }
          }
          setDATA(_data);
          setTIPS(null)
        }}
        onCancel={() => {
          setTIPS(null)
        }}
      >
        <Form  form={form}  name="editData" onValuesChange={()=>{

        }}>
                <Form.Item label='绑定key' name="name" initialValue="">
                  <Input />
                </Form.Item>
                <Form.Item label='标题' name={['label','name']} initialValue="">
                  <Input/>
                </Form.Item>

                <Form.Item label='宽度' name="width">
                  <Input/>
                </Form.Item>
                <Form.Item label='标题比例' name={['label','col']} initialValue="3">
                  <Input/>
                </Form.Item>
                <Form.Item label='内容化比例' name={['field','col']} initialValue="7">
                  <Input/>
                </Form.Item>
                <Form.Item label='默认值' name={['field','props','defaultValue']} initialValue="">
                <Input/>
                </Form.Item>
                <Form.Item label='默认样式' name={['field','props','style']} initialValue="{}">
                <Input/>
                </Form.Item>
                <Form.Item label='类型' name={['field','type']}>
                <Select
                onChange={(e)=>{changeSelect(e)}}>
                    <Option value='Input'>输入框</Option>
                    <Option value='InputNumber'>数字输入框</Option>
                    <Option value='InputTimeSelect'>带时间的数字输入框</Option>
                    <Option value='TwoInput'>车队电子票双输入框</Option>
                    <Option value='TextArea'>多行输入框</Option>
                    <Option value='Cascader'>多选框</Option>
                    <Option value='Upload'>文件选择</Option>
                    <Option value='Select'>下拉选择</Option>
                    <Option value='SelectMultiple'>下拉多选</Option>
                    <Option value='SelectMultiplePlate'>车牌输入框</Option>
                    <Option value='SelectMultipleTable'>带列表的多选</Option>
                    <Option value='SelectSingleTree'>树形菜单选择</Option>
                    <Option value='UploadImage'>图片选择</Option>
                    <Option value='Radio'>单选按钮</Option>
                    <Option value='CheckBox'>多选按钮</Option>
                    <Option value='DatePicker'>日期选择</Option>
                    <Option value='TimePicker'>时间选择</Option>
                    <Option value='RangePicker'>时间段选择</Option>
                    <Option value='DynamicList'>单选按钮</Option>
                    <Option value='Editor'>富文本</Option>
                    <Option value='MapSelect'>地图选点</Option>
                    <Option value='TableTitle'>标题</Option>
                  </Select>
                </Form.Item>
                {
                  'Select,Radio,Cascader,SelectMultiple,SelectSingleTree'.split(',').includes(selType) ? 
                    <Form.Item label='请求配置参数(options)' name={['field','props','options']} initialValue="">
                   <Input/>
                </Form.Item>
                   : null
                }
                {
                  'Cascader'.split(',').includes(selType)? (
                    <CascaderConfig form={form}></CascaderConfig>
                  ) : null
                }
                {
                  'Select,CheckBox,Radio,SelectMultiple,SelectSingleTree'.split(',').includes(selType)? 
                    <RelateConfig form={form}></RelateConfig>
                   : null
                }
                {
                  'Cascader'.split(',').includes(selType)  ? (
                    <Form.Item label='parentKey名' name={['field','props','parentKeyName']} initialValue="">
                    <Input/>
                  </Form.Item>
                  ) : null
                }
                {
                  'Select,Cascader,DynamicList,SelectMultiple,SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='key名' name={['field','props','keyName']} initialValue="">
                    <Input/>
                  </Form.Item>
                  ) : null
                }
                {
                  'Select,SelectMultiple,SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='id名' name={['field','props','idName']} initialValue="">
                    <Input/>
                  </Form.Item>
                  ) : null
                }
                {
                  'DatePicker'.split(',').includes(selType)  ? (
                    <Form.Item label='是否显示时间' name={['field','props','showTime']} initialValue="">
                    <Select>
                    <Option value='true'>是</Option>
                    <Option value='false'>否</Option>
                  </Select>
                  </Form.Item>
                  ) : null
                }
                {
                  'DatePicker'.split(',').includes(selType)  ? (
                    <Form.Item label='截至日期' name={['field','props','disabledDate']} initialValue="">
                    <Select>
                    <Option value='>'>大于当前时间</Option>
                    <Option value='<'>小于当前时间</Option>
                  </Select>
                  </Form.Item>
                  ) : null
                }
                {
                  'DatePicker'.split(',').includes(selType)  ? (
                    <Form.Item label='截至时间' name={['field','props','disabledTime']} initialValue="">
                    <Select>
                    <Option value='>'>大于当前时间</Option>
                    <Option value='<'>小于当前时间</Option>
                  </Select>
                  </Form.Item>
                  ) : null
                }
                {
                  'InputNumber'.split(',').includes(selType)  ? (
                    <Form.Item label='最小值' name={['field','props','min']}  initialValue="">
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'InputNumber'.split(',').includes(selType)  ? (
                    <Form.Item label='最大值' name={['field','props','max']}  initialValue="">
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'InputNumber'.split(',').includes(selType)  ? (
                    <Form.Item label='输入框内字体大小' name={['field','props','size']}  initialValue=""> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'Select,InputTimeSelect,SelectMultiple'.split(',').includes(selType)  ? (
                    <Form.Item label='请求后台地址' name={['field','props','url']}  initialValue=""> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'Select,InputTimeSelect,SelectMultiple'.split(',').includes(selType)  ? (
                    <Form.Item label='请求后台参数' name={['field','props','params']}  initialValue=""> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'Select,SelectMultiple'.split(',').includes(selType)  ? (
                    <Form.Item label='是否使用默认请求数据' >
                    <Select  onChange={(e)=>{setstautsSelect(e)}}>
                    <Option value='true'>是</Option>
                    <Option value='false'>否</Option>
                  </Select>
                  </Form.Item>
                  ) : null
                }

                {
                  'Select'.split(',').includes(selType)  && stautsSelect ? (
                    <Form.Item label='默认请求的数据字段' name={['field','props','relationType']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                   'Select'.split(',').includes(selType)   && stautsSelect ? (
                    <Form.Item label='选中时修改option时的字段名' name={['field','props','optionsKeyName']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                   'Select'.split(',').includes(selType)   && stautsSelect ? (
                    <Form.Item label='选中时修改option的数组' name={['field','props','optionsList']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='按钮名称' name={['field','props','btnText']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='默认选中项字段名' name={['field','props','itemKey']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='选中框标题' name={['field','props','modalTitle']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'SelectMultipleTable'.split(',').includes(selType)  ? (
                    <Form.Item label='选中框标题' name={['field','props','modalTitle']}> 
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'SelectMultipleTable,SelectSingleTree'.split(',').includes(selType)  ? (
                    <Form.Item label='表格项配置(对象)(url,params,columnsList)' name={['field','props','tableSetting']}>
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'Upload,UploadImage'.split(',').includes(selType)  ? (
                    <Form.Item label='附件请求地址' name={['field','props','uploadUrl']}>
                    <Input/>
                    </Form.Item>
                  ) : null
                }
                {
                  'UploadImage'.split(',').includes(selType)  ? (
                    <Form.Item label='图片的最大展示数量' name={['field','props','maxFileNum']}>
                    <Input/>
                    </Form.Item>
                  ) : null
                }

                  <Form.Item label='是否必填'
                     name={['rules', 'required']}
                       initialValue={true}>
                    <Select onChange={(e)=>{setrequiredState(e)}}>
                      <Option value='true'>是</Option>
                      <Option value='false'>否</Option>
                    </Select>
                  </Form.Item>
                  {
                    requiredState === 'true'  ? (
                      <Form.Item label='必填项内容'
                      name={['rules', 'message']}
                      initialValue={''}>
                      <Input/>
                      </Form.Item>
                    ) : null
                  }

               {/* <Form.List name='rules'>
               {(fields, { add, remove }) => (
                 <>
                    {(!!fields.length ? fields : new Array(1).fill('')).map((field, i) => {
                    return <>

                </>
              })}
                 </>
               )}
            </Form.List> */}
        </Form>
      </Modal>


      <div style={{ margin: '10px 0' }}>
        <Button
          type='primary'
          onClick={() => {
            setselType('')
            setTIPS(-1)
          }}
        >
          新增组件
        </Button>
      </div>

{      <Collapse defaultActiveKey={['0']} onChange={callback}>
        {DATA &&
          DATA.map((item, idx) => {
            return (
              <Panel header={item.label.name} key={idx} style={{ position: 'relative' }}>
                <EditIcon 
                  onClick={() => {
                    let data = DATA[idx];
                    data.rules = data.rules[0];
                    form.setFieldsValue(data);
                    setselType(data.field.type)
                    setTIPS(idx)
                  }}
                />
                <CloseIcon
                  onClick={() => {
                    setTIPS(idx)
                  }}
                />
                <Form.Item label='绑定key'>{item.name}</Form.Item>
                <Form.Item label='标题'>{item.label.name}</Form.Item>
                <Form.Item label='宽度'>{item.width}</Form.Item>
                <Form.Item label='类型'>
                  <Select defaultValue={item.field.type} disabled>
                    <Option value='Input'>输入框</Option>
                    <Option value='InputNumber'>数字输入框</Option>
                    <Option value='InputTimeSelect'>带时间的数字输入框</Option>
                    <Option value='TwoInput'>双输入框</Option>
                    <Option value='TextArea'>多行输入框</Option>
                    <Option value='Cascader'>多选框</Option>
                    <Option value='Upload'>文件选择</Option>
                    <Option value='Select'>下拉选择</Option>
                    <Option value='SelectMultiple'>下拉多选</Option>
                    <Option value='SelectMultiplePlate'>车牌输入框</Option>
                    <Option value='SelectMultipleTable'>带列表的多选</Option>
                    <Option value='SelectSingleTree'>树形菜单选择</Option>
                    <Option value='UploadImage'>图片选择</Option>
                    <Option value='Radio'>单选按钮</Option>
                    <Option value='CheckBox'>多选按钮</Option>
                    <Option value='DatePicker'>日期选择</Option>
                    <Option value='TimePicker'>时间选择</Option>
                    <Option value='RangePicker'>时间段选择</Option>
                    <Option value='DynamicList'>单选按钮</Option>
                    <Option value='Editor'>富文本</Option>
                    <Option value='MapSelect'>地图选点</Option>
                    <Option value='TableTitle'>标题</Option>
                  </Select>
                </Form.Item>
                <Form.Item label='是否必填'>
                  <Select
                  disabled
                    defaultValue={item.rules.required}
                  >
                    <Option value='true'>是</Option>
                    <Option value='false'>否</Option>
                  </Select>
                </Form.Item>
              </Panel>
            )
          })}
      </Collapse>
   }
    </ModalConfig>
  )
}

export default connect(({ common }: any) => ({
  common
}))(ModalInfo)

const CascaderConfig: React.FC = props => {
  const WrapBox = styled.div`
    padding: 20px;
    padding-top: 0;
  `
  const data = props.form.getFieldValue("relationList");
  const { list, remove, getKey, push, replace } = useDynamicList(data || [])


  return (
    <WrapBox>
      <Form.List name={['field','props','relationList']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, i) => {
                return (
                  <Space size='middle' style={{ padding: '15px 0 ' }}>
                    <Form.Item
                  {...field}
                  label="请求参数:"
                  name={[field.name, 'payload']}
                  fieldKey={[field.fieldKey, 'payload']}
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>
                    <Form.Item
                  {...field}
                  label="请求地址:"
                  name={[field.name, 'url']}
                  fieldKey={[field.fieldKey, 'url']}
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(i)
                      }}
                    />
                  </Space>
                )
              })}
            <Button
              type='dashed'
              onClick={() => {
                add({ payload: '', url: '' })
              }}
              block
              icon={<PlusOutlined />}
            >
              新增级联接口
            </Button>
          </>
        )}
      </Form.List>
    </WrapBox>
  )
}
const RelateConfig: React.FC = props => {
  const WrapBox = styled.div`
    padding: 20px;
    padding-top: 0;
  `
  const data = props.form.getFieldValue("relateList");
  const { list, remove, getKey, push, replace } = useDynamicList(data || [])

  return (
    <WrapBox>
      <Form.List name={['field','props','relateList']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, i) => {
                return (
                  <Space size='middle' style={{ padding: '15px 0 ' }}>
                    <Form.Item
                  {...field}
                  label="关联字段名:"
                  name={[field.name, 'relateName']}
                  fieldKey={[field.fieldKey, 'relateName']}
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>
                    <Form.Item
                  {...field}
                  label="关联的key名:"
                  name={[field.name, 'relatekey']}
                  fieldKey={[field.fieldKey, 'relatekey']}
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(i)
                      }}
                    />
                  </Space>
                )
              })}
            <Button
              type='dashed'
              onClick={() => {
                add({ payload: '', url: '' })
              }}
              block
              icon={<PlusOutlined />}
            >
              新增关联
            </Button>
          </>
        )}
      </Form.List>
    </WrapBox>
  )
}
