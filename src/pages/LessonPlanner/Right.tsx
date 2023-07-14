import React from "react";
import booksImage from "../../images/books.jpg";
import { UploadOutlined } from '@ant-design/icons';
import './index.less';

const LessonRight = () => {
  return (
    <>
      <div className="right-content-inner-history right-content-inner">
        <span>历史教案</span>
        <div className="history-image">
          <img src={booksImage}></img>
        </div>
      </div>
      <div
        className="right-content-inner"
        style={{ marginTop: 20, }}
      >
        <div className="toolbutton">
          <span>导入教案</span>
          <span className="icon">
            <UploadOutlined/>
          </span>
        </div>
        <div className="toolbutton">
          <span>导入课本</span>
          <span className="icon">
            <UploadOutlined/>
          </span>
        </div>
        <div className="toolbutton">
          <span>导入教案模板</span>
          <span className="icon">
            <UploadOutlined/>
          </span>
        </div>
      </div>
    </>
  );
};


export default LessonRight;