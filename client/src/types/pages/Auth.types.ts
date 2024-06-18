type AuthProps = {
	isSignup?: boolean;
};

type AuthDetailsType = {
	username: string;
	email?: string;
	profilePicture?: File;
	password: string;
	confirmPassword?: string;
};

type ShowPasswordsType = {
	password: boolean;
	confirmPassword: boolean;
};
