import React from "react";
import Modal from "@mui/material/Modal";
import { Typography, Button, Checkbox } from "@material-tailwind/react";
import { Radio } from "@material-tailwind/react";
import { FormControlLabel, FormGroup } from "@mui/material";
import Box from "@mui/material/Box";

const filterStyle = {
  position: "absolute",
  top: "55%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 24,
  borderRadius: 3,
  p: 4
};
const FilterModal = (props) => {
  const dateBy = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All" }
  ];
  return (
    <Modal
      open={props.open}
      handleClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={filterStyle}
        className="w-10/12 md:w-7/12 left-1/2 md:left-2/3 md:top-30"
      >
        <Typography id="modal-modal-title" variant="h2" component="h1">
          Filter Task
        </Typography>
        <hr className="my-2 border-blue-gray-50" />
        <form className="gap-2">
          <div className="grid grid-cols-1">
            <Typography
              variant="h6"
              color="gray"
              className="flex items-center font-bold"
            >
              Status By
            </Typography>
          </div>
          <div className="grid grid-cols-3">
            <FormGroup className="">
              {props.status.map((item, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      key={index}
                      name={item.value}
                      checked={`${props.filterBy[item.value] ? "checked" : ""}`}
                      onChange={props.handleFilterStatus}
                      className=" col-span-1"
                    />
                  }
                  key={index}
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center font-normal"
                    >
                      {item.label}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </div>
          <hr className="my-2 border-blue-gray-50" />
          <div className="grid grid-cols-1">
            <Typography
              variant="h6"
              color="gray"
              className="flex items-center font-bold"
            >
              Date By
            </Typography>
          </div>
          <div className="grid grid-cols-2">
            {dateBy.map((item, index) => (
              <Radio
                key={index}
                id={item.value}
                label={item.label}
                checked={`${
                  props.filterBy.date === item.value ? "checked" : ""
                }`}
                name="type"
                onChange={props.handleFilterDate}
              />
            ))}
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
              onClick={props.filterTask}
            >
              Show Result
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FilterModal;
