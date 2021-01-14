export const tableColumns = (props: {  },tableProps:any) => {
  let pagination:object=tableProps.pagination;
  let current=pagination.current;
  let pageSize=pagination.pageSize;
  return [
    {
      title: '序号',
      dataIndex: 'a',
      key: 'a',
      align: 'center',
      className: 'no-flex',
      width: "5%",
      render: (text: any, record: { eventTypes: string; }, index: any) => {
        return (current-1)*pageSize+index+1
      },
    },
    {
      title: '信访事项编号',
      dataIndex: 'petitionNumber',
      key: 'petitionNumber',
      className: 'no-flex',
      width: "17%",
    },
    {
      title: '信访入口',
      key: 'petitionEntrance',
      dataIndex: 'petitionEntrance',
      className: 'no-flex',
      width: "10%",
    },
    {
      title: '姓名',
      key: 'petitionName',
      dataIndex: 'petitionName',
      className: 'no-flex',
      width: "12%",
    },
    {
      title: '人数',
      key: 'peopleCount',
      dataIndex: 'peopleCount',
      className: 'no-flex',
      width: "10%",
    },
    {
      title: '证件号码',
      key: 'petitionCardId',
      dataIndex: 'petitionCardId',
      className: 'no-flex',
      width: "15%",
    },
    {
      title: '信访日期',
      key: 'eventDate',
      dataIndex: 'eventDate',
      className: 'no-flex',
      width: "12%",
    },
    {
      title: '概况',
      key: 'incidentContent',
      dataIndex: 'incidentContent',
      className: 'no-flex',
      width: "20%",
    }
  ];
}


//---@loadjson@---为标注字段 用于获取配置文件位置 勿删

//@loadjson@
export const tableConfig = {
  url:"/dataView/handleEvent/getEventListByTodo",
  operation:[
    {name:"查看",type:"disabled"},
    {name:"编辑",type:"edit"},
  ],
}
//@loadjson@