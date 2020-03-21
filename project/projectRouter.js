const express = require("express");
const Project = require("./projectModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Project.get()
    .then(projectData => {
      res.status(200).json(projectData);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Getting Project Data", err });
    });
}); // Tested | Success: Working | Errors: Working

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.gotProject);
}); // Tested | Success: Working | Errors: Working

router.post("/", validateProject, (req, res) => {
  Project.insert(req.body)
    .then(projectData => {
      res.status(201).json({ message: "Created New Project", projectData });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Creating Project", err });
    });
}); // Tested | Success: Working | Errors: Working

router.put("/:id", validateProjectId, validateProject, (req, res) => {
  Project.update(req.gotProject.id, req.body)
    .then(projectData => {
      res.status(201).json({ message: "Updated Project", projectData });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Updating Project", err });
    });
}); // Tested | Success: Working | Errors: Working

router.delete("/:id", validateProjectId, (req, res) => {
  const { id } = req.gotProject;
  Project.remove(id)
    .then(projectData => {
      res
        .status(201)
        .json({
          message: `Removed Project ID ${id}. Removed ${projectData} Record(s).`
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Error Removing Project Data", err });
    });
}); // Tested | Success: Working | Errors: Working

function validateProjectId(req, res, next) {
  const { id } = req.params;
  Project.get(id)
    .then(projectData => {
      if (projectData) {
        req.gotProject = projectData;
        console.log("Logging from validateProjectId:", projectData);
        next();
      } else {
        res.status(400).json({ message: "Invalid Project ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error Getting Project Data", err });
    });
} // Tested | Success: Working | Errors: Working

function validateProject(req, res, next) {
  const projectData = req.body;
  if (!projectData || projectData === {}) {
    res.status(400).json({ errorMessage: "Missing Project Data", projectData });
  } else if (!projectData.name || !projectData.description) {
    res
      .status(400)
      .json({ errorMessage: "missing required fields", projectData });
  } else {
    console.log(
      "Logging from validateProject: Validation Success:",
      projectData
    );
    next();
  }
} // Tested | Success: Working | Errors: Working

module.exports = router;
