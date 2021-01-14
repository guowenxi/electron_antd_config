import styled from 'styled-components';
import {SettingFilled } from '@ant-design/icons'
export const FontText = styled.div`
font-size:15px;

`;
export const TabsBox = styled.div`
    width:100%;
    cursor: pointer;
    overflow:hidden;
    margin-bottom:10px;
.tabs-item{
    padding:10px;
    float:left;
    position: relative;
    
}
.checked-item{
    &:after{
        content:"";
        left:0;
        border-radius:2px;
        position:absolute;
        bottom:0;
        width:100%;
        height:2px;
        background:#ccc;
    }
}
`;

export const ShowBox = styled.div`
  width:1350px;
  height:837px;
  position: absolute;
  margin:0 auto;
  background:#fff;
  top: 143px;
    left: 266px;
`;
export const TableBox = styled.div`
.top-box{
  padding: 0 1.04vw;
  margin: 1.85vh 0 2.04vh;
}
.first-span{
  line-height: 36px;
  height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #1572e8;
  margin-right: 10px;
  padding: 0 10px;
  cursor: pointer;
  &:hover{
    opacity: .8;
  }
  &:last-child{
    margin-right: 0;
  }
}
`;
export const ButtonBox = styled.span`
  a{
    padding:0 11px;
  }
`;
export const TopBtnWrap  =styled.div`
  position:absolute;

  display: flex;
  align-items: flex-start;
  padding-top: 0.1vw;
  z-index:1000;
  .topBtn {
    margin-right:2vh;
  }
`;
export const SettingIcon = styled(SettingFilled)`
position:absolute;
right:-8px;
top:-8px;
font-size:23px;
z-index:100;
opacity:0.7;
cursor:cell;
`;
