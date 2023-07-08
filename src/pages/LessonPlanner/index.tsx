import { Button, Empty, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setaiActive } from "../../reducers/globalSlice";
import CreateModal from "../../settings/createModal";

const LessonPlanner: React.FC = () => {
  const dispatch = useDispatch();
  const { editId, aiActive } = useSelector((state: any) => state.global);
  const [createVisible, setCreateVisible] = useState(false);
  const showCreateModal = () => {
    setCreateVisible(true);
  };

  const closeCreateModal = () => {
    setCreateVisible(false);
  };
  const devTools = (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        display: "flex",
        alignItems: "center",
      }}
    >
      openAI请求&nbsp;&nbsp;
      <Switch
        checkedChildren="开启"
        unCheckedChildren="关闭"
        checked={aiActive}
        onClick={(checked) => {
          dispatch(setaiActive(checked));
        }}
      />
    </div>
  );
  const emptyView = (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{
        height: 60,
      }}
      description={
        <span>
          现在创建教案吧！
          {/* 修改 <a
          style={{ color: '#4979e6' }}
          onClick={showModal}
        >
          教案预设
        </a> */}
        </span>
      }
    >
      <Button type="primary" size="large" onClick={showCreateModal}>
        创建教案！
      </Button>
    </Empty>
  );
  const [EditorApp, setEditorApp] = useState<any>(null);

  const createModal = (
    <CreateModal visible={createVisible} onCancel={closeCreateModal}>
      {/* Add the content of the Modal here */}
    </CreateModal>
  );

  useEffect(() => {
    window.requestIdleCallback(async () => {
      const { default: LoadedEditorApp } = await import("../../EditorApp");
      setEditorApp(() => LoadedEditorApp);
    });
  }, []);
  const renderEditorApp = EditorApp ? <EditorApp /> : <div>loading</div>;

  return (
    <>
      {editId ? renderEditorApp : emptyView}
      {createModal}
    </>
  );
};

export default LessonPlanner;
