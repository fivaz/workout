'use client';

import { useEffect, useState } from 'react';
import GText from '@/components/GText';
import { useCRUDSessions } from '@/lib/session/session.hook';
import { parse, differenceInSeconds } from 'date-fns';
import { DATE, TIME } from '@/lib/consts';

export default function SessionTimer() {
	const { currentSession } = useCRUDSessions();
	const [elapsed, setElapsed] = useState('-');

	useEffect(() => {
		if (!currentSession?.startAt || !currentSession.date) {
			setElapsed('-');
			return;
		}

		// Combine date + startAt to create a proper Date object
		const start = parse(
			`${currentSession.date} ${currentSession.startAt}`,
			`${DATE} ${TIME}`,
			new Date(),
		);

		const updateElapsed = () => {
			const secondsDiff = differenceInSeconds(new Date(), start);
			const minutes = Math.floor(secondsDiff / 60)
				.toString()
				.padStart(2, '0');
			const seconds = (secondsDiff % 60).toString().padStart(2, '0');

			setElapsed(`${minutes}:${seconds}`);
		};

		updateElapsed(); // initial call
		const interval = setInterval(updateElapsed, 1000);

		return () => clearInterval(interval);
	}, [currentSession]);

	return <GText>{elapsed}</GText>;
}
