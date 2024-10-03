export interface User {
    accountId: string
    accountRole: string
    firstName: string
    lastName: string
    email: string
    currentEnrolledCourse: string
    token: string
}

export interface QuestionType {
    questionTypeId: number
    questionTypeName: string
    questionInstructionText: string
    instructionAudioBlobUrl: string
}

export interface Question {
    questionId: number
    questionType: QuestionType
    questionText: string
    questionAudioBlobUrl: string
    correctAnswerText: string
    correctAnswerAudioBlobUrl: string
}

export interface TestQuestion {
    testQuestionId: string
    question: Question
    questionOrdinal: number
    isLastQuestion: boolean
    answerText: string
    answerAudioBlobUrl: string
    hasAnswerAudio: boolean // if the answer in the question has audio
    latestAutoEvaluation: number
    latestTeacherEvaluation: boolean
    originalTeacherEvaluation: boolean // to keep track if the teacher evaluation has been changed
    latestTeacherComment: string
    testQuestionSubmissionTime: Date
    autoGradingHistory: AutoGradingHistory[]
    teacherGradingHistory: TeacherGradingHistory[]
}

export interface TestType {
    testTypeId: number
    questionType: QuestionType
    testTypeName: string
    numQuestions: number
    hasQuestionAudio: boolean // if the questions in the test have audio
    hasCorrectAnswerAudio: boolean // if the correct answers of the questions in the test have audio
}

export interface Test {
    testId: string
    testType: TestType
    assessmentId: string
    testOrdinal: number
    isLastTest: boolean
    testSubmissionTime: Date
    autoScore: number
    teacherScore: number
    testQuestions: TestQuestion[]
    numQuestionsGraded: number
    hasFetchedAudio: boolean // if all the audio files associated with the test question have been fetched
}

export interface AssessmentType {
    assessmentTypeId: number
    assessmentTypeName: string
}

export interface Assessment {
    assessmentId: string
    assessmentType: AssessmentType
    testTaker: User
    tests: Test[]
    assessmentSubmissionTime: Date
    isAllTestsGradedByTeacher: boolean // if all the tests in the assessment have been graded by the teacher
}

export interface AutoGradingHistory {
    autoGradingHistoryId: string
    modelVersion: string
    autoEvaluation: number
    createdAt: Date
}

export interface TeacherGradingHistory {
    teacherGradingHistoryId: string
    teacherAccount: User
    teacherEvaluation: boolean
    teacherComment: string
    createdAt: string
}

export interface ExportTestQuestion {
    testQuestionId: string
    question: Question
    questionOrdinal: number
    isLastQuestion: boolean
    answerText: string
    answerAudioBlobUrl: string
    hasAnswerAudio: boolean
    latestAutoEvaluation: number
    latestTeacherEvaluation: boolean
    originalTeacherEvaluation: boolean
    latestTeacherComment: string
    testQuestionSubmissionTime: Date
    autoGradingHistory: AutoGradingHistory[]
    teacherGradingHistory: TeacherGradingHistory[]
    questionTypeName: string
}
