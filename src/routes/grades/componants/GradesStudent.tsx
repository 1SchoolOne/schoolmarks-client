import { AppstoreOutlined, CloseCircleOutlined, UnorderedListOutlined } from '@ant-design/icons'
import {
	Button,
	Card,
	Col,
	Divider,
	Flex,
	Input,
	Row,
	Select,
	Table,
	TableProps,
	Typography,
} from 'antd'
import { useEffect, useState } from 'react'

import { filterGrades } from '../hooks/gradeFilter'
import { GradeWithUser, useGradesData } from '../hooks/useGradesData'
import { StudentCardGrade } from './StudentCardGrade'

import './GradesStudent-styles.less'

const { Text, Title, Paragraph } = Typography

export function GradesStudent() {
	const {
		grades,
		setGrades,
		loading,
		courses,
		error,
		fetchGradesData,
		fetchClassesAndCourses,
		userSession,
	} = useGradesData()

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
			title: 'Coeff.',
			dataIndex: 'coef',
			key: 'coef',
			render: (coef) => parseInt(coef, 10) || 1,
		},
		{
			title: 'Ta Note',
			key: 'yourGrade',
			render: (_, record) => {
				const yourGrade = record.studentGrades?.find((g) => g.student === userSession?.id)
				return yourGrade ? yourGrade.value : '-'
			},
		},
		{
			title: 'Note -',
			key: 'minGrade',
			render: (_, record) => {
				const numericGrades = record.studentGrades?.map((g) => Number(g.value)) || []
				return numericGrades.length ? Math.min(...numericGrades) : '-'
			},
		},
		{
			title: 'Note +',
			key: 'maxGrade',
			render: (_, record) => {
				const numericGrades = record.studentGrades?.map((g) => Number(g.value)) || []
				return numericGrades.length ? Math.max(...numericGrades) : '-'
			},
		},
		{
			title: 'Classe',
			dataIndex: 'className',
			key: 'className',
			render: (text) => text || '-',
		},
		{
			title: 'Appréciation',
			key: 'appreciation',
			width: 250,
			render: (_, record) => {
				const yourGrade = record.studentGrades?.find((g) => g.student === userSession?.id)
				return (
					<Card className="appreciation-card" bordered size="small">
						<Paragraph className="appreciation-text">
							{yourGrade?.comment || 'Pas de commentaire'}
						</Paragraph>
					</Card>
				)
			},
		},
	]

	return (
		<Flex vertical>
			<Row>
				<Col style={{ padding: '8px' }}>
					<Text type="secondary">Consultez vos évaluations et suivez votre progression</Text>
				</Col>
			</Row>

			<Flex justify="space-around">
				<Row>
					<Col style={{ marginRight: '10px' }}>
						<Input.Search placeholder="Rechercher une évaluation" />
					</Col>
				</Row>
				<Row>
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
				</Row>
			</Flex>

			<Flex className="filters-container" justify="center" align="center">
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
							<CloseCircleOutlined
								className="filter-reset-icon"
								onClick={() => handleResetFilter('subject')}
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
							<CloseCircleOutlined
								className="filter-reset-icon"
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
							<CloseCircleOutlined
								className="filter-reset-icon"
								onClick={() => handleResetFilter('year')}
							/>
						</Flex>
					</Flex>
				</Flex>

				<Divider type="vertical" className="filter-divider" />

				<Flex vertical align="flex-end" justify="flex-end" className="filter-reset-all-container">
					<Button onClick={handleResetAllFilters} className="filter-reset-all">
						Réinitialiser tous les filtres
					</Button>
				</Flex>
			</Flex>

			<Flex vertical className="grades-content">
				{error && (
					<Text type="danger" className="grades-error">
						{error}
					</Text>
				)}

				{viewMode === 'list' ? (
					<Table<GradeWithUser>
						columns={columns}
						dataSource={grades.filter((grade) =>
							grade.studentGrades?.some((g) => g.student === userSession?.id),
						)}
						loading={loading}
						rowKey="id"
						className="grades-table student-grades-table"
						pagination={false}
					/>
				) : (
					<Row
						gutter={[24, 24]}
						style={{
							padding: '20px',
							margin: 0,
						}}
					>
						{grades
							.filter((grade) => grade.studentGrades?.some((g) => g.student === userSession?.id))
							.map((grade) => {
								const studentGrade = grade.studentGrades?.find((g) => g.student === userSession?.id)
								return (
									<Col xs={24} sm={12} md={8} lg={6} key={grade.id}>
										<StudentCardGrade grade={grade} userGrade={studentGrade?.value} />
									</Col>
								)
							})}
					</Row>
				)}
			</Flex>
		</Flex>
	)
}
