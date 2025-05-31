export function AdminStatus() {
	let enabled = $state(false);

	$effect(() => {
		console.log('Checking admin status...');
		if (window) {
			enabled = localStorage.getItem('admin') === 'true';
		}
	});

	return {
		get enabled() {
			return enabled;
		}
	};
}
