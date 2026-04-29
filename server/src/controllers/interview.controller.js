// import { PDFParse } from 'pdf-parse'; // to parse the pdf file and extract text from it
// import pdfParse from 'pdf-parse';
// import { createRequire } from 'module';
import interviewReportModel from "../models/interviewReport.model.js";
import { generateInterviewReport, generateResumePdf } from "../services/ai.services.js";
// const require = createRequire(import.meta.url);
// const pdfParse = require('pdf-parse');
// const pdfParse = require('pdf-parse').default || require('pdf-parse');
// const pdfParseModule = require('pdf-parse');
// console.log("type:", typeof pdfParseModule);
// console.log("keys:", Object.keys(pdfParseModule));
// console.log("default type:", typeof pdfParseModule.default); error fixing with ai

// const { PDFParse } = require('pdf-parse');

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdfParse = require('../utils/pdfParser.cjs');
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
// import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const extractTextFromPdf = async (buffer) => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
}


export const generateInterviewReportController = async (req, res) => {
    // user will upload the resume in the form of a pdf file, so to handle file we need multer in the backend

    const resumeFile = req.file; // multer will add the file to the req object
    // const resumeContent = pdfParse(resumeFile.buffer);this line was throwing error  // we will get the content of the pdf file in the form of a string
    // const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText() //right out from docs
    // const resumeContent = await pdfParse(resumeFile.buffer) // ai suggested
    // const { text: resumeText } = await pdfParse(resumeFile.buffer)

    const resumeText = await extractTextFromPdf(resumeFile.buffer);

    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })


console.log("AI response:", JSON.stringify(interViewReportByAi, null, 2))
    
    // const interviewReport = await interviewReportModel.create({
    //     user: req.user.id,
    //     resume: resumeText,
    //     selfDescription,
    //     jobDescription,
    //     ...interViewReportByAi, // for technical ques all
    //     title: interViewReportByAi.jobTitle || interViewReportByAi.title

    // })
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
    
        title: interViewReportByAi.job_title || "MERN Developer",
        matchScore: interViewReportByAi.matchScore || 70,
    
        technicalQuestions: (interViewReportByAi.technical_questions || []).map(q => ({
            question: q,
            intention: "N/A",
            answer: "N/A"
        })),
    
        behavioralQuestions: (interViewReportByAi.behavioral_questions || []).map(q => ({
            question: q,
            intention: "N/A",
            answer: "N/A"
        })),
    
        skillGaps: (interViewReportByAi.skill_gaps || []).map(s => ({
            skill: s,
            severity: "medium"
        })),
    
        preparationPlan: (interViewReportByAi.preparation_plan || []).map((p, i) => ({
            day: i + 1,
            focus: "Preparation",
            tasks: [p]
        }))
    });

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}   

export const getInterviewReportByIdController = async (req, res) => {
    const {interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({message: "Interview report fetched successfully", interviewReport})
}

export const getAllInterviewReportsController = async (req, res) => {
    // const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({ createdAt: -1 })
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan") //only neeed the title

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export const generateResumePdfController = async (req, res) =>{
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}