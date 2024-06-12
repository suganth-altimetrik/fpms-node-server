var express = require("express");

const userController = require("./controllers/userController");
const investController = require("./controllers/investController");
const authUserMiddleware = require("./jwt.middleware");
var router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);

router.post("/invest/save", authUserMiddleware, investController.save);
router.get(
  "/invest/recent",
  authUserMiddleware,
  investController.get_recent_investments
);
router.get(
  "/invest/top",
  authUserMiddleware,
  investController.get_top_investments
);
router.get(
  "/invest/total",
  authUserMiddleware,
  investController.get_total_investments_summary
);
router.get(
  "/invest/trend",
  authUserMiddleware,
  investController.get_invest_trend
);

router.get("/dynamic-data-start", investController.dynamic_data);
router.get("/dynamic-data-stop", investController.dynamic_data_stop);

module.exports = router;
