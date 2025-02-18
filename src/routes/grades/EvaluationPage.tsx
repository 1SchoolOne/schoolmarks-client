import { Button, Col, Form, Input, Row, Select, Space, Table, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

interface Student {
	id: number
	studentName: string
	grade_value?: number
	comment?: string
}

const students: Student[] = [
	{ id: 1, studentName: 'Jean Dupont' },
	{ id: 2, studentName: 'Marie Curie' },
	{ id: 3, studentName: 'Albert Einstein' },
]

export function EvaluationPage() {
	const navigate = useNavigate()
	const [selectedClass, setSelectedClass] = useState<string | null>(null)
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
	const [maxGrade, setMaxGrade] = useState<number | null>(null)
	const [coefficient, setCoefficient] = useState<number>(1)
	const [grades, setGrades] = useState<Record<number, number>>({})
	const [comments, setComments] = useState<Record<number, string>>({})

	const handleGradeChange = (studentId: number, value: string) => {
		setGrades((prev) => ({ ...prev, [studentId]: Number(value) }))
	}

	const handleCommentChange = (studentId: number, value: string) => {
		setComments((prev) => ({ ...prev, [studentId]: value }))
	}

	const handleSubmit = (withGrades: boolean = true) => {
		const evaluation = {
			subject: selectedSubject,
			class: selectedClass,
			coefficient,
			maxGrade,
			grades: withGrades ? grades : {},
			comments,
		}
		console.log('Evaluation à soumettre:', evaluation)
		// Ajoutez ici la logique pour envoyer les données
	}

	const columns = [
		{ title: 'Étudiant', dataIndex: 'studentName', key: 'studentName' },
		{
			title: 'Note',
			dataIndex: 'grade_value',
			key: 'grade_value',
			render: (_: any, record: Student) => (
				<Input
					type="number"
					placeholder="Note"
					min={0}
					max={maxGrade || undefined}
					value={grades[record.id]}
					onChange={(e) => handleGradeChange(record.id, e.target.value)}
				/>
			),
		},
		{
			title: 'Commentaire',
			dataIndex: 'comment',
			key: 'comment',
			render: (_: any, record: Student) => (
				<Input
					placeholder="Appréciation"
					value={comments[record.id]}
					onChange={(e) => handleCommentChange(record.id, e.target.value)}
				/>
			),
		},
	]

	return (
		<Row gutter={24}>
			<Col span={10}>
				<Typography.Title level={3}>Créer une évaluation</Typography.Title>
				<Form layout="vertical">
					<Form.Item label="Matière" required>
						<Select placeholder="Sélectionner une matière" onChange={setSelectedSubject}>
							<Option value="maths">Mathématiques</Option>
							<Option value="français">Français</Option>
						</Select>
					</Form.Item>
					<Form.Item label="Coefficient">
						<Input
							type="number"
							placeholder="Coefficient"
							min={1}
							value={coefficient}
							onChange={(e) => setCoefficient(Number(e.target.value))}
						/>
					</Form.Item>
					<Form.Item label="Note maximale">
						<Input
							type="number"
							placeholder="Note max"
							min={0}
							onChange={(e) => setMaxGrade(Number(e.target.value))}
						/>
					</Form.Item>
					<Form.Item label="Classe">
						<Select placeholder="Sélectionner une classe" onChange={setSelectedClass}>
							<Option value="classe1">Classe 1</Option>
							<Option value="classe2">Classe 2</Option>
						</Select>
					</Form.Item>
					<Space>
						<Button type="default" onClick={() => navigate('/app/grades')}>
							Annuler
						</Button>
						<Button type="primary" onClick={() => handleSubmit(false)}>
							Valider sans noter
						</Button>
						<Button type="primary" onClick={() => handleSubmit(true)}>
							Valider
						</Button>
					</Space>
				</Form>
			</Col>

			<Col span={14}>
				<Typography.Title level={3}>Liste des élèves</Typography.Title>
				<Table columns={columns} dataSource={students} rowKey="id" />
			</Col>
		</Row>
	)
}
