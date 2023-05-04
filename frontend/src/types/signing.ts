

export type SignUpFormValues = {
    firstName:{
        value: string,
        error: boolean,
        errorMessage: string
    },
    lastName:{
        value: string,
        error: boolean,
        errorMessage: string
    },
    email:{
        value: string,
        error: boolean,
        errorMessage: string
    },
    password:{
        value: string,
        error: boolean,
        errorMessage: string
    }
    repeatedPassword:{
        value: string,
        error: boolean,
        errorMessage: string
    }
}

export type SignUpPostRequestBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export type SignInFormValues = {
    email:{
        value: string,
        error: boolean,
        errorMessage: string
    },
    password:{
        value: string,
        error: boolean,
        errorMessage: string
    }
}
export type SignInPostRequestBody = {
    email: string,
    password: string
}
export type SignInPostResponseBody = {
    AccessToken: string,
    accessTokenExpirationDate: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string
}