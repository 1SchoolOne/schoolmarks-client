import {
	AppstoreOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons'
import {
	Button,
	Col,
	Divider,
	Empty,
	Flex,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Table,
	TableProps,
	Tooltip,
	Typography,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { filterGrades } from '../hooks/gradeFilter'
import { useDeleteGrade } from '../hooks/useDeleteGrade'
import { GradeWithUser, useGradesData } from '../hooks/useGradesData'
import { TeacherCardGrade } from './TeacherCardGrade'

import './GradesTeacher-styles.less'

const { Text, Title } = Typography

// interface HandleGradeAction {
// 	(record: GradeWithUser): void
// }

export function GradesTeacher() {
	const navigate = useNavigate()
	const {
		grades,
		setGrades,
		loading,
		classes,
		error,
		fetchGradesData,
		fetchClassesAndCourses,
		teacherGrades,
		teacherCourses,
	} = useGradesData()

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
	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredGrades = useMemo(() => {
		if (!searchTerm) return teacherGrades

		const lowercaseSearch = searchTerm.toLowerCase()
		return teacherGrades.filter((grade) => {
			return (
				grade.courseName?.toLowerCase().includes(lowercaseSearch) ||
				grade.name.toLowerCase().includes(lowercaseSearch) ||
				grade.className?.toLowerCase().includes(lowercaseSearch)
			)
		})
	}, [teacherGrades, searchTerm])

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			await fetchGradesData()
			await fetchClassesAndCourses()
		}
		fetchData()
	}, [])

	const handleChange = async (value: string, type: keyof typeof filters): Promise<void> => {
		const newFilters = { ...filters, [type]: value }
		setFilters(newFilters)
		const filteredGrades = await filterGrades(newFilters)
		setGrades(filteredGrades)
	}

	const handleResetFilter = async (type: keyof typeof filters): Promise<void> => {
		const newFilters = { ...filters, [type]: '' }
		setFilters(newFilters)
		const filteredGrades = await filterGrades(newFilters)
		setGrades(filteredGrades)
	}

	const handleResetAllFilters = async (): Promise<void> => {
		setFilters({
			subject: '',
			class: '',
			month: '',
			year: '',
		})
		setSearchTerm('')
		const filteredGrades = await filterGrades({})
		setGrades(filteredGrades)
	}

	const handleEdit = (record: GradeWithUser) => {
		navigate(`/app/grades/edit?id=${record.id}`)
	}

	const columns: TableProps<GradeWithUser>['columns'] = [
		{
			title: 'Matière',
			dataIndex: 'courseName',
			key: 'courseName',
			render: (text) => <Text strong>{text}</Text>,
		},
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (date: string) => {
				if (!date) return '-'
				const d = new Date(date)
				return `${d.getDate()}/${d.getMonth() + 1}`
			},
		},
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
					<Input.Search
						placeholder="Rechercher une évaluation"
						className="grades-actions-search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onSearch={setSearchTerm}
					/>
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
								options={teacherCourses.map((course) => ({
									value: course.name,
									label: course.name,
								}))}
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

			{error && (
				<Text type="danger" style={{ padding: '16px', display: 'block' }}>
					{error}
				</Text>
			)}

			{loading ? (
				<Flex justify="center" align="center" style={{ padding: '40px' }}>
					<Spin size="large" tip="Chargement des évaluations..." />
				</Flex>
			) : filteredGrades.length === 0 ? (
				<Empty description="Aucune évaluation trouvée" style={{ padding: '40px' }} />
			) : viewMode === 'list' ? (
				<Table<GradeWithUser>
					columns={columns}
					dataSource={filteredGrades}
					loading={loading}
					rowKey="id"
					className="grades-table"
					pagination={filteredGrades.length > 10 ? { pageSize: 10 } : false}
				/>
			) : (
				<Row gutter={[24, 24]} style={{ padding: '8px', margin: 0 }} className="grades-card-grid">
					{filteredGrades.map((grade) => (
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
		</Flex>
	)
}
