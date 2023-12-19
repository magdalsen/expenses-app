import { Button } from "@chakra-ui/react";

interface ButtonTypes {
    variant: string;
    text: string;
    colorScheme: string;
}

export const SubmitButton = ({value}:{value: ButtonTypes}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="submit">{value.text}</Button>
    )
}

export const ConfirmButton = ({value}:{value: ButtonTypes}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="button">{value.text}</Button>
    )
}

export const BackButton = ({value}:{value: ButtonTypes}) => {
    return (
        <Button colorScheme={value.colorScheme} variant={value.variant} type="button">{value.text}</Button>
    )
}

export const SaveButton = ({value}:{value: ButtonTypes}) => {
    return (
        <Button colorScheme={value.colorScheme} mr={3} variant={value.variant} type="submit">{value.text}</Button>
    )
}
