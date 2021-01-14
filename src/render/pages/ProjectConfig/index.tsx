import React from 'react'
import { connect } from 'umi'
import styled from 'styled-components';
import _ from 'lodash'
import { useState, useMemo, useEffect } from 'react'
import { Card, Button, Input, Form, Checkbox, Space,Switch ,Modal,Upload ,Steps } from 'antd'
const { Step } = Steps;
const { Search } = Input
import { UploadBox } from './styled';
import { useToggle,useUnmount } from 'ahooks'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadOutlined } from '@ant-design/icons';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
const { ipcRenderer } = require('electron')
var shell = require('shelljs');
interface IProps {
  loading: boolean
}
const Pages = (props: IProps | any) => {
  const { dispatch } = props;
  const { configData ,  configUrl } = props.common;
  const [state, { toggle }] = useToggle()
  const [DATA, setDATA] = useState('')
  const [CURRENT, setCURRENT] = useState(0)
  const [form] = Form.useForm()
  useEffect(() => {
    //加载默认数据
    if(Object.keys(configData).length>0){
      form.setFieldsValue(configData)
    };

    ipcRenderer.on(`project-reply`, (event, arg) => {
      switch(arg.type){
        case "readFileSync":
          const _data = arg.data;
          try {
            const data = JSON.parse(_data.split('//@loadjson@')[1].split('let CONFIG= ')[1])
            setDATA(_data)
            data.DEFAULTLOADLIST.map((item, idx) => {
              return (item.payload = JSON.stringify(item.payload))
            })

            dispatch({
              type: 'common/save',
              payload: {
                configData:data
              }
            })
            form.setFieldsValue(data)
          } catch (err) {
            return err
          }
          break;
        case "writeFileSync":
          Modal.success({
            content: '修改成功',
          });
          // ipcRenderer.send('project-message', {
          //   id: 'project',
          //   type: 'Notification',
          //   data: {
          //     title:"通知",
          //     body:"已成功保存文件,点击进入页面配置"
          //   },
          // })
          break;
      }
    })
  
  }, [])

  useUnmount(() => {

    ipcRenderer.removeAllListeners("project-reply")
  }, [])

  const onFinish = data => {
    let data_copy = _.cloneDeep(data) ;
    dispatch({
      type: 'common/save',
      payload: {
        configData:data
      }
    })
    data_copy.DEFAULTLOADLIST.map((item, idx) => {
      return (item.payload = JSON.parse(item.payload))
    });

    //对数据进行重组
    let _data = DATA.split('//@loadjson@')
    _data[1] = 'let CONFIG= ' + JSON.stringify(data_copy)
    ipcRenderer.send('project-message', {
      id: 'project',
      type: 'writeFileSync',
      data: {
        url: configUrl,
        data: _data.join('\r//@loadjson@\r')
      }
    })
  }

  const onSearchRouter = value => {

  }

  return (
    <div>

<UploadBox>
  <div className="tips">*注:配置文件 -- 项目路径/config/routers.config.ts</div>
  <Upload 
  showUploadList={false}
  beforeUpload={(file)=>{
    if(file.path){
      dispatch({
        type: 'common/save',
        payload: {
          configUrl:file.path
        }
      })
      ipcRenderer.send('project-message', {
        id: 'project',
        type: 'readFileSync',
        data: {
          url: file.path
        },
      })
    }
    return false;
  }}>
    <Button icon={<UploadOutlined />}>获取配置文件</Button>
  </Upload>
  <div className="text">当前配置文件路径 : {configUrl} </div>
  </UploadBox>

<Form
style={{margin:"2vh"}}
name='basic'
form={form}
labelCol={{ span: 4 }}
wrapperCol={{ span: 16 }}
initialValues={{ remember: true }}
onFinish={onFinish}
>
<Form.Item label='标题' name='TITLE' rules={[{ required: true, message: '请输入标题!' }]}>
  <Input />
</Form.Item>
<Form.Item
  label='顶部标题'
  name='HEADTITLE'
  rules={[{ required: true, message: '请输入顶部标题!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='顶部次级标题'
  name='HEADSUBTITLE'
  rules={[{ required: false, message: '请输入顶部次级标题!' }]}
>
  <Input />
</Form.Item>

<Form.Item
  label='二级菜单的parentId(可无)'
  name='parentId'
  rules={[{ required: false, message: '请输入二级菜单的parentId!' }]}
>
  <Input />
</Form.Item>

<Form.Item
  label='测试环境接口地址'
  name='DEV_URL'
  rules={[{ required: true, message: '请输入测试环境接口地址!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='正式环境接口地址'
  name='BUILD_URL'
  rules={[{ required: true, message: '请输入测试环境接口地址!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='打包的项目路径地址'
  name='PUBLIC_PATH'
  rules={[{ required: true, message: '请输入打包的项目路径地址!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='登出的登录地址'
  name='LOGIN_URL'
  rules={[{ required: true, message: '请输入登出的登录地址!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='测试的token'
  name='RBACTOKEN'
  rules={[{ required: false, message: '请输入测试的token!' }]}
>
  <Input />
</Form.Item>
<Form.Item
  label='WEBSOCKET配置'
  name='WEBSOCKETURLS'
  rules={[{ required: false, message: '请输入测试的token!' }]}
>
  <Form.List name='WEBSOCKETURLS'>
    {(fields, { add, remove }) => (
      <>
        {fields.map(field => {
          return (
            <div
              key={field.name}
              style={{ display: 'flex', 'alignItems': 'baseline' }}
              align='baseline'
            >
              <Form.Item
                style={{ flex: '1' }}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                label='名称'
                name={[field.name, 'name']}
                fieldKey={[field.fieldKey, 'name']}
                rules={[{ required: true, message: '请输入名称!' }]}
              >
                <Input placeholder='First Name' />
              </Form.Item>
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                label='地址'
                name={[field.name, 'url']}
                fieldKey={[field.fieldKey, 'url']}
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </div>
          )
        })}
        <Form.Item noStyle>
          <Button
            style={{ width: '50vw' }}
            type='dashed'
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            添加webSokect配置
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Form.Item>

<Form.Item
  label='默认加载的数据配置'
  name='DEFAULTLOADLIST'
  rules={[{ required: false, message: '请输入测试的token!' }]}
>
  <Form.List name='DEFAULTLOADLIST'>
    {(fields, { add, remove }) => (
      <>
        {fields.map(field => {
          return (
            <div
              key={field.name}
              style={{ display: 'flex', 'alignItems': 'baseline' }}
              align='baseline'
            >
              <Form.Item
                style={{ flex: '2' }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
                label='名称'
                name={[field.name, 'name']}
                fieldKey={[field.fieldKey, 'name']}
                rules={[{ required: true, message: '请输入名称!' }]}
              >
                <Input placeholder='First Name' />
              </Form.Item>
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label='地址'
                name={[field.name, 'url']}
                fieldKey={[field.fieldKey, 'url']}
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 19 }}
                label='参数'
                name={[field.name, 'payload']}
                fieldKey={[field.fieldKey, 'payload']}
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </div>
          )
        })}
        <Form.Item noStyle>
          <Button
            style={{ width: '50vw' }}
            type='dashed'
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            添加默认加载的数据配置
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
</Form.Item>
<Form.Item
  label='地图中心点配置'
  name='ROOT_MAP_CENTER'
  rules={[{ required: false, message: '请输入地图中心点配置!' }]}
>
  <Input />
</Form.Item>

<Form.Item
  label='项目路由/页面配置'
  name='ROUTERS'
>
  <Search
  style={{marginBottom:'2vh'}}
    placeholder='输入接口'
    defaultValue="http://"
    allowClear
    enterButton='通过接口查询'
    size='middle'
    onSearch={onSearchRouter}
  />
  <Switch style={{marginBottom:'2vh'}} checkedChildren="使用接口路由" unCheckedChildren="使用本地路由" defaultChecked />
  <Form.List name='ROUTERS'>
    {(fields, { add, remove }) => (
      <>
        {fields.map(field => {
          return (
            <div
              key={field.name}
              style={{ display: 'flex', 'alignItems': 'baseline' }}
              align='baseline'
            >
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label='名称'
                name={[field.name, 'name']}
                fieldKey={[field.fieldKey, 'name']}
                rules={[{ required: true, message: '请输入名称!' }]}
              >
                <Input placeholder='First Name' />
              </Form.Item>
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label='地址'
                name={[field.name, 'path']}
                fieldKey={[field.fieldKey, 'path']}
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
              <Form.Item
                style={{ flex: '4' }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 19 }}
                label='参数'
                name={[field.name, 'component']}
                fieldKey={[field.fieldKey, 'component']}
                rules={[{ required: true, message: '请输入地址!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </div>
          )
        })}
      <Form.Item noStyle>
          <Button
            style={{ width: '50vw' }}
            type='dashed'
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            添加默认加载的数据配置
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>

</Form.Item>



<Space align='baseline' style={{ width:'100%',marginTop:'2vh'}}>
  <Form.Item>
    <Button type='primary' htmlType='submit'>
      取消
    </Button>
  </Form.Item>
  <Form.Item>
    <Button type='primary' htmlType='submit'>
      保存
    </Button>
  </Form.Item>
</Space>
</Form>


     </div>
  )
}
export default connect(({ common }: any) => ({
  common
}))(Pages)
