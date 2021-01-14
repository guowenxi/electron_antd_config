const tableColumns =  (props,tableProps)=>{
  var pagination=tableProps.pagination;
  var current=pagination.current;
  var pageSize=pagination.pageSize;
  return [
    {
      title: '序号222',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
      className: 'no-flex',
      width: "5%",
      render: (text, record,index) => {
        
        return (current-1)*pageSize+index+1
      },
    },
    {
      title: '信访事项编号',
      dataIndex: 'carType',
      key: 'carType',
      className: 'no-flex',
      width: "17%",
    },
    {
      title: '信访入口',
      key: 'wgname',
      dataIndex: 'wgname',
      className: 'no-flex',
      width: "10%",
    },
    {
      title: '姓名',
      key: 'phone',
      dataIndex: 'phone',
      className: 'no-flex',
      width: "12%",
    },
    {
      title: '人数',
      key: 'department_id',
      dataIndex: 'department_id',
      className: 'no-flex',
      width: "10%",
    },
    {
      title: '证件号码',
      key: 'sex',
      dataIndex: 'v',
      className: 'no-flex',
      width: "15%",
    },
    {
      title: '信访日期',
      key: 'departmentName',
      dataIndex: 'departmentName',
      className: 'no-flex',
      width: "12%",
    },
    {
      title: '概况',
      key: 'carType',
      dataIndex: 'carType',
      className: 'no-flex',
      width: "20%",
    }
  ];
}

export default tableColumns;

//---@loadjson@---为标注字段 用于获取配置文件位置 勿删

//@loadjson@
export const tableConfig = {
  url:"/dataView/daySituation/getList",
  operation:[
    {name:"查看",type:"disabled"},
    {name:"编辑",type:"edit"},
  ],
}
//@loadjson@