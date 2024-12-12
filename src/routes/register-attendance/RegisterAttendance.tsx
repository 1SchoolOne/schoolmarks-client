import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Flex, Grid } from 'antd'
import { useParams } from 'react-router-dom'

import { axiosInstance } from '@api/axiosInstance'

import { isUUID } from '@utils/isUUID'

import { PostAttendanceRecordResponse } from '../../types/api/attendanceRecords'
import { AttendanceForm } from './AttendanceForm'

export function RegisterAttendance() {
	const params = useParams()
	const isValidSessionId = isUUID(String(params.checkinSessionId))
	const screens = Grid.useBreakpoint()
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (otp: string) => {
			if (!isValidSessionId) {
				throw Error("La session d'appel n'est pas valide")
			}

			return axiosInstance.post<PostAttendanceRecordResponse>(`/attendance_records/`, {
				checkin_session_id: params.checkinSessionId,
				totp_code: otp,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['classSession', { checkinSessionId: params.checkinSessionId }],
			})
			queryClient.refetchQueries({ queryKey: ['attendanceRecords', params.checkinSessionId] })
		},
	})

	if (!screens.lg) {
		// TODO: remove inline styling
		return (
			<Flex
				style={{ height: 'inherit', backgroundColor: 'var(--ant-color-bg-base)' }}
				justify="center"
				align="center"
			>
				<AttendanceForm onSubmit={({ otp }) => mutate(otp)} />
			</Flex>
		)
	}

	// TODO: remove inline styling
	return (
		<Flex style={{ height: 'inherit' }} justify="center" align="center">
			<Card>
				<AttendanceForm onSubmit={({ otp }) => mutate(otp)} />
			</Card>
		</Flex>
	)
}
