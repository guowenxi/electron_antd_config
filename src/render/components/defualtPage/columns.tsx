/* 
        title: 列表字段标题,
      dataIndex: 列表绑定key,
      key: 列表绑定key,
      className: 样式名,
      width: 宽度,
*/ 
const tableColumns =  (props,tableProps)=>{
  var pagination=tableProps.pagination;
  var current=pagination.current;
  var pageSize=pagination.pageSize;
  return [
  ]
}

export default tableColumns;

//---@loadjson@---为标注字段 用于获取配置文件位置 勿删

//@loadjson@
export const tableConfig = {
  url:"/dataView/daySituation/getList",
  operation:[
  ],
}
//@loadjson@