const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

const { uploadResumeAndParse } = require('../controllers/resumeController');
const { analyzeGitHubAndGenerateScore } = require('../controllers/githubController');

// Resume Upload & Parse using Gemini
router.post('/analyze/resume', upload.single('resume'), uploadResumeAndParse);

// GitHub Analysis & Final Score Calculation
router.post('/analyze/github', analyzeGitHubAndGenerateScore);

module.exports = router;
