const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Register a new instructor account
// router.post("/register", async (req, res, next) => {
//   try {
//     const {
//       rows: [instructor],
//     } = await db.query(
//       "INSERT INTO instructor (username, password) VALUES ($1, $2) RETURNING *",
//       [req.body.username, req.body.password]
//     );

//     // Create a token with the instructor id
//     const token = jwt.sign({ id: instructor.id }, process.env.JWT);

//     res.status(201).send({ token });
//   } catch (error) {
//     next(error);
//   }
// });
router.post("/register", async (req, res, next) => {
  try {
    const instructor = await prisma.instructor.create({
      data: {
        username: req.body.username,
        password: req.body.password, // Ideally, hash this password before storing
      },
    });

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing instructor account
// router.post("/login", async (req, res, next) => {
//   try {
//     const {
//       rows: [instructor],
//     } = await db.query(
//       "SELECT * FROM instructor WHERE username = $1 AND password = $2",
//       [req.body.username, req.body.password]
//     );

//     if (!instructor) {
//       return res.status(401).send("Invalid login credentials.");
//     }

//     // Create a token with the instructor id
//     const token = jwt.sign({ id: instructor.id }, process.env.JWT);

//     res.send({ token });
//   } catch (error) {
//     next(error);
//   }
// });
router.post("/login", async (req, res, next) => {
  try {
    const instructor = await prisma.instructor.findFirst({
      where: {
        username: req.body.username,
        password: req.body.password, // Ideally, verify hashed password
      },
    });

    if (!instructor) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
// router.get("/me", async (req, res, next) => {
//   try {
//     const {
//       rows: [instructor],
//     } = await db.query("SELECT * FROM instructor WHERE id = $1", [
//       req.user?.id,
//     ]);

//     res.send(instructor);
//   } catch (error) {
//     next(error);
//   }
// });

//prisma refactored..

router.get("/me", async (req, res, next) => {
  // console.log('/me route');

  try {
    console.log("/me req.user: ", req.user);

    const instructor = await prisma.instructor.findUnique({
      where: { id: req.user?.id ?? 0 }, // Ensure ID is a valid integer
    });

    res.send(instructor);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
