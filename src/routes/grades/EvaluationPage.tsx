import { useQuery } from '@tanstack/react-query'
import {
	Button,
	Col,
	Dropdown,
	Empty,
	Form,
	Input,
	Row,
	Select,
	Space,
	Table,
	Typography,
	message,
} from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getClasses } from '@api/classes'
import { getCourses } from '@api/courses'
import { postGrade } from '@api/grades'
import { postStudentGrade } from '@api/studentGrade'
import { getUsers } from '@api/users'
import type { Class } from '@apiSchema/classes'
import type { Course } from '@apiSchema/courses'
import type { User } from '@apiSchema/users'

const { Option } = Select

interface StudentTableData {
	id: string
	studentName: string
	grade_value?: number
	comment?: string
}

interface FormData {
	course: string
	name: string
	max_value: number
	coef: number
	description: string
}

export function EvaluationPage() {
	const navigate = useNavigate()
	const [form] = Form.useForm<FormData>()

	// États
	const [selectedCourse, setSelectedCourse] = useState<string>('')
	const [selectedClass, setSelectedClass] = useState<string>('')
	const [grades, setGrades] = useState<Record<string, number>>({})
	const [comments, setComments] = useState<Record<string, string>>({})
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// Queries
	const { data: courses = [], isPending: isLoadingCourses } = useQuery({
		queryKey: ['courses'],
		queryFn: getCourses,
	})

	const { data: classes = [], isPending: isLoadingClasses } = useQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	})

	const { data: students = [], isPending: isLoadingStudents } = useQuery({
		queryKey: ['users', selectedClass],
		queryFn: () => getUsers(selectedClass),
		enabled: Boolean(selectedClass),
	})

	// Handlers
	const handleGradeChange = (studentId: string, value: string) => {
		const numValue = Number(value)
		const maxValue = form.getFieldValue('max_value')

		if (!isNaN(numValue)) {
			if (numValue > maxValue) {
				message.error(`La note ne peut pas dépasser ${maxValue}`)
				return
			}
			if (numValue < 0) {
				message.error('La note ne peut pas être négative')
				return
			}
			setGrades((prev) => ({ ...prev, [studentId]: numValue }))
		}
	}

	const handleCommentChange = (studentId: string, value: string) => {
		setComments((prev) => ({ ...prev, [studentId]: value }))
	}

	const validateGrades = (maxValue: number) => {
		const invalidGrades = Object.entries(grades).filter(
			([_, value]) => value > maxValue || value < 0,
		)

		if (invalidGrades.length > 0) {
			const errorMessage = `Certaines notes sont invalides : \n${invalidGrades
				.map(([studentId]) => {
					const student = students.find((s) => s.id === Number(studentId))
					return `- ${student?.first_name} ${student?.last_name}`
				})
				.join('\n')}`
			message.error(errorMessage)
			return false
		}
		return true
	}

	const handleSubmit = async (withGrades: boolean = true) => {
		try {
			const values = await form.validateFields()

			if (withGrades && !validateGrades(values.max_value)) {
				return
			}

			setIsLoading(true)

			// Conversion explicite des valeurs numériques
			const gradeData = {
				...values,
				course: selectedCourse,
				max_value: values.max_value?.toString(),
				coef: values.coef?.toString(),
			}

			const createdGrade = await postGrade(gradeData)

			if (withGrades && createdGrade?.id && students.length > 0) {
				await Promise.all(
					Object.entries(grades).map(([studentId, value]) =>
						postStudentGrade({
							grade: createdGrade.id!,
							student: Number(studentId),
							value: value.toString(),
							comment: comments[studentId] || '',
						}),
					),
				)
				message.success('Évaluation et notes créées avec succès')
			} else {
				message.success('Évaluation créée avec succès')
			}

			navigate('/app/grades')
		} catch (error) {
			message.error(error instanceof Error ? error.message : 'Une erreur est survenue')
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	// Render helpers
	const renderCourseOption = (course: Course) => (
		<Option key={course.id} value={course.id}>
			{course.name}
		</Option>
	)

	const renderClassOption = (classItem: Class) => (
		<Option key={classItem.id} value={classItem.id}>
			{classItem.name}
		</Option>
	)

	const columns = [
		{
			title: 'Étudiant',
			dataIndex: 'studentName',
			key: 'studentName',
		},
		{
			title: 'Note',
			dataIndex: 'grade_value',
			key: 'grade_value',
			render: (_: unknown, record: StudentTableData) => (
				<Form.Item
					validateStatus={grades[record.id] > form.getFieldValue('max_value') ? 'error' : ''}
					help={
						grades[record.id] > form.getFieldValue('max_value')
							? `Ne peut pas dépasser ${form.getFieldValue('max_value')}`
							: ''
					}
				>
					<Input
						type="number"
						placeholder="Note"
						min={0}
						max={form.getFieldValue('max_value')}
						value={grades[record.id]}
						onChange={(e) => handleGradeChange(record.id, e.target.value)}
						disabled={!selectedCourse || !selectedClass}
						status={grades[record.id] > form.getFieldValue('max_value') ? 'error' : ''}
					/>
				</Form.Item>
			),
		},
		{
			title: 'Commentaire',
			dataIndex: 'comment',
			key: 'comment',
			render: (_: unknown, record: StudentTableData) => (
				<Input
					placeholder="Appréciation"
					value={comments[record.id]}
					onChange={(e) => handleCommentChange(record.id, e.target.value)}
					disabled={!selectedCourse || !selectedClass}
				/>
			),
		},
	]

	const dropdownItems: MenuProps['items'] = [
		{
			key: 'without_grades',
			label: 'Valider sans noter',
			onClick: () => handleSubmit(false),
		},
	]

	// États de désactivation
	const isCourseDisabled = !selectedClass
	const isSubmitDisabled = !selectedClass || !selectedCourse

	// Ajouter un composant pour l'état vide
	const EmptyState = () => (
		<Empty
			description="Veuillez sélectionner une classe"
			style={{
				margin: '48px 0',
			}}
		/>
	)

	return (
		<Row
			gutter={24}
			style={{
				padding: '24px',
				margin: '0 16px',
			}}
		>
			<Col span={10}>
				<div
					style={{
						background: '#fff',
						padding: '24px',
						borderRadius: '8px',
						boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
					}}
				>
					<Typography.Title level={3}>Créer une évaluation</Typography.Title>
					<Form
						form={form}
						layout="vertical"
						style={{ marginTop: '24px' }}
						initialValues={{ coef: 1 }}
						// Ajout de la configuration pour gérer les nombres
						validateTrigger="onBlur"
						onValuesChange={(_, values) => {
							// Conversion des valeurs en nombres si nécessaire
							if (values.max_value) {
								form.setFieldValue('max_value', Number(values.max_value))
							}
							if (values.coef) {
								form.setFieldValue('coef', Number(values.coef))
							}
						}}
					>
						<Form.Item
							name="class"
							label="Classe"
							required
							rules={[{ required: true, message: 'Veuillez sélectionner une classe' }]}
						>
							<Select
								placeholder="Sélectionner une classe"
								onChange={setSelectedClass}
								loading={isLoadingClasses}
							>
								{classes.map(renderClassOption)}
							</Select>
						</Form.Item>

						<Form.Item
							name="course"
							label="Cours"
							required
							rules={[{ required: true, message: 'Veuillez sélectionner un cours' }]}
						>
							<Select
								placeholder="Sélectionner un cours"
								onChange={setSelectedCourse}
								loading={isLoadingCourses}
								disabled={isCourseDisabled}
							>
								{courses.map(renderCourseOption)}
							</Select>
						</Form.Item>

						<Form.Item
							name="name"
							label="Nom de l'évaluation"
							required
							rules={[{ required: true, message: 'Veuillez saisir un nom' }]}
						>
							<Input placeholder="Nom de l'évaluation" disabled={isSubmitDisabled} />
						</Form.Item>

						<Form.Item
							name="coef"
							label="Coefficient (%)"
							rules={[
								{ required: true, message: 'Veuillez saisir un coefficient' },
								{ type: 'number', min: 0, max: 100 },
							]}
						>
							<Input
								type="number"
								placeholder="Coefficient"
								min={0}
								max={100}
								step={0.01}
								disabled={isSubmitDisabled}
							/>
						</Form.Item>

						<Form.Item
							name="max_value"
							label="Note maximale"
							rules={[
								{ required: true, message: 'Veuillez saisir une note maximale' },
								{
									validator: async (_, value) => {
										const num = Number(value)
										if (isNaN(num) || num < 0) {
											throw new Error('La note doit être un nombre positif')
										}
									},
								},
							]}
						>
							<Input
								type="number"
								placeholder="Note maximale"
								min={0}
								step={0.01}
								disabled={isSubmitDisabled}
							/>
						</Form.Item>

						<Form.Item name="description" label="Description">
							<Input.TextArea
								placeholder="Description de l'évaluation"
								disabled={isSubmitDisabled}
							/>
						</Form.Item>

						<Form.Item>
							<Space>
								<Button type="default" onClick={() => navigate('/app/grades')}>
									Annuler
								</Button>
								<Dropdown.Button
									type="primary"
									loading={isLoading}
									menu={{ items: dropdownItems }}
									onClick={() => handleSubmit(true)}
									disabled={isSubmitDisabled}
								>
									Valider
								</Dropdown.Button>
							</Space>
						</Form.Item>
					</Form>
				</div>
			</Col>

			<Col
				span={14}
				style={{
					borderLeft: '1px solid #f0f0f0',
					paddingLeft: '24px',
				}}
			>
				<div
					style={{
						background: '#fff',
						padding: '24px',
						borderRadius: '8px',
						boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
					}}
				>
					<Typography.Title level={3}>Liste des élèves</Typography.Title>

					{!selectedClass ? (
						<EmptyState />
					) : (
						<Table
							columns={columns}
							dataSource={students.map((student: User) => ({
								id: student.id?.toString() || '',
								studentName: `${student.first_name} ${student.last_name}`,
							}))}
							rowKey="id"
							loading={isLoadingStudents}
							locale={{
								emptyText: 'Aucun élève trouvé dans cette classe',
							}}
							style={{ marginTop: '24px' }}
						/>
					)}
				</div>
			</Col>
		</Row>
	)
}
