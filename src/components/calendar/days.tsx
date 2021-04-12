import React from 'react'
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { Flex, Stack } from '@chakra-ui/react'
import Day from './day'
import { formatDate } from '../../utils/helpers'
import useSWR from 'swr'
import { contentNotesFetcher } from '../../utils/fetcher'

interface DaysProps {
	currentDate: Date
	projectSlug: string
}

const Days = ({ currentDate, projectSlug }: DaysProps) => {
	const monthStart = startOfMonth(currentDate)
	const monthEnd = endOfMonth(monthStart)
	const startDate = startOfWeek(monthStart)
	const endDate = endOfWeek(monthEnd)
	const dateFormat = 'd'
	const rows = []
	let days = []
	let day = startDate
	let formattedDate = ''
	let key = 0

	const { data } = useSWR(['/api/content-note', startDate.toISOString(), endDate.toISOString(), projectSlug], contentNotesFetcher, { refreshInterval: 1000 })

	if (data) {
		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const { contentNotes } = data
				const filteredContentNotes = contentNotes.filter(contentNote => contentNote.date === day.toISOString())

				formattedDate = formatDate(day, dateFormat)
				days.push(
					<Day key={i} project={projectSlug} contentNotes={filteredContentNotes} day={day} month={monthStart} date={formattedDate} />
				)
				day = addDays(day, 1)
			}
			rows.push(
				<Flex
					width="100%"
					gridColumnGap={2}
					alignItems="center"
					key={`week-${key}`}
					justifyContent="space-between"
				>
					{days}
				</Flex>
			)

			key += 1
			days = []
		}
		return <Stack>{rows}</Stack>
	}

	return <h1>carregando</h1>
}

export default Days
