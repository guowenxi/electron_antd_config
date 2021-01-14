import React from 'react'
import { connect, Route } from 'umi'
import styled from 'styled-components'
import _ from 'lodash'
import { useState, useMemo, useEffect } from 'react'
import loadable from '@loadable/component'
import {
  Tabs,
  Card,
  Button,
  Input,
  Form,
  Checkbox,
  Space,
  Switch,
  Modal,
  Upload,
  Steps,
  Spin,
  Table,
  Drawer
} from 'antd'
const { Column } = Table
const { TabPane } = Tabs
const { Step } = Steps
const { Search } = Input
import { FontText, TabsBox, ShowBox, SettingIcon } from '@/styled'
import { useToggle, useUnmount, useAntdTable, useUpdate,useDynamicList  } from 'ahooks'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadOutlined } from '@ant-design/icons'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
const { ipcRenderer } = require('electron')

// import { TABLEJSON } from './TABLEJSON'
// import {tableConfig} from './columns'
import GridLayout from 'react-grid-layout'
import commonStyle from '@/common.less'
import { TopBtnWrap, TableBox, ButtonBox } from '@/styled'
import SearchMore from '@/components/SearchMore/SearchMore'
import TableInfo from '@/components/TableInfo/TableInfo'
import { openConfig } from '@/components/ModalConfig/index'
import ModalTable from '@/components/ModalConfig/modal_table'
import ModalInfo from '@/components/ModalConfig/modal_info'
import styles from './index.less'
import { shell } from 'electron'
import { filterKeys } from '@/utils/utils'
import { PaginatedParams } from 'ahooks/lib/useAntdTable'

const path = require('path')

interface IProps {
  loading: boolean
}

