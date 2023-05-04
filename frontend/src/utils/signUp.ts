import * as React from "react";
import {SignUpFormValues} from "../types/signing";
export const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        email: data.get('email'),
        password: data.get('password'),
    });
};

export const validateFirstName = (name: string, formValues: SignUpFormValues, setFormValues: (t:SignUpFormValues) => void) => {
    formValues.firstName.value = name !== "" ? name : ""
    formValues.firstName.error = name === ""


    setFormValues({...formValues})
};

export const validateLastName = (name: string, formValues: SignUpFormValues, setFormValues: (t:SignUpFormValues) => void) => {
    formValues.lastName.value = name !== "" ? name : ""
    formValues.lastName.error = name === ""
    setFormValues({...formValues})
};

export const validateEmail = (email: string, formValues: SignUpFormValues, setFormValues: (t:SignUpFormValues) => void) => {
    let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let err = emailRegex.test(email)
    formValues.email.error = !err
    formValues.email.value = err ? email : ""
    setFormValues({...formValues})
};

export const validatePassword = (password: string, formValues: SignUpFormValues, setFormValues: (t:SignUpFormValues) => void) => {
    let mess = checkPasswordValidation(password);

    formValues.password.error = mess !== null
    formValues.password.value = mess !== null ? "": password
    formValues.password.errorMessage =  mess === null ? "": mess
    setFormValues({...formValues})
};

export const validateRepeatedPassword = (password: string, formValues: SignUpFormValues, setFormValues: (t:SignUpFormValues) => void) => {


    formValues.repeatedPassword.error = password !== formValues.password.value
    console.log("password ", formValues.password.value, " repeated password", password)
    formValues.repeatedPassword.value = formValues.repeatedPassword.error ? "": password
    setFormValues({...formValues})
};

const checkPasswordValidation = ( password: string): string|null  => {
    const isWhitespace = new RegExp(/^(?=.*\s)/);
    if (isWhitespace.test(password)) {
        return "Password must not contain Whitespaces.";
    }


    const isContainsUppercase = RegExp(/^(?=.*[A-Z])/);
    if (!isContainsUppercase.test(password)) {
        return "Password must have at least one Uppercase Character.";
    }


    const isContainsLowercase = RegExp(/^(?=.*[a-z])/);
    if (!isContainsLowercase.test(password)) {
        return "Password must have at least one Lowercase Character.";
    }


    const isContainsNumber = RegExp(/^(?=.*[0-9])/);
    if (!isContainsNumber.test(password)) {
        return "Password must contain at least one Digit.";
    }


    const isContainsSymbol =
        RegExp(/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/);
    if (!isContainsSymbol.test(password)) {
        return "Password must contain at least one Special Symbol.";
    }


    const isValidLength = RegExp(/^.{8,20}$/);
    if (!isValidLength.test(password)) {
        return "Password must be 8-20 Characters Long.";
    }
    return null;
}
export const undefinedStringToString = (word:string|undefined):string => {

    return word ===undefined ? "": word;
}
