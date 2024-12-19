import { Button, Col, Divider, Flex, Input, Row, Select, Table, TableProps, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { getGrades, getUsers } from '@api/grades'

import { Grade } from '../../types/api/grades'
import { User } from '../../types/api/users'

interface GradeWithUser extends Grade {
	studentName?: string
}

export function Grades() {
	const [grades, setGrades] = useState<GradeWithUser[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [filters, setFilters] = useState({
		subject: '',
		class: '',
		month: '',
		year: '',
	})

	const fetchData = async () => {
		try {
			setLoading(true)
			const [gradesData, usersData] = await Promise.all([getGrades(), getUsers()])

			// Ajouter les noms des étudiants aux notes
			const gradesWithUsers = gradesData.map((grade) => {
				const student = usersData.find((user) => user.id === grade.student_id)
				return {
					...grade,
					studentName: student ? `${student.first_name} ${student.last_name}` : 'Étudiant inconnu',
				}
			})

			setGrades(gradesWithUsers)
			setUsers(usersData)
			setError(null)
		} catch (err) {
			setError('Erreur lors du chargement des données')
			console.error('Erreur:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	const handleChange = (value: string, type: keyof typeof filters) => {
		setFilters((prev) => ({
			...prev,
			[type]: value,
		}))
	}

	const columns: TableProps<GradeWithUser>['columns'] = [
		{
			title: 'Étudiant',
			dataIndex: 'studentName',
			key: 'studentName',
			render: (text: string) => text || 'Étudiant inconnu',
		},
		{
			title: 'Note',
			dataIndex: 'grade_value',
			key: 'grade_value',
			render: (value: string) => value,
		},
		{
			title: 'Commentaire',
			dataIndex: 'comment',
			key: 'comment',
		},
		{
			title: 'Date de création',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (date: string) => (date ? new Date(date).toLocaleDateString('fr-FR') : '-'),
		},
	]

	return (
		<>
			<Row>
				<Col style={{ padding: '8px' }}>
					<Typography.Text type="secondary">
						Accéder rapidement à vos évaluations et suivez la progression de vos étudiants
					</Typography.Text>
				</Col>
			</Row>
			<Flex justify="space-around">
				<Row>
					<Col style={{ marginRight: '10px' }}>
						<Input.Search placeholder="Rechercher une évaluation" />
					</Col>
					<Col>
						<Button type="primary">Créer une évaluation</Button>
					</Col>
				</Row>
			</Flex>
			<Flex justify="center" vertical>
				<Row style={{ paddingTop: '10px' }}>
					<Col>
						<Typography.Title level={5}>Matière</Typography.Title>
						<Select
							placeholder="Selectionnez une matière"
							style={{ width: 120 }}
							onChange={(value) => handleChange(value, 'subject')}
							value={filters.subject}
							options={[
								{ value: 'Kotlin', label: 'Kotlin' },
								{ value: 'Python', label: 'Python' },
								{ value: 'Android', label: 'Android' },
								{ value: 'Ios', label: 'Ios' },
							]}
						/>
						<Divider type="vertical" style={{ margin: '10px' }} />
					</Col>
					<Col>
						<Typography.Title level={5}>Classe</Typography.Title>
						<Select
							placeholder="Selectionnez une classe"
							style={{ width: 120 }}
							onChange={(value) => handleChange(value, 'class')}
							value={filters.class}
							options={[
								{ value: 'L1 Paris', label: 'L1 Paris' },
								{ value: 'L1 Cergy', label: 'L1 Cergy' },
								{ value: 'L2 Cergy', label: 'L2 Cergy' },
								{ value: 'L2 Paris', label: 'L2 Paris' },
							]}
						/>
						<Divider type="vertical" style={{ margin: '10px' }} />
					</Col>
					<Col>
						<Typography.Title level={5}>Mois</Typography.Title>
						<Select
							placeholder="Selectionnez un mois"
							style={{ width: 120 }}
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
						<Divider type="vertical" style={{ margin: '10px' }} />
					</Col>
					<Col>
						<Typography.Title level={5}>Année</Typography.Title>
						<Select
							placeholder="Selectionnez une année"
							style={{ width: 120 }}
							onChange={(value) => handleChange(value, 'year')}
							value={filters.year}
							options={[
								{ value: '2020', label: '2020' },
								{ value: '2021', label: '2021' },
								{ value: '2022', label: '2022' },
								{ value: '2023', label: '2023' },
							]}
						/>
					</Col>
				</Row>

				{error && (
					<Typography.Text type="danger" style={{ margin: '16px 0' }}>
						{error}
					</Typography.Text>
				)}

				<Table<GradeWithUser>
					columns={columns}
					dataSource={grades}
					loading={loading}
					rowKey="id"
					style={{ width: '100%', marginTop: '16px' }}
				/>
			</Flex>
		</>
	)
}
