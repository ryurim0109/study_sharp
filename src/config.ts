const required = (key: string, defaultValue: any = undefined): string => {
	const value = process.env[key] || defaultValue;
	if (value == null) {
		throw new Error(`Key ${key} is undefined`);
	}
	return value;
};

export const config = {
	server: {
		env: required('SERVER_ENV'),
		host: required('SERVER_HOST'),
		port: Number(required('SERVER_PORT')),
	},
};
