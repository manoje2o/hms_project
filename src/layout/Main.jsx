import React from "react";
import Button from "../components/button/Button";
import { Table } from "antd";

const Main = ({
  tittle,
  addButtonTittle,
  columns,
  datasource,
  onClick,
  filter,
}) => {
  return (
    <div className="bg-white mx-3 my-4 px-3 px-md-4 py-4 py-md-5 rounded-4 shadow-sm border">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 border-bottom pb-3 gap-3">
        <h2 className="mb-0 text-dark fw-serif fw-bold">👩‍⚕️ {tittle}</h2>
        <div className="d-flex gap-2">
          <Button
            text={addButtonTittle}
            variant="primary"
            className="rounded-pill px-4 fw-medium"
            onClick={onClick}
          />
        </div>
      </div>
      {filter}
      <Table
        columns={columns}
        dataSource={datasource}
        scroll={{ x: "max-content" }} // enables horizontal scrolling on smaller screens
        pagination={5}
      />
    </div>
  );
};

export default Main;
