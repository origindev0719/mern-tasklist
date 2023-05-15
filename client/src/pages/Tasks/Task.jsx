import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Navbar,
  IconButton,
  MenuItem,
  MenuList,
  MenuHandler,
  Input,
  Menu
} from "@material-tailwind/react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  fetchTask,
  addTask,
  removeTask,
  updateTask,
  searchTask,
  filterByTask
} from "../../actions/task";
import useDebounce from "../../hook/useDebounce";

import {
  TrashIcon,
  Bars3Icon,
  PencilSquareIcon,
  UserIcon,
  CalendarDaysIcon,
  PlusIcon,
  AdjustmentsVerticalIcon
} from "@heroicons/react/24/outline";
import AddModal from "../../components/addModal";
import FilterModal from "../../components/filterModal";
import Pagination from "../../components/pagination";

const Task = () => {
  const navagation = useNavigate();
  const dispatch = useDispatch();

  const taskOpt = useSelector((state) => state.task);
  const user = JSON.parse(localStorage.getItem("user")).username;

  const [taskList, setTaskList] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [task, setTask] = useState({});
  const [editTask, setEditTask] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [searchVal, setSearchVal] = useState();
  const [setting, setSetting] = useState({
    totalPage: 1,
    currentPage: 1,
    pagePer: 5,
    keyword: "",
    statusOpt: [],
    pending: true,
    started: true,
    completed: true,
    date: "all"
  });

  const [filterBy, setFilterBy] = useState({
    pending: false,
    started: false,
    completed: false,
    date: "all"
  });

  const status = [
    { value: "pending", label: "Pending", color: "pink" },
    { value: "started", label: "Started", color: "orange" },
    { value: "completed", label: "Completed", color: "blue" }
  ];

  const handleOpen = () => {
    setEditTask();
    setIsEdit(false);
    setOpen(true);
  };
  const handleClose = () => {
    setFilterOpen(false);
    setOpen(false);
  };

  const handleFilterStatus = (event) => {
    const { name, checked } = event.target;
    setFilterBy({
      ...filterBy,
      [name]: checked
    });
  };

  const handleFilterDate = (event) => {
    setFilterBy({
      ...filterBy,
      date: event.target.id
    });
  };

  const filterTask = async () => {
    const items = await filterByTask(filterBy)(setting)(dispatch);
    setTaskList(items);
    setFilterOpen(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (isEdit) {
      setEditTask({ ...editTask, [id]: value });
    } else {
      setTask({ ...task, [id]: value, username: user });
    }
  };
  const handleChangeStatus = (value) => {
    if (isEdit) {
      setEditTask({ ...editTask, status: value });
    } else {
      setTask({ ...task, status: value });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navagation("/login");
  };

  const handleDeleteTask = async (id) => {
    const result = await removeTask(id)(setting)(dispatch);
    setTaskList(result.data);
    setOpen(false);
  };

  const handleEditTask = async (data) => {
    setIsEdit(true);
    setEditTask(data);
    setOpen(true);
  };

  const saveTask = async () => {
    if (isEdit) {
      const filteredData = Object.entries(editTask)
        .filter(([key, value]) => value === "")
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      if (Object.keys(filteredData).length === 0) {
        const result = await updateTask(editTask)(setting)(dispatch);
        setTaskList(result.data);
        setOpen(false);
      }
    } else {
      try {
        const result = await addTask(task)(setting)(dispatch);
        setTaskList(result.data);
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePagination = async (e, page) => {
    setSetting({ ...setting, currentPage: page });
    await fetchTask(setting)(dispatch);
  };
  const debouncedSearch = useDebounce(searchVal, 1000);

  const handleSearchChange = async (e) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    (async function () {
      const searchVal = {
        keyword: debouncedSearch,
        pagePer: setting.pagePer
      };

      if (!debouncedSearch) {
        const noKeyword = {
          totalPage: 1,
          currentPage: 1,
          pagePer: 5,
          keyword: ""
        };
        let result = await fetchTask(noKeyword)(dispatch);
        setTaskList(result.data);
      } else {
        let result = await searchTask(searchVal)(dispatch);
        setTaskList(result.data.items);
      }
    })();
  }, [debouncedSearch, dispatch, setting.pagePer]);

  useEffect(() => {
    (async function () {
      let result = await fetchTask(setting)(dispatch);
      setTaskList(result.data);
    })();
  }, [dispatch, setting]);

  useEffect(() => {
    setSetting((prevSetting) => ({
      ...prevSetting,
      totalPage: taskOpt.totalPage,
      currentPage: taskOpt.currentPage,
      pagePer: taskOpt.pagePer,
      keyword: taskOpt.keyword,
      pending: taskOpt.pending,
      started: taskOpt.started,
      completed: taskOpt.completed,
      date: taskOpt.date
    }));
  }, [
    taskOpt.totalPage,
    taskOpt.pagePer,
    taskOpt.currentPage,
    taskOpt.keyword,
    taskOpt.pending,
    taskOpt.started,
    taskOpt.completed,
    taskOpt.date
  ]);

  return (
    <div className="w-full min-h-screen bg-light-blue-100  flex flex-col items-center">
      <Navbar
        variant="gradient"
        color="indigo"
        className="sticky inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
          <Typography
            as={NavLink}
            href="#"
            variant="h6"
            className="mr-4 ml-2 cursor-pointer py-1.5"
          >
            Task
          </Typography>
          <Button
            variant="outlined"
            color="white"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Navbar>
      <div className="md:flex my-5 w-full px-4 md:px-0 md:w-9/12 gap-6 justify-between">
        <IconButton size="lg" className="rounded-full" onClick={handleOpen}>
          <PlusIcon className="h-6 w-6 transition-transform group-hover:rotate-45" />
        </IconButton>
        <div className="md:mt-0 mt-4 flex gap-3">
          <Input
            id="search-bar"
            className="text h-[3rem] border-purple-900"
            label="Seach..."
            color="purple"
            size="lg"
            variant="outlined"
            onChange={handleSearchChange}
          />
          <Chip
            value="Filter"
            variant="gradient"
            size="lg"
            className="cursor-pointer"
            onClick={() => setFilterOpen(true)}
            icon={<AdjustmentsVerticalIcon />}
          />
        </div>
      </div>
      {taskOpt.isLoading && (
        <CircularProgress className="my-auto" disableShrink />
      )}
      {taskOpt.error && (
        <p className="text-pink-800 h-3 my-auto">{taskOpt.error}</p>
      )}
      <AddModal
        open={open}
        isEdit={editTask}
        status={status}
        handleClose={handleClose}
        handleChange={handleChange}
        handleChangeStatus={handleChangeStatus}
        editTask={editTask}
        saveTask={saveTask}
      />
      <FilterModal
        open={filterOpen}
        status={status}
        handleClose={handleClose}
        handleFilterStatus={handleFilterStatus}
        handleFilterDate={handleFilterDate}
        filterTask={filterTask}
        filterBy={filterBy}
      />
      <Box className="w-full px-4 md:px-0 md:w-9/12">
        {taskList &&
          taskList.map((task, index) => (
            <Card key={index} className="md:flex-row w-full my-3">
              <Menu>
                <MenuHandler>
                  <IconButton
                    size="sm"
                    color="red"
                    variant="text"
                    className="!absolute top-3 right-4 rounded-full"
                  >
                    <Bars3Icon color="green" className="h-6 w-6" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="">
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleEditTask(
                        taskList.find((item) => item._id === task._id)
                      )
                    }
                  >
                    <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
                    <Typography variant="small" className="font-normal">
                      Edit
                    </Typography>
                  </MenuItem>
                  <hr className="my-2 border-blue-gray-50" />
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <TrashIcon strokeWidth={2} className="h-4 w-4" />
                    <Typography variant="small" className="font-normal">
                      Delete
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
              <CardHeader
                shadow={false}
                floated={false}
                className="w-full md:w-3/12 shrink-0 m-0 rounded-none rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              >
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                  alt="images"
                  className="object-cover h-full w-full"
                />
              </CardHeader>
              <CardBody className=" break-normal">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  {task.title}
                </Typography>
                <Typography
                  color="gray"
                  className="font-normal mb-8 overflow-y-auto"
                >
                  {task.description}
                </Typography>
                <div className="flex flex-col md:flex-row gap-3">
                  <Chip
                    color={status.find((s) => s.value === task.status).color}
                    value={task.status}
                  />
                  <Chip
                    value={task.username}
                    variant="outlined"
                    icon={<UserIcon />}
                  />
                  <Chip
                    value={moment(task.date).format("YYYY-MM-DD")}
                    variant="outlined"
                    icon={<CalendarDaysIcon />}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
      </Box>
      <Pagination setting={setting} handlePagination={handlePagination} />
    </div>
  );
};

export default Task;
