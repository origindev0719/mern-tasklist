import React from "react";
import Modal from "@mui/material/Modal";
import {
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option
} from "@material-tailwind/react";
import moment from "moment";

import Box from "@mui/material/Box";
import TextField from "@material-ui/core/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 24,
  borderRadius: 3,
  p: 4
};
const AddModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h2" component="h1">
          {props.isEdit ? "Edit" : "Create"} Task
        </Typography>
        <hr className="my-2 border-blue-gray-50" />
        <form className="items-end gap-6">
          <div className="flex flex-col items-end gap-6">
            <Input
              label="Title"
              size="lg"
              id="title"
              value={props.editTask?.title}
              onChange={props.handleChange}
            />
            <Textarea
              label="Description"
              rows={6}
              id="description"
              value={props.editTask?.description}
              onChange={props.handleChange}
            />
          </div>
          <div className="my-4 md:flex items-center gap-4 justify-between">
            <Box className="md:w-2/5 my-3 md:my-3">
              <Select
                id="status"
                name=""
                label="Select Status"
                onChange={props.handleChangeStatus}
                value={props.editTask?.status}
              >
                {props.status.map((ele, index) => (
                  <Option value={ele.value} key={index}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Box>
            <TextField
              className="md:w-2/5 w-full"
              id="date"
              label="Start Date"
              type="date"
              value={
                props.editTask &&
                moment(props.editTask.date).format("YYYY-MM-DD")
              }
              onChange={props.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <hr className="my-2 border-blue-gray-50" />
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outlined"
              color="gray"
              size="md"
              onClick={props.handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="blue"
              size="md"
              onClick={props.saveTask}
            >
              {props.isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddModal;
