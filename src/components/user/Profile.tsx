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
import { format } from 'date-fns'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../main'
import { fetchAssessments } from '../../reducers/assessementListReducer'
import { fetchGradingAssessments } from '../../reducers/gradingAssessmentListReducer'
import { ButtonBox } from '../../theme/theme'
import { logError } from '../../utils/logger'

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const user = useSelector((state: RootState) => state.user)
    const assessments = useSelector((state: RootState) => state.assessmentList)
    const gradingAssessments = useSelector((state: RootState) => state.gradingAssessmentList)

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

    const StudentOngoingAssessment = () => {
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(false)

        const loadData = async () => {
            try {
                setLoading(true)
                if (!assessments) {
                    await dispatch(fetchAssessments())
                }
                setError(false) // Reset error state if fetch is successful
            } catch (err) {
                setError(true) // Set error state if fetching fails
                logError('Failed to fetch assessments:', err)
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => {
            loadData()
        }, [dispatch, assessments])

        if (loading) {
            return (
                <CardContent>
                    <Box display="flex" alignItems="center" color="primary.main">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h2" component="div">
                            Your Latest Assessments
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
                            Your Latest Assessments
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
                        Your Latest Assessments
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List>
                    {assessments ? (
                        assessments.map((assessment) => (
                            <Fragment key={assessment.assessmentId}>
                                <ListItem
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
                                            {`Submitted: ${format(
                                                new Date(assessment.assessmentSubmissionTime),
                                                'PPpp'
                                            )} | Graded: `}
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
                            </Fragment>
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
    const TeacherPendingGrading = () => {
        const [pendingCount, setPendingCount] = useState(0)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(false)

        const loadData = async () => {
            try {
                setLoading(true)
                if (!gradingAssessments) {
                    await dispatch(fetchGradingAssessments())
                }
                setError(false) // Reset error state if fetch is successful
            } catch (err) {
                /*
                 * The error does not come fromt the fetching operation itself.
                 * The problem is that it takes some time for the redux store to update the state
                 * with the fetched data, and in those split seconds, the data is still null and
                 * so the filter function throws an error.
                 */
                setError(true) // Set error state if fetching fails
                logError('Failed to fetch assessments:', err)
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => {
            loadData()
            const count =
                gradingAssessments?.filter(
                    (assessment) =>
                        assessment.assessmentSubmissionTime !== null && // Check that the assessment is submitted
                        !assessment.isAllTestsGradedByTeacher // Check that the assessment is not fully graded
                ).length ?? 0
            setPendingCount(count)
        }, [dispatch, gradingAssessments])

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
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/assessments-for-grading')}
                    >
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
                        {isStudent && StudentOngoingAssessment()}

                        {isTeacher && TeacherPendingGrading()}
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    )
}

export default Profile
