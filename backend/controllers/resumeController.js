const pdfParse = require('pdf-parse');
const { parseResumeText } = require('../services/geminiService');

const uploadResumeAndParse = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 1. Extract text from PDF buffer
        const pdfData = await pdfParse(req.file.buffer);
        const text = pdfData.text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Could not extract text from the PDF. It might be an image-based PDF." });
        }

        // 2. Send text to Gemini
        const extractedData = await parseResumeText(text);

        res.status(200).json({
            message: "Resume parsed successfully",
            data: extractedData
        });

    } catch (error) {
        console.error("Resume Upload Error:", error);
        res.status(500).json({ error: "Failed to process resume summary", details: error.message });
    }
};

module.exports = {
    uploadResumeAndParse
};
