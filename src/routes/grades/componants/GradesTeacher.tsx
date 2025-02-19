import {
	AppstoreOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons'
import {
	Button,
	Card,
	Col,
	Divider,
	Flex,
	Input,
	Row,
	Select,
	Space,
	Table,
	TableProps,
	Tooltip,
	Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { filterGrades } from '../hooks/gradeFilter'
import { useDeleteGrade } from '../hooks/useDeleteGrade'
import { GradeWithUser, useGradesData } from '../hooks/useGradesData'
import { TeacherCardGrade } from './TeacherCardGrade'

import './GradesTeacher-styles.less'

const { Text, Title } = Typography

export function GradesTeacher() {
	const navigate = useNavigate()
	const { grades, setGrades, loading, courses, classes, fetchGradesData, fetchClassesAndCourses } =
		useGradesData()

	const { handleDelete } = useDeleteGrade({
		onSuccess: fetchGradesData,
	})

	const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
	const [filters, setFilters] = useState({
		subject: '',
		class: '',
		month: '',
		year: '',
	})

	useEffect(() => {
		const fetchData = async () => {
			await fetchGradesData()
			await fetchClassesAndCourses()
			const initialGrades = await filterGrades({})
			setGrades(initialGrades)
		}
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChange = async (value: string, type: keyof typeof filters) => {
		const newFilters = { ...filters, [type]: value }
		setFilters(newFilters)
		const filteredGrades = await filterGrades(newFilters)
		setGrades(filteredGrades)
	}

	const handleResetFilter = async (type: keyof typeof filters) => {
		const newFilters = { ...filters, [type]: '' }
		setFilters(newFilters)
		const filteredGrades = await filterGrades(newFilters)
		setGrades(filteredGrades)
	}

	const handleResetAllFilters = async () => {
		setFilters({
			subject: '',
			class: '',
			month: '',
			year: '',
		})
		const filteredGrades = await filterGrades({})
		setGrades(filteredGrades)
	}

	const handleEdit = (record: GradeWithUser) => {
		navigate(`/app/grades/edit?id=${record.id}`)
	}

	const columns: TableProps<GradeWithUser>['columns'] = [
		{ title: 'Matière', dataIndex: 'courseName', key: 'courseName' },
		{
			title: 'Classe',
			dataIndex: 'className',
			key: 'className',
			render: (text) => text || 'Classe inconnue',
		},
		{
			title: 'Coefficient',
			dataIndex: 'coef',
			key: 'coef',
			render: (coef) => parseInt(coef, 10) || 1,
		},
		{
			title: 'Note -',
			key: 'lowestGrade',
			render: (_, record) => {
				const numericGrades = record.studentGrades?.map((g) => Number(g.value)) || []
				return numericGrades.length ? Math.min(...numericGrades) : '-'
			},
		},
		{
			title: 'Moy. classe',
			key: 'averageGrade',
			render: (_, record) => {
				const numericGrades = record.studentGrades?.map((g) => Number(g.value)) || []
				const averageGrade = numericGrades.length
					? numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length
					: 0
				return numericGrades.length ? Math.round(averageGrade * 10) / 10 : '-'
			},
		},
		{
			title: 'Note +',
			key: 'highestGrade',
			render: (_, record) => {
				const numericGrades = record.studentGrades?.map((g) => Number(g.value)) || []
				return numericGrades.length ? Math.max(...numericGrades) : '-'
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 120,
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title="Modifier l'évaluation">
						<Button
							type="text"
							icon={<EditOutlined className="action-edit" />}
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Tooltip title="Supprimer l'évaluation">
						<Button
							type="text"
							icon={<DeleteOutlined className="action-delete" />}
							onClick={() => handleDelete(record)}
						/>
					</Tooltip>
				</Space>
			),
		},
	]

	// const filterGradesByUserRole = (grade: GradeWithUser) => {
	// 	if (userSession?.role === 'teacher') {
	// 		// Nouvelle logique: vérifier directement les cours assignés à ce professeur
	// 		const teacherCourses = courses.filter((course) => course.professor?.id === userSession.id)
	// 		const teacherCourseIds = teacherCourses.map((course) => course.id)

	// 		// Vérifier si le grade.course est dans la liste des IDs de cours de l'enseignant
	// 		return teacherCourseIds.includes(grade.course)
	// 	}

	// 	return true
	// }

	return (
		<Flex vertical>
			<Row>
				<Col>
					<Text type="secondary">
						Accéder rapidement à vos évaluations et suivez la progression de vos étudiants
					</Text>
				</Col>
			</Row>

			<Flex className="grades-actions" justify="space-between" align="center">
				<Space>
					<Input.Search placeholder="Rechercher une évaluation" className="grades-actions-search" />
					<Button type="primary" onClick={() => navigate('/app/grades/new')}>
						Créer une évaluation
					</Button>
				</Space>
				<Button.Group>
					<Button
						type={viewMode === 'list' ? 'primary' : 'default'}
						icon={<UnorderedListOutlined />}
						onClick={() => setViewMode('list')}
					>
						Liste
					</Button>
					<Button
						type={viewMode === 'card' ? 'primary' : 'default'}
						icon={<AppstoreOutlined />}
						onClick={() => setViewMode('card')}
					>
						Cartes
					</Button>
				</Button.Group>
			</Flex>

			<Card className="filters-container" bordered={false}>
				<Flex align="center" justify="center">
					<Flex className="filter-group" align="center">
						<Flex vertical align="center" className="filter-group-item">
							<Title level={5}>Matière</Title>
							<Flex align="center" className="filter-group-item-controls">
								<Select
									className="filter-select"
									placeholder="Matière"
									onChange={(value) => handleChange(value, 'subject')}
									value={filters.subject}
									options={courses.map((course) => ({ value: course.name, label: course.name }))}
								/>
								<Button
									type="text"
									icon={<CloseCircleOutlined className="filter-reset-icon" />}
									onClick={() => handleResetFilter('subject')}
								/>
							</Flex>
						</Flex>

						<Divider type="vertical" className="filter-divider" />

						<Flex vertical align="center" className="filter-group-item">
							<Title level={5}>Classe</Title>
							<Flex align="center" className="filter-group-item-controls">
								<Select
									className="filter-select"
									placeholder="Classe"
									onChange={(value) => handleChange(value, 'class')}
									value={filters.class}
									options={classes.map((classe) => ({ value: classe.name, label: classe.name }))}
								/>
								<Button
									type="text"
									icon={<CloseCircleOutlined className="filter-reset-icon" />}
									onClick={() => handleResetFilter('class')}
								/>
							</Flex>
						</Flex>

						<Divider type="vertical" className="filter-divider" />

						<Flex vertical align="center" className="filter-group-item">
							<Title level={5}>Mois</Title>
							<Flex align="center" className="filter-group-item-controls">
								<Select
									className="filter-select"
									placeholder="Mois"
									onChange={(value) => handleChange(value, 'month')}
									value={filters.month}
									options={[
										{ value: 'Janvier', label: 'Janvier' },
										{ value: 'Février', label: 'Février' },
										{ value: 'Mars', label: 'Mars' },
										{ value: 'Avril', label: 'Avril' },
										{ value: 'Mai', label: 'Mai' },
										{ value: 'Juin', label: 'Juin' },
										{ value: 'Juillet', label: 'Juillet' },
										{ value: 'Aout', label: 'Aout' },
										{ value: 'Septembre', label: 'Septembre' },
										{ value: 'Octobre', label: 'Octobre' },
										{ value: 'Novembre', label: 'Novembre' },
										{ value: 'Décembre', label: 'Décembre' },
									]}
								/>
								<Button
									type="text"
									icon={<CloseCircleOutlined className="filter-reset-icon" />}
									onClick={() => handleResetFilter('month')}
								/>
							</Flex>
						</Flex>

						<Divider type="vertical" className="filter-divider" />

						<Flex vertical align="center" className="filter-group-item">
							<Title level={5}>Année</Title>
							<Flex align="center" className="filter-group-item-controls">
								<Select
									className="filter-select"
									placeholder="Année"
									onChange={(value) => handleChange(value, 'year')}
									value={filters.year}
									options={Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => {
										const year = (2020 + i).toString()
										return { value: year, label: year }
									})}
								/>
								<Button
									type="text"
									icon={<CloseCircleOutlined className="filter-reset-icon" />}
									onClick={() => handleResetFilter('year')}
								/>
							</Flex>
						</Flex>
					</Flex>

					<Divider type="vertical" className="filter-divider" />

					<Flex vertical align="flex-end" justify="flex-end" className="filter-reset-all-container">
						<Button type="primary" onClick={handleResetAllFilters} className="filter-reset-all">
							Réinitialiser tous les filtres
						</Button>
					</Flex>
				</Flex>
			</Card>

			<Card className="grades-content" bordered={false}>
				{viewMode === 'list' ? (
					<Table<GradeWithUser>
						columns={columns}
						dataSource={grades} // Les grades sont déjà filtrés lors du chargement
						loading={loading}
						rowKey="id"
						className="grades-table"
						pagination={false}
					/>
				) : (
					<Row gutter={[24, 24]} style={{ padding: '8px', margin: 0 }} className="grades-card-grid">
						{grades.map((grade) => (
							<Col xs={24} sm={12} md={8} xl={6} key={grade.id}>
								<TeacherCardGrade
									grade={grade}
									grades={grades}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							</Col>
						))}
					</Row>
				)}
			</Card>
		</Flex>
	)
}
