import { Pagination, Table } from "antd";

const CustomTable = ({
  columns,
  data,
  loading,
  bordered = false,
  pagination = { current: 1, pageSize: 10, total: 0, onChange: () => {} },
  tableId,
  customStyle,
  onRowClick,
  components,
  rowClassName,
  showSizeChanger = true,
  onChange,
  rowStyle,
}) => {
  const handlePaginationChange = (page, pageSize) => {
    if (pagination.onChange) {
      pagination.onChange(page, pageSize);
    }
  };

  const mergedColumns = columns?.map((column) => {
    if (column.title === "Action") {
      column.fixed = "right";
      column.sorter = false;
      column.width = 100;
    }
    return column;
  });

  return (
    <div className="bg-white my-4">
      <Table
        className={customStyle}
        rowClassName={rowClassName}
        pagination={false}
        rowKey={tableId}
        onRow={(record) => ({
          onClick: (event) => {
            const target = event.target;
            const actionCell =
              target.closest("td:last-child") ||
              target.closest("button") ||
              target.closest(".ant-btn") ||
              target.closest(".ant-switch") ||
              target.closest('[role="button"]');

            if (actionCell) {
              event.stopPropagation();
              return;
            }
            if (onRowClick) {
              onRowClick(record, event);
            }
          },
          style: {
            cursor: onRowClick ? "pointer" : "",
            ...(rowStyle && rowStyle(record)),
          },
        })}
        loading={loading}
        columns={mergedColumns}
        dataSource={data}
        onChange={onChange}
        components={components}
        size="large"
        bordered={bordered}
        scroll={{ x: "max-content" }}
        id={tableId}
      />
      {pagination && pagination.total > 0 && (
        <div className="flex justify-between items-center py-4 pt-5">
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap justify-center sm:justify-start items-center text-sm text-gray-600 gap-1">
              <span className="font-medium">Showing</span>
              <span className="font-semibold text-gray-900">
                {(pagination.current - 1) * pagination.pageSize + 1}
              </span>
              <span>to</span>
              <span className="font-semibold text-gray-900">
                {Math.min(
                  pagination.current * pagination.pageSize,
                  pagination.total
                )}
              </span>
              <span>of</span>
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>
              <span>entries</span>
            </div>
          </div>

          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={showSizeChanger}
            pageSizeOptions={[10, 15]}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTable;
