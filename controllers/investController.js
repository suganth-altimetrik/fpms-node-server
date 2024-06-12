var ObjectId = require("mongodb").ObjectId;
var Invest = require("../models/investModel");

exports.save = [
  async (req, res) => {
    const { body } = req;

    const { asset_type, quantity, purchase_price, date, user_id } = body;

    try {
      if (!req.body) {
        res.status(400).json({ error: "Body not specified" });
        return;
      }

      const invest = new Invest({
        asset_type,
        quantity,
        purchase_price,
        date,
        user_id,
      });

      const data = await invest.save();

      res.status(201).json({
        response_msg: "Investment Saved Successfully",
        data: data,
      });
    } catch (err) {
      console.log("🚀 ~ file: create user ", err);
      return res.status(500).json({ error: "something went wrong" });
    }
  },
];

exports.get_recent_investments = [
  async (req, res) => {
    try {
      const { user_id } = req;

      var getInvest = await Invest.find({ user_id })
        .sort({ date: -1 })
        .limit(5);

      res.status(200).send({
        data: getInvest,
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];

exports.get_top_investments = [
  async (req, res) => {
    try {
      const { user_id } = req;

      var getInvest = await Invest.find({ user_id })
        .sort({ purchase_price: -1 })
        .limit(4);

      res.status(200).send({
        data: getInvest,
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];

exports.get_invest_trend = [
  async (req, res) => {
    try {
      const { user_id } = req;

      var getInvest = await Invest.aggregate([
        {
          $match: { user_id: new ObjectId(user_id) },
        },
        {
          $project: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            purchase_price: "$purchase_price",
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            total: {
              $sum: "$purchase_price",
            },
          },
        },
        {
          $project: {
            _id: false,
            month: "$_id.month",
            year: "$_id.year",
            value: "$total",
          },
        },
        {
          $match: {
            year: 2024,
          },
        },
        {
          $project: {
            month: "$month",
            value: "$value",
          },
        },
      ]).exec();

      res.status(200).send({
        data: getInvest,
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];

exports.get_total_investments_summary = [
  async (req, res) => {
    try {
      const { user_id } = req;

      var getInvestTotal = await Invest.aggregate([
        {
          $match: { user_id: new ObjectId(user_id) },
        },
        {
          $group: {
            _id: "$user_id",
            total: {
              $sum: "$purchase_price",
            },
          },
        },
      ]).exec();

      var start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = new Date();
      end.setHours(23, 59, 59, 999);

      var getInvestToday = await Invest.aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: "$user_id",
            total: {
              $sum: "$purchase_price",
            },
          },
        },
      ]).exec();

      var getInvestWeek = await Invest.aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
            date: {
              $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$user_id",
            total: {
              $sum: "$purchase_price",
            },
          },
        },
      ]).exec();

      var getInvestMonth = await Invest.aggregate([
        {
          $match: {
            user_id: new ObjectId(user_id),
            date: {
              $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: "$user_id",
            total: {
              $sum: "$purchase_price",
            },
          },
        },
      ]).exec();

      res.status(200).send({
        total: getInvestTotal[0].total,
        today: getInvestToday[0]?.total ? getInvestToday[0]?.total : 0,
        week: getInvestWeek[0].total,
        month: getInvestMonth[0].total,
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];

// var interval;

exports.dynamic_data = [
  async (req, res) => {
    try {
      var interval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 1000 + 1);
        global.io.to("admin").emit("dymaic_table", randomNumber);
      }, 100);

      res.status(200).send({
        data: "interval.id",
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];

exports.dynamic_data_stop = [
  async (req, res) => {
    try {
      // clearInterval(interval);

      res.status(200).send({
        data: "socket stopped",
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "ER500" });
    }
  },
];
