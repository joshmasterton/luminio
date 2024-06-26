import {Link, useRouteError} from 'react-router-dom';
import '../styles/pages/Error.scss';

export function Error() {
	const error = useRouteError() as Error;
	return (
		<div id='error'>
			<div>
				<h1>Oops!</h1>
				<div>{error.message}</div>
				<Link to='/'>
					Try again
				</Link>
			</div>
		</div>
	);
}
