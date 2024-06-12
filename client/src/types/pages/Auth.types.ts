type AuthProps = {
	isSignup?: boolean;
};

type AuthDetailsType = {
	username: string;
	email: string;
	profilePicture?: File;
	password: string;
	confirmPassword?: string;
};
