import '../styles/components/Loading.scss';

export function Loading({className}: {className?: string}) {
	return (
		<div className={`loading ${className}`}>
			<div>
				<div/>
			</div>
		</div>
	);
}
