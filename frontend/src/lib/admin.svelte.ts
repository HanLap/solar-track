
export function getAdminToken() {
	return localStorage.getItem('admin');
}

export function AdminStatus() {
	let enabled = $state(false);
	let token = $state<string | null>(null);

	$effect(() => {
		console.log('Checking admin status...');
		if (window) {
			token =	getAdminToken();
			enabled = !!token;
		}
	});

	return {
		get enabled() {
			return enabled;
		},
		get token() {
			return token
		}
	};
}