var tableJsonSelIndex  = 0 ;
const Pages = (props: IProps | any) => {
  const { dispatch } = props
  const { configData, configUrl, stauts } = props.common
  const { modal_table, modal_info } = props.common
  const [VISIBLE, setVISIBLE] = useState(false)
  const [STATE, setSTATE] = useState('edit')
  const [DETAIL, setDETAIL] = useState<any>({ id: '' })

  const { list, remove, getKey, push,replace } = useDynamicList([]);
  const { list :list_tableJson,  push:push_tableJsonList,replace:replace_tableJsonList } = useDynamicList([]);

  const [TableConfig, setTableConfig] = useState({operation:[]})
  const [PAGEDATA, setPAGEDATA] = useState({})
  const [TABLEJSON, setTABLEJSON] = useState({})
  const [PAGEURL, setPAGEURL] = useState({})
  const [Columns, setColumns] = useState({})
  const [CHECKINDEX, setCHECKINDEX] = useState(0)
  const [form] = Form.useForm()
  const [dawerVisible, setDawerVisible] = useState([]) /* 弹框是否显示 */

  const [detailsInfo, setDetailsInfo] = useState({}) /* 表格详情 */

  const [rowSelectedData, setRowSelectedData] = useState({}) /* 表格行选中数据 */
  const update = useUpdate() /* 强制刷新 */

  useEffect(() => {
    if (Object.keys(configData).length > 0) {
      form.setFieldsValue(configData)
      //如果在当前项目内有配置文件 则读取配置文件
      changePageConfig(0)
    }
  }, [])
  useEffect(() => {
    ipcRenderer.on(`router-reply`, (event, arg) => {
      switch (arg.type) {
        case 'NewLayout':
          Modal.success({
            content: arg.data
          })
          setPAGEURL(Object.assign(arg.PAGEURL, { noPage: false }))
          changePageConfig(CHECKINDEX)
          break
        case 'LoadLayout':
          if (arg.data) {
            filterData(arg.data)
          } else {
            setPAGEURL(Object.assign(arg.PAGEURL, { noPage: true }))
          }
          break
        case 'SaveLayout':
          //更新时重新加载页面 ,否则会导致import缓存问题
          update()
          break
      }
    })
  }, [])

  useUnmount(() => {
    ipcRenderer.removeAllListeners('router-reply')
  }, [])

  const filterData = async data => {
    //动态读取数据源
    //先读取columns的数据
    try {
      const columns = require(`../../components/modificationPage/columns`)
      setColumns(columns)
      setTableConfig(columns.tableConfig)
      //判断操作按钮多少,进行配置文件增减
      
    } catch (err) {
      alert(err)
    }
    //获取详情的配置文件
    let configPage = _.cloneDeep(data.getFilesData),TABLEJSONLIST=[];
    Object.keys(configPage).map(function(key){
      if(key.indexOf("TABLEJSON")==0){
        TABLEJSONLIST.push(configPage[key]);
      } 
    })
    TABLEJSONLIST.map(function(item,idx){
      const data = eval(item.split('=')[1]);
      push_tableJsonList(data)
    })
    // const tableJson = 
    //存入的数据为字符串数据 便于保存到文件
    dispatch({
      type: 'common/save',
      payload: {
        configData_configPage: configPage
      }
    })

    //保存配置
    setPAGEDATA(configPage)
    // setTABLEJSON(tableJson)


    
  }

  //默认加载的数据
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object
  ): Promise<any> => {
    let obj = filterKeys(formData)
    obj.pageNo = current
    return new Promise(resolve => {
      dispatch({
        type: 'common/requestData',
        method: 'GET',
        url: configData.DEV_URL + TableConfig.url,
        payload: {
          rbacToken: configData.RBACTOKEN,
          pageNo: current,
          pageSize: pageSize,
          ...filterKeys(formData)
        },
        callback: (_data: any) => {
          let list: Array<any> = _data.list
          resolve({
            list: list && !!list.length ? list : [{ test: '1' }],
            total: _data.total
          })
        }
      })
    })
  }
  // const getTableData = {};
  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form
  })

  const { submit, reset } = search

  const changePageConfig = idx => {

    //先置空数据

    setPAGEURL(configData.ROUTERS[idx])
    ipcRenderer.send('project-message', {
      id: 'router',
      type: 'LoadLayout',
      data: {
        PAGEURL: configData.ROUTERS[idx],
        name: configData.ROUTERS[idx].name,
        url: configUrl.split('\\config\\')[0] + '\\src'
      }
    })
  }
  const searchList = [
    { title: '关键字', type: 'input', key: 'keyword', placeholder: '请输入关键字' }
  ]

  const layout = [
    { i: 'a', x: 0, y: 0, w: 24, h: 2 },
    { i: 'b', x: 1, y: 0, w: 24, h: 22, minW: 24, maxW: 24 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 }
  ]

  /* 行选中 */
  const rowSelect = (record: { [k: string]: any }, index?: number): any => {
    return {
      onClick: e => {
        setRowSelectedData(record)
        // setDawerVisible(true)
        getDetailsInfo(record)
      }
    }
  }
  /* 获取详情 */
  const getDetailsInfo = record => {
    dispatch({
      type: 'common/requestData',
      url: '/fyDataService/DataDock/getPetitionEventDetailById',
      payload: {
        id: record.id
      },
      callback: (_data: any) => {
        setDetailsInfo(_data ? _data : {})
      }
    })
  }
  /* 修改详情 */
  const changeModalConfig = data => {
    let _data = data
    ipcRenderer.send('project-message', {
      id: 'router',
      type: 'SaveLayout',
      data: {
        name: configData.ROUTERS[CHECKINDEX].name,
        url: configUrl.split('\\config\\')[0] + '\\src',
        data: _data
      }
    })
  }

  return (
    <div>
      <ModalTable
        modalId={modal_table}
        onSubmit={data => {
          changeModalConfig(data)
          dispatch({
            type: 'common/save',
            payload: {
              modal_table: false
            }
          })
        }}
      ></ModalTable>
      <ModalInfo
        modalId={modal_info}
        onSubmit={data => {
          //把数据存到文件内
          const { DATALIST, configData_configPage } = props.common
          //操作数据 将数据进行转换
          const _data = `export const TABLEJSON = ${JSON.stringify(data)}`;
          dispatch({
            type: 'common/save',
            payload: {
              DATALIST: data,
              configData_configPage: Object.assign(configData_configPage, { [`TABLEJSON${tableJsonSelIndex+1}`]: _data })
            }
          })
          //保存到修改的列表里去
          replace_tableJsonList(tableJsonSelIndex,data)
          // setTABLEJSON(data)
          changeModalConfig(configData_configPage)

          // 再重新加载
          dispatch({
            type: 'common/save',
            payload: {
              modal_info: false
            }
          })
        }}
      ></ModalInfo>
      <TabsBox>
        {configData.ROUTERS &&
          configData.ROUTERS.map((item, idx) => {
            return (
              <div
                className={`tabs-item ${CHECKINDEX == idx ? 'checked-item' : ''}`}
                onClick={() => {
                  setCHECKINDEX(idx), changePageConfig(idx), setColumns({})
                }}
              >
                <div>{item.name}</div>
                {/* <div>{item.name}</div> */}
              </div>
            )
          })}
      </TabsBox>

      <ShowBox style={{'display':PAGEURL.noPage ? 'none' : 'block'}}>
        <GridLayout className='layout' layout={layout} cols={24} rowHeight={24} width={1350}>
          <div key='a' className={`${commonStyle['top-box']}`}>
            <SettingIcon
              onClick={event => {
                // openConfig("sreach",dispatch,event)
                dispatch({
                  type: 'common/save',
                  payload: {
                    modal_info: false
                  }
                })
              }}
            ></SettingIcon>
            <TopBtnWrap>
              <Button type='primary' className='topBtn'>
                excel导出
              </Button>
            </TopBtnWrap>
            <SearchMore
              form={form}
              hasMore={true}
              searchList={searchList}
              submit={submit}
              reset={reset}
            ></SearchMore>
          </div>
          <div key='b' className={commonStyle['bottom-box']}>
            <SettingIcon
              onClick={event => {
                // openConfig("table",dispatch,event)
                dispatch({
                  type: 'common/save',
                  payload: {
                    modal_table: true
                  }
                })
              }}
            ></SettingIcon>
            <Table
              rowKey='id'
              {...tableProps}
              //如果要对列表进行多选的时候可以打开
              // rowSelection={{
              //   type: 'checkbox',
              //   selectedRowKeys: SELECTROWKEYS,
              //   onChange: (selectedRowKeys: any, selectedRows) => {
              //     setSELECTROWKEYS(selectedRowKeys)
              //   }
              // }}
              //如果当前行可选中则放开
              onRow={rowSelect}
              className={`virtual-table  ${styles['scroll-table-box']}`}
              rowClassName={record =>
                record.id === rowSelectedData.id ? styles['select-bg-color'] : ''
              }
            >
              {Columns && Columns.tableColumns
                ? Columns.tableColumns(props, tableProps).map((i: any, index: any) => {
                    return (
                      <Column
                        {...i}
                        onCell={(): any => ({ width: i.width })}
                        onHeaderCell={(): any => ({ width: i.width })}
                      ></Column>
                    )
                  })
                : null}
              {TableConfig.operation && !!TableConfig.operation.length ? (
                <Column
                  title='操作'
                  width='30%'
                  render={(text: any, record: any) => {
                    return (
                      <ButtonBox>
                        {!!TableConfig.operation.length && TableConfig.operation.map((item, idx) => {
                          return (
                            <a
                              onClick={() => {
                                tableJsonSelIndex = idx;
                                replace(idx,true);
                                // setVISIBLE(true)
                                setSTATE('disabled')
                                setDETAIL(record)
                              }}
                            >
                              {item.name}
                            </a>
                          )
                        })}
                      </ButtonBox>
                    )
                  }}
                ></Column>
              ) : null}
            </Table>

            {TableConfig.operation.map((item, idx) => (
              <Drawer
                title='详情'
                placement='right'
                width={item.width ? `${item.width}vw` : '56vw'}
                closable={true}
                onClose={() => {
                  replace(idx,false);

                  setDetailsInfo({})
                }}
                visible={list[idx]}
                destroyOnClose={true}
              >
                <TableInfo
                  border='true'
                  data={list_tableJson[idx]}
                  detail={detailsInfo}
                  state={'disabled'}
                  onCancel={() => {
                     replace(idx,false);
                    setDetailsInfo({})
                  }}
                ></TableInfo>
              </Drawer>
            ))}
          </div>
        </GridLayout>
      </ShowBox>

      <div>
        {PAGEURL.noPage ? (
          <Button
            onClick={() => {
              ipcRenderer.send('project-message', {
                id: 'router',
                type: 'NewLayout',
                data: {
                  PAGEURL: PAGEURL,
                  name: PAGEURL.name,
                  url: configUrl.split('\\config\\')[0] + '\\src\\'
                }
              })
            }}
          >
            生成页面文件
          </Button>
        ) : null}
      </div>
    </div>
  )
}
export default connect(({ common }: any) => ({
  common
}))(Pages)
