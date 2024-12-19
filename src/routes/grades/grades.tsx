import { Button, Col, Divider, Flex, Input, Row, Select, Typography } from 'antd'

export function Grades() {
	const handleChange = (value: string) => {
		console.log(`selected ${value}`)
	}
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
			<Flex justify="center">
				<Row style={{ paddingTop: '10px' }}>
					<Col>
						<Typography.Title level={5}>Matière</Typography.Title>
						<Select
							placeholder="Selectionnez une matière"
							style={{ width: 120 }}
							onChange={handleChange}
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
							onChange={handleChange}
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
							onChange={handleChange}
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
								{ value: 'novembre', label: 'Novembre' },
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
							onChange={handleChange}
							options={[
								{ value: '2020', label: '2020' },
								{ value: '2021', label: '2021' },
								{ value: '2022', label: '2022' },
								{ value: '2023', label: '2023' },
							]}
						/>
					</Col>
				</Row>
			</Flex>
		</>
	)
}
