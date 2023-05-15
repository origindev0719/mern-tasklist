const Task = require("../models/task.model");

export const getTask = async (req, res) => {
  const currentPageInt = parseInt(req.query.currentPage);
  const pagePerInt = parseInt(req.query.pagePer);
  const keyword = req.query.keyword;
  const skip = (currentPageInt - 1) * pagePerInt;
  const { started, completed, pending, date } = req.query;
  const statusValues = {
    started,
    completed,
    pending,
  };
  const activeFilters = Object.keys(statusValues).filter(
    (statusKey) => statusValues[statusKey] === "true"
  );

  const filterCondition = filterData(
    currentPageInt,
    pagePerInt,
    date,
    activeFilters
  );

  const conditions = filterCondition.conditions;
  const query = Task.find(conditions);
  query.or([
    { title: { $regex: keyword, $options: "i" } },
    { description: { $regex: keyword, $options: "i" } },
  ]);

  const items = await query.skip(skip).limit(pagePerInt);
  const countQuery = Task.countDocuments({
    $and: [
      conditions,
      {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      },
    ],
  });

  const [count] = await Promise.all([countQuery]);

  try {
    res.json({
      taskList: items,
      totalPage: count,
      currentPage: currentPageInt,
      pagePer: pagePerInt,
      keyword: keyword,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createTask = async (req, res) => {
  const task = new Task(req.body.data);
  try {
    const createTask = await task.save();
    res.json({ result: "success" });
  } catch (error) {
    console.log("error", error);
  }
};

export const updateTask = async (req, res) => {
  await Task.update(
    { _id: req.body._id },
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        date: req.body.date,
      },
    }
  );

  let task = await Task.findOne({ id: req.body._id });
  if (task) {
    Task.find(function (err, tasks) {
      res.json(tasks);
    });
  } else {
    res.status(422).send("Task add failed");
  }
};

export const removeTask = (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  Task.findByIdAndRemove(req.params.id, async (err, doc) => {
    if (!err) {
      const items = await Task.find().skip(skip).limit(limit);
      const totalItems = await Task.countDocuments();
      res.json({ totalItems: totalItems, items: items });
    } else {
      console.log(err);
    }
  });
};

export const searchTask = async (res, req) => {
  if (res.body.keyword) {
    const keyword = res.body.keyword;
    const pagePer = res.body.pagePer;
    const currentPage = 1;
    const skip = (currentPage - 1) * pagePer;

    const conditions = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const totalPages = await Task.find(conditions).countDocuments();
    const result = await Task.find(conditions).limit(pagePer).skip(skip);
    req.json({ items: result, totalPages: totalPages });
  }
};

export const filterTask = async (res, req) => {
  const { filterBy, setting } = res.body;
  const currentPage = 1;
  const pagePer = setting.pagePer;

  delete filterBy.date;
  const activeFilters = Object.keys(filterBy).filter((key) => filterBy[key]);

  const condition = filterData(
    currentPage,
    pagePer,
    filterBy.date,
    activeFilters
  );

  const result = await Task.find(condition.conditions)
    .limit(pagePer)
    .skip(condition.skip);
  const totalPage = await Task.find(condition.conditions).countDocuments();
  req.json({
    result: result,
    totalPage: totalPage,
    currentPage: currentPage,
  });
};

export const filterData = (currentPage, pagePer, date, activeFilters) => {
  const skip = (currentPage - 1) * pagePer;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const conditions = {};
  if (activeFilters.length > 0) {
    conditions.status = { $in: activeFilters };
  }
  if (date === "today") {
    conditions.date = { $gte: new Date(today), $lt: new Date(tomorrow) };
  } else if (date === "week") {
    conditions.date = { $gte: oneWeekAgo };
  } else if (date === "month") {
    conditions.date = { $gte: new Date(oneMonthAgo) };
  }

  return {
    conditions: conditions,
    skip: skip,
  };
};
