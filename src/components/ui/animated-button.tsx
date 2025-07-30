import React from 'react';
import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';
import {useButtonAnimation} from '@/hooks/use-animations';
import {Button} from './button';
import type {ButtonProps}
from './button';

interface AnimatedButtonProps extends ButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}

export function AnimatedButton({
    children,
    className,
    variant = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    onClick,
    ...props
} : AnimatedButtonProps) {
    const {whileHover, whileTap, transition} = useButtonAnimation();

    return (
        <motion.div whileHover={whileHover}
            whileTap={whileTap}
            transition={transition}
            className="inline-block">
            <Button variant={variant}
                size={size}
                disabled={
                    disabled || loading
                }
                onClick={onClick}
                className={
                    cn('relative overflow-hidden', loading && 'cursor-not-allowed', className)
                }
                {...props}>
                {
                loading && (
                    <motion.div className="absolute inset-0 flex items-center justify-center bg-background/80"
                        initial={
                            {opacity: 0}
                        }
                        animate={
                            {opacity: 1}
                        }
                        exit={
                            {opacity: 0}
                    }>
                        <motion.div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
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
                <span className={
                    cn(loading && 'opacity-0')
                }>
                    {children} </span>
            </Button>
        </motion.div>
    );
}
