import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import {App} from '../App';
import '@testing-library/jest-dom';

describe('App Component', () => {
	it('Should render app name on load', () => {
		const app = render(<App/>);
		const header = app.getByText('Luminio');

		expect(header).toBeInTheDocument();
	});
});
