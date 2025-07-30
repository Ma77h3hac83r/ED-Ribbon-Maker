import React from 'react';
import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';
import {useCardAnimation} from '@/hooks/use-animations';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from './card';
import {useListAnimation} from '@/hooks/use-animations';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    onClick?: () => void;
    interactive?: boolean;
    loading?: boolean;
}

export function AnimatedCard({
    children,
    className,
    header,
    title,
    description,
    footer,
    onClick,
    interactive = false,
    loading = false
} : AnimatedCardProps) {
    const {whileHover, whileTap} = useCardAnimation();

    const CardComponent = interactive ? motion.div : motion.div;
    const cardProps = interactive ? {
        whileHover,
        whileTap,
        onClick
    } : {};

    return (
        <CardComponent {...cardProps}
            className={
                cn('transition-shadow duration-200', interactive && 'cursor-pointer', className)
        }>
            <Card className="h-full">
                {
                header && <CardHeader>{header}</CardHeader>
            }
                {
                (title || description) && (
                    <CardHeader> {
                        title && <CardTitle>{title}</CardTitle>
                    }
                        {
                        description && <CardDescription>{description}</CardDescription>
                    } </CardHeader>
                )
            }
                <CardContent className="relative">
                    {
                    loading && (
                        <motion.div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md"
                            initial={
                                {opacity: 0}
                            }
                            animate={
                                {opacity: 1}
                            }
                            exit={
                                {opacity: 0}
                        }>
                            <motion.div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
                                animate={
                                    {rotate: 360}
                                }
                                transition={
                                    {
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear'
                                    }
                                }/>
                        </motion.div>
                    )
                }
                    <div className={
                        cn(loading && 'opacity-50')
                    }>
                        {children} </div>
                </CardContent>
                {
                footer && <CardFooter>{footer}</CardFooter>
            } </Card>
        </CardComponent>
    );
}

// Animated card with stagger animation for lists
export function AnimatedCardList({
    children,
    className,
    staggerDelay = 0.1
} : {
    children : React.ReactNode;
    className? : string;
    staggerDelay? : number;
}) {
    const {containerProps, itemProps} = useListAnimation(staggerDelay);

    return (
        <motion.div {...containerProps}
            className={
                cn('grid gap-4', className)
        }>
            {
            React.Children.map(children, (child, index) => (
                <motion.div key={index}
                    {...itemProps}
                    transition={
                        {
                            delay: index * staggerDelay
                        }
                }>
                    {child} </motion.div>
            ))
        } </motion.div>
    );
}
