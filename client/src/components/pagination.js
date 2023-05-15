import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const TaskPagination = (props) => {
  return (
    <Stack spacing={5} className="my-5">
      <Pagination
        count={
          Math.ceil(props.setting.totalPage / props.setting.pagePer)
            ? Math.ceil(props.setting.totalPage / props.setting.pagePer)
            : 1
        }
        size="large"
        variant="outlined"
        shape="rounded"
        page={props.setting.currentPage}
        onChange={props.handlePagination}
      />
    </Stack>
  );
};

export default TaskPagination;
