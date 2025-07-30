import React from 'react';
import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';
import {useLoadingAnimation} from '@/hooks/use-animations';

interface AnimatedLoadingProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'pulse' | 'dots' | 'bars';
    className?: string;
    text?: string;
}

export function AnimatedLoading({
    size = 'md',
    variant = 'spinner',
    className,
    text
} : AnimatedLoadingProps) {
    const {spinnerProps, pulseProps} = useLoadingAnimation();

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const renderLoader = () => {
        switch (variant) {
            case 'spinner':
                return (
                    <motion.div className={
                            cn('border-2 border-primary border-t-transparent rounded-full', sizeClasses[size])
                        }
                        {...spinnerProps}/>
                );

            case 'pulse':
                return (
                    <motion.div className={
                            cn('bg-primary rounded-full', sizeClasses[size])
                        }
                        {...pulseProps}/>
                );

            case 'dots':
                return (
                    <div className="flex space-x-1">
                        {
                        [0, 1, 2].map((i) => (
                            <motion.div key={i}
                                className={
                                    cn('bg-primary rounded-full', size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4')
                                }
                                animate={
                                    {
                                        scale: [
                                            1, 1.2, 1
                                        ],
                                        opacity: [0.5, 1, 0.5]
                                    }
                                }
                                transition={
                                    {
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut'
                                    }
                                }/>
                        ))
                    } </div>
                );

            case 'bars':
                return (
                    <div className="flex space-x-1">
                        {
                        [0, 1, 2, 3].map((i) => (
                            <motion.div key={i}
                                className={
                                    cn('bg-primary rounded-sm', size === 'sm' ? 'h-4 w-1' : size === 'md' ? 'h-6 w-1' : 'h-8 w-2')
                                }
                                animate={
                                    {
                                        scaleY: [1, 2, 1]
                                    }
                                }
                                transition={
                                    {
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: 'easeInOut'
                                    }
                                }/>
                        ))
                    } </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={
            cn('flex flex-col items-center justify-center space-y-2', className)
        }>
            {
            renderLoader()
        }
            {
            text && (
                <motion.p className="text-sm text-muted-foreground"
                    initial={
                        {opacity: 0}
                    }
                    animate={
                        {opacity: 1}
                    }
                    transition={
                        {delay: 0.2}
                }>
                    {text} </motion.p>
            )
        } </div>
    );
}

// Full screen loading overlay
export function AnimatedLoadingOverlay({
    text = 'Loading...',
    variant = 'spinner',
    size = 'lg'
} : {
    text? : string;
    variant? : 'spinner' | 'pulse' | 'dots' | 'bars';
    size? : 'sm' | 'md' | 'lg';
}) {
    return (
        <motion.div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={
                {opacity: 0}
            }
            animate={
                {opacity: 1}
            }
            exit={
                {opacity: 0}
        }>
            <AnimatedLoading text={text}
                variant={variant}
                size={size}/>
        </motion.div>
    );
}

// Inline loading component
export function AnimatedInlineLoading({
    size = 'sm',
    variant = 'dots'
} : {
    size? : 'sm' | 'md' | 'lg';
    variant? : 'spinner' | 'pulse' | 'dots' | 'bars';
}) {
    return (
        <div className="inline-flex items-center">
            <AnimatedLoading size={size}
                variant={variant}/>
        </div>
    );
}
