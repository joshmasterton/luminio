import '../styles/components/Loading.scss';

export function Loading({className}: {className?: string}) {
	return (
		<footer className={`loading ${className}`}>
			<div>
				<div/>
			</div>
		</footer>
	);
}
