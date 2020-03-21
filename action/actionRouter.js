const express = require("express");
const Action = require("./actionModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Action.get()
    .then(actionData => {
      res.status(200).json(actionData);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Getting Action Data", err });
    });
}); // Tested | Success: Working | Errors: Working

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.gotAction);
}); // Tested | Success: Working | Errors: Working

router.post("/", validateAction, (req, res) => {
  Action.insert(req.body)
    .then(actionData => {
      res.status(201).json({ message: "Created New Action", actionData });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Creating Action", err });
    });
}); // Tested | Success: Working | Errors: Working

router.put("/:id", validateActionId, validateAction, (req, res) => {
    Action.update(req.gotAction.id, req.body)
        .then(actionData => {
            res.status(201).json({ message: "Updated Action", actionData });
        })
        .catch(err => {
          res.status(500).json({ errorMessage: "Error Updating Action", err });
        });
});// Tested | Success: Working | Errors: Working

router.delete("/:id", validateActionId, (req, res) => {
  const { id } = req.gotAction;
  Action.remove(id)
    .then(actionData => {
      res.status(201).json({ message: `Removed Action ID ${id}` });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Removing Action Data", err });
    });
}); // Tested | Success: Working | Errors: Working

function validateActionId(req, res, next) {
  const { id } = req.params;
  Action.get(id)
    .then(actionData => {
      if (actionData) {
        req.gotAction = actionData;
        console.log("Logging from validateActionId:", actionData);
        next();
      } else {
        res.status(400).json({ message: "Invalid Action ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Getting Action Data", err });
    });
} // Tested | Success: Working | Errors: Working

function validateAction(req, res, next) {
  const actionData = req.body;
  if (!actionData || actionData === {}) {
    res.status(400).json({ errorMessage: "missing action data", actionData });
  } else if (
    !actionData.project_id ||
    !actionData.description ||
    !actionData.notes
  ) {
    res
      .status(400)
      .json({ errorMessage: "missing required fields", actionData });
  } else if (req.body.description.length > 128) {
    res.status(400).json({
      errorMessage: "description is longer than 128 characters",
      actionData
    });
  } else {
    console.log("Logging from validateAction: Validation Success:", actionData);
    next();
  }
} // Tested | Success: Working | Errors: Working

module.exports = router;
