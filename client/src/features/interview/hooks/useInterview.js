// 

import { useContext, useEffect } from "react"
import { useParams } from "react-router"
import { InterviewContext } from "../Interview.context"
import {
    generateInterviewReport,
    generateResumePdf,
    getAllInterviewReports,
    getInterviewReportById
} from "../services/interview.api.js"


// ─────────────────────────────────────────────
// 🔧 Formatters (FIX BACKEND RESPONSE)
// ─────────────────────────────────────────────

const formatQuestions = (arr = []) => {
    const result = []

    for (let i = 0; i < arr.length; i += 4) {
        result.push({
            question: arr[i + 1],
            intention: arr[i + 2],
            answer: arr[i + 2], // backend issue
            difficulty: arr[i + 3],
        })
    }

    return result
}

const formatSkillGaps = (arr = []) => {
    const result = []

    for (let i = 0; i < arr.length; i += 3) {
        result.push({
            skill: arr[i],
            severity: arr[i + 1],
            description: arr[i + 2],
        })
    }

    return result
}

const formatPreparationPlan = (arr = []) => {
    const result = []

    for (let i = 0; i < arr.length; i += 4) {
        result.push({
            day: arr[i],
            level: arr[i + 1],
            focus: arr[i + 2],
            tasks: [arr[i + 3]],
        })
    }

    return result
}


// ─────────────────────────────────────────────
// 🎯 Hook
// ─────────────────────────────────────────────

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context


    // ✅ GENERATE REPORT
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)

        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })

            const data = response.interviewReport

            const formattedReport = {
                ...data,
                technicalQuestions: formatQuestions(data.technicalQuestions),
                behavioralQuestions: formatQuestions(data.behavioralQuestions),
                skillGaps: formatSkillGaps(data.skillGaps),
                preparationPlan: formatPreparationPlan(data.preparationPlan),
            }

            setReport(formattedReport)
            return formattedReport

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }


    // ✅ GET SINGLE REPORT
    const getReportById = async (interviewId) => {
        setLoading(true)

        try {
            const response = await getInterviewReportById(interviewId)

            const data = response.interviewReport

            const formattedReport = {
                ...data,
                technicalQuestions: formatQuestions(data.technicalQuestions),
                behavioralQuestions: formatQuestions(data.behavioralQuestions),
                skillGaps: formatSkillGaps(data.skillGaps),
                preparationPlan: formatPreparationPlan(data.preparationPlan),
            }

            setReport(formattedReport)
            return formattedReport

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }


    // ✅ GET ALL REPORTS
    const getReports = async () => {
        setLoading(true)

        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports || [])
            return response.interviewReports || []

        } catch (error) {
            console.log(error)
            return []
        } finally {
            setLoading(false)
        }
    }


    // ✅ DOWNLOAD PDF
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)

        try {
            const response = await generateResumePdf({ interviewReportId })

            const url = window.URL.createObjectURL(
                new Blob([response], { type: "application/pdf" })
            )

            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }


    // ✅ AUTO FETCH
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }
}