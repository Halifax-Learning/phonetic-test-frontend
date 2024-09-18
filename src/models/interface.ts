export interface User {
    accountId: string
    accountRole: string
    firstName: string
    lastName: string
    email: string
    currentEnrolledCourse: string
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
    testQuestionSubmissionTime: Date
}

export interface TestType {
    testTypeId: number
    questionType: QuestionType
    testTypeName: string
    numQuestions: number
    hasQuestionAudio: boolean
}

export interface Test {
    testId: string
    testType: TestType
    assessmentId: string
    testOrdinal: number
    isLastTest: boolean
    testQuestions: TestQuestion[]
    testSubmissionTime: Date
}

export interface AssessmentType {
    assessmentTypeId: number
    assessmentTypeName: string
}

export interface Assessment {
    assessmentId: string
    assessmentType: AssessmentType
    tests: Test[]
    assessmentSubmissionTime: Date
}
