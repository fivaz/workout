import type { PropsWithChildren } from 'react';
import { SessionContext } from '@/lib/session/sessionContext';
import { useCRUDSessions } from '@/lib/session/session.hook';

export function SessionProvider({ children }: PropsWithChildren) {
	const value = useCRUDSessions();

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
