import { NavLink } from 'react-router';
import { ROUTES } from '@/lib/consts';

export default function Test() {
	return (
		<div>
			<NavLink to={ROUTES.LOGIN}>Login</NavLink>
			Test
		</div>
	);
}
