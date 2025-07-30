'use client';

import * as React from 'react';
import {useFormContext, Controller, FieldValues, Path} from 'react-hook-form';
import {cn} from '@/lib/utils';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Switch} from '@/components/ui/switch';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Slider} from '@/components/ui/slider';

// Form field wrapper component
interface FormFieldProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function FormField < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    className,
    children
} : FormFieldProps < T >) {const {
        control,
        formState: {
            errors
        }
    } = useFormContext < T > ();
    const error = errors[name];

    return (
        <div className={
            cn('space-y-2', className)
        }>
            {
            label && (
                <Label htmlFor={name}
                    className={
                        cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')
                }>
                    {label} </Label>
            )
        }
            <Controller name={name}
                control={control}
                render={
                    ({field}) => (
                        <div className="space-y-1">
                            {
                            React.cloneElement(children as React.ReactElement, {
                                ...field,
                                id: name
                            })
                        }
                            {
                            error && (
                                <p className="text-sm text-red-500">
                                    {
                                    error.message as string
                                }</p>
                            )
                        }
                            {
                            description && ! error && (
                                <p className="text-sm text-muted-foreground">
                                    {description}</p>
                            )
                        } </div>
                    )
                }/>
        </div>
    );
}

// Form input component
interface FormInputProps < T extends FieldValues > extends React.InputHTMLAttributes < HTMLInputElement > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
}

export function FormInput < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    className,
    ...props
} : FormInputProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}
            className={className}>
            <Input {...props}/>
        </FormField>
    );
}

// Form textarea component
interface FormTextareaProps < T extends FieldValues > extends React.TextareaHTMLAttributes < HTMLTextAreaElement > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
}

export function FormTextarea < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    className,
    ...props
} : FormTextareaProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}
            className={className}>
            <Textarea {...props}/>
        </FormField>
    );
}

// Form select component
interface FormSelectProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
    placeholder?: string;
    options: {
        value: string;
        label: string
    }[];
}

export function FormSelect < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    placeholder,
    options
} : FormSelectProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent> {
                    options.map((option) => (
                        <SelectItem key={
                                option.value
                            }
                            value={
                                option.value
                        }>
                            {
                            option.label
                        } </SelectItem>
                    ))
                } </SelectContent>
            </Select>
        </FormField>
    );
}

// Form checkbox component
interface FormCheckboxProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
}

export function FormCheckbox < T extends FieldValues > ({
    name,
    label,
    description,
    required = false
} : FormCheckboxProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}>
            <Checkbox/>
        </FormField>
    );
}

// Form switch component
interface FormSwitchProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
}

export function FormSwitch < T extends FieldValues > ({
    name,
    label,
    description,
    required = false
} : FormSwitchProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}>
            <Switch/>
        </FormField>
    );
}

// Form radio group component
interface FormRadioGroupProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
    options: {
        value: string;
        label: string
    }[];
}

export function FormRadioGroup < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    options
} : FormRadioGroupProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}>
            <RadioGroup> {
                options.map((option) => (
                    <div key={
                            option.value
                        }
                        className="flex items-center space-x-2">
                        <RadioGroupItem value={
                                option.value
                            }
                            id={
                                `${name}-${
                                    option.value
                                }`
                            }/>
                        <Label htmlFor={
                            `${name}-${
                                option.value
                            }`
                        }>
                            {
                            option.label
                        }</Label>
                    </div>
                ))
            } </RadioGroup>
        </FormField>
    );
}

// Form slider component
interface FormSliderProps < T extends FieldValues > {
    name: Path < T >;
    label?: string;
    description?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number[];
}

export function FormSlider < T extends FieldValues > ({
    name,
    label,
    description,
    required = false,
    min = 0,
    max = 100,
    step = 1,
    defaultValue = [0]
} : FormSliderProps < T >) {return(
        <FormField name={name}
            label={label}
            description={description}
            required={required}>
            <Slider min={min}
                max={max}
                step={step}
                defaultValue={defaultValue}/>
        </FormField>
    );
}

// Form error display component
interface FormErrorProps {
    error?: string;
    className?: string;
}

export function FormError({error, className} : FormErrorProps) {
    if (! error) 
        return null;
    


    return (
        <p className={
            cn('text-sm text-red-500', className)
        }>
            {error} </p>
    );
}

// Form success message component
interface FormSuccessProps {
    message?: string;
    className?: string;
}

export function FormSuccess({message, className} : FormSuccessProps) {
    if (!message) 
        return null;
    


    return (
        <p className={
            cn('text-sm text-green-600', className)
        }>
            {message} </p>
    );
}

// Form loading state component
interface FormLoadingProps {
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function FormLoading({isLoading, children, className} : FormLoadingProps) {
    if (!isLoading) 
        return <>{children}</>;
    


    return (
        <div className={
            cn('opacity-50 pointer-events-none', className)
        }>
            {children} </div>
    );
}
