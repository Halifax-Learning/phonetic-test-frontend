import AssessmentIcon from '@mui/icons-material/Assessment'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PersonIcon from '@mui/icons-material/Person'
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../main'
import { Assessment } from '../../models/interface'
import { fetchAssessments } from '../../reducers/assessmentListReducer'
import { resetAssessment } from '../../reducers/assessmentReducer'
import { ButtonBox } from '../../theme/theme'

const Profile = () => {
    const dispatch = useDispatch<any>()
    const user = useSelector((state: RootState) => state.user)
    const assessments = useSelector((state: RootState) => state.assessmentList as Assessment[])

    const isTeacher = user?.accountRole === 'teacher'
    const isStudent = user?.accountRole === 'student'

    const [editableUser, setEditableUser] = useState({ ...user })
    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target
        setEditableUser((prev) => ({ ...prev, [name]: value }))
    }

    const toggleEdit = () => {
        setIsEditing((prev) => !prev)
    }

    const renderStudentOngoingAssessment = () => {
        const [studentAssessments, setStudentAssessments] = useState<Assessment[]>([])
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(false)
        const loadData = async () => {
            try {
                setLoading(true)
                await dispatch(fetchAssessments())
                dispatch(resetAssessment())
                setError(false) // Reset error state if fetch is successful

                const filteredAssessments = assessments
                    .filter(
                        (assessment) =>
                            assessment.testTaker.accountId === user?.accountId && // Show assessments done by the student
                            assessment.assessmentSubmissionTime !== null
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.assessmentSubmissionTime).getTime() -
                            new Date(a.assessmentSubmissionTime).getTime() // Sort by submission time (latest first)
                    )
                    .slice(0, 3) // Get the latest 3 assessments

                setStudentAssessments(filteredAssessments)
            } catch (err) {
                setError(true) // Set error state if fetching fails
            } finally {
                setLoading(false)
            }
        }
        useEffect(() => {
            loadData()
        }, [dispatch])

        if (loading) {
            return (
                <CardContent>
                    <Box display="flex" alignItems="center" color="primary.main">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h2" component="div">
                            Your Latest 3 Assessments
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </CardContent>
            )
        }

        if (error) {
            return (
                <CardContent>
                    <Box display="flex" alignItems="center" color="primary.main">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h2" component="div">
                            Your Latest 3 Assessments
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Typography variant="body1" color="error">
                            Failed to load assessments. Please try again.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={loadData} // Retry fetching data
                            sx={{ mt: 2 }}
                        >
                            Retry
                        </Button>
                    </Box>
                </CardContent>
            )
        }

        return (
            <CardContent>
                <Box display="flex" alignItems="center" color="primary.main">
                    <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h2" component="div">
                        Your Latest 3 Assessments
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List>
                    {studentAssessments.length > 0 ? (
                        studentAssessments.map((assessment) => (
                            <>
                                <ListItem
                                    key={assessment.assessmentId}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        color: 'secondary.main',
                                    }}
                                >
                                    <ListItemIcon>
                                        <AssessmentIcon sx={{ color: 'secondary.main' }} />
                                    </ListItemIcon>
                                    <Box flexGrow={1}>
                                        <Typography variant="subtitle1">
                                            {assessment.assessmentType.assessmentTypeName}
                                        </Typography>
                                        <Typography variant="caption" color="text.primary">
                                            {`Submitted: ${new Date(assessment.assessmentSubmissionTime).toLocaleDateString()} | Graded: `}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="span"
                                            sx={{
                                                color: assessment.isAllTestsGradedByTeacher
                                                    ? 'green'
                                                    : 'red',
                                            }}
                                        >
                                            {assessment.isAllTestsGradedByTeacher ? 'Yes' : 'No'}
                                        </Typography>
                                        <Typography variant="body2"></Typography>
                                    </Box>
                                    <Chip label="View" color="primary" sx={{ ml: 2 }} />
                                </ListItem>
                                <Divider sx={{ m: 2 }} />
                            </>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No assessments submitted.
                        </Typography>
                    )}
                </List>
            </CardContent>
        )
    }

    // Show list of assessments
    const renderTeacherPendingGrading = () => {
        const [pendingCount, setPendingCount] = useState(0)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(false)

        const loadData = async () => {
            try {
                setLoading(true)
                await dispatch(fetchAssessments())
                dispatch(resetAssessment())
                setError(false) // Reset error state if fetch is successful
                const count = assessments.filter(
                    (assessment) =>
                        assessment.assessmentSubmissionTime !== null && // Check that the assessment is submitted
                        !assessment.isAllTestsGradedByTeacher // Check that the assessment is not fully graded
                ).length
                setPendingCount(count)
            } catch (err) {
                setError(true) // Set error state if fetching fails
            } finally {
                setLoading(false)
            }
        }
        useEffect(() => {
            loadData()
        }, [dispatch])

        if (loading) {
            return (
                <CardContent>
                    <Box display="flex" alignItems="center" color="primary.main">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h2" component="div">
                            Pending Assessments
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </CardContent>
            )
        }

        if (error) {
            return (
                <CardContent>
                    <Box display="flex" alignItems="center" color="primary.main">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h2" component="div">
                            Pending Assessments
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Typography variant="body1" color="error">
                            Failed to load assessments. Please try again.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={loadData} // Retry fetching data
                            sx={{ mt: 2 }}
                        >
                            Retry
                        </Button>
                    </Box>
                </CardContent>
            )
        }

        return (
            <CardContent>
                <Box display="flex" alignItems="center" color="primary.main">
                    <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h2" component="div">
                        Pending Assessments
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box flexGrow={1}>
                    <Typography variant="body1">
                        You have <strong>{pendingCount}</strong> assessments waiting for marking.
                    </Typography>
                </Box>
                <ButtonBox>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        View Assessments
                    </Button>
                </ButtonBox>
            </CardContent>
        )
    }

    interface ProfileFieldProps {
        label: string
        name: string
        value: string
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
        disabled: boolean
    }

    const ProfileField = ({ label, name, value, onChange, disabled }: ProfileFieldProps) => (
        <Box mb={2} display="flex" flexDirection="column">
            <Typography variant="subtitle1" color="secondary.main">
                {label}
            </Typography>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                size="small"
                sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'text.secondary', // Change border color
                        },
                        '&:hover fieldset': {
                            borderColor: 'primary.main', // Change border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main', // Change border color on focus
                        },
                    },
                }}
                slotProps={{
                    input: {
                        // startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
                        style: { height: '40px', fontSize: '0.875rem' },
                    },
                }}
            />
        </Box>
    )

    return (
        <Box sx={{ padding: 4 }}>
            {/* User Profile Section */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h1">
                    Welcome, {user?.firstName} {user?.lastName}!
                </Typography>
            </Box>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" color="primary.main">
                                <PersonIcon sx={{ fontSize: 40, mr: 1 }} />
                                <Typography variant="h2" component="div">
                                    User Profile
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <ProfileField
                                label="First Name"
                                name="firstName"
                                value={editableUser.firstName || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <ProfileField
                                label="Last Name"
                                name="lastName"
                                value={editableUser.lastName || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <ProfileField
                                label="Role"
                                name="accountRole"
                                value={editableUser.accountRole || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <ProfileField
                                label="Email"
                                name="email"
                                value={editableUser.email || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            {isStudent && (
                                <ProfileField
                                    label="Course Enrolled"
                                    name="currentEnrolledCourse"
                                    value={editableUser.currentEnrolledCourse || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            )}
                            <ButtonBox>
                                <Button variant="contained" onClick={toggleEdit}>
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </Button>
                            </ButtonBox>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        {isStudent && renderStudentOngoingAssessment()}

                        {isTeacher && renderTeacherPendingGrading()}
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    )
}

export default Profile
