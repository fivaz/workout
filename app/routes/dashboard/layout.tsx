import { Outlet } from 'react-router';

export default function Auth() {
	return (
		<div className="h-screen bg-red-500">
			<Outlet />
		</div>
	);
}
