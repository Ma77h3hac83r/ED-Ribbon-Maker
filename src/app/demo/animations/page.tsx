'use client';

import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {AnimatedButton} from '@/components/ui/animated-button';
import {AnimatedCard, AnimatedCardList} from '@/components/ui/animated-card';
import {AnimatedLoading} from '@/components/ui/animated-loading';
import {usePageTransition, useListAnimation, useModalAnimation} from '@/hooks/use-animations';
import {Button} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

export default function AnimationsDemoPage() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const {pageProps} = usePageTransition();
    const {containerProps, itemProps} = useListAnimation();
    const {backdropProps, contentProps} = useModalAnimation();

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
    };

    const demoCards = [
        {
            id: 1,
            title: 'Card 1',
            description: 'This is the first animated card'
        }, {
            id: 2,
            title: 'Card 2',
            description: 'This is the second animated card'
        }, {
            id: 3,
            title: 'Card 3',
            description: 'This is the third animated card'
        }, {
            id: 4,
            title: 'Card 4',
            description: 'This is the fourth animated card'
        },
    ];

    return (
        <motion.div {...pageProps} className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <motion.div initial={
                        {
                            opacity: 0,
                            y: -20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            duration: 0.5
                        }
                    }
                    className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Framer Motion Animations Demo</h1>
                    <p className="text-muted-foreground text-lg">
                        Showcasing the animation system for the ED Ribbon Maker
                    </p>
                </motion.div>

                {/* Animated Buttons Section */}
                <motion.section initial={
                        {
                            opacity: 0,
                            y: 20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            delay: 0.2
                        }
                    }
                    className="space-y-4">
                    <h2 className="text-2xl font-semibold">Animated Buttons</h2>
                    <div className="flex flex-wrap gap-4">
                        <AnimatedButton variant="default">
                            Default Button
                        </AnimatedButton>
                        <AnimatedButton variant="outline">
                            Outline Button
                        </AnimatedButton>
                        <AnimatedButton variant="secondary">
                            Secondary Button
                        </AnimatedButton>
                        <AnimatedButton variant="destructive">
                            Destructive Button
                        </AnimatedButton>
                        <AnimatedButton loading={loading}
                            onClick={handleLoadingDemo}>
                            Loading Button
                        </AnimatedButton>
                    </div>
                </motion.section>

                {/* Animated Cards Section */}
                <motion.section initial={
                        {
                            opacity: 0,
                            y: 20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            delay: 0.4
                        }
                    }
                    className="space-y-4">
                    <h2 className="text-2xl font-semibold">Animated Cards</h2>
                    <AnimatedCardList className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {
                        demoCards.map((card) => (
                            <AnimatedCard key={
                                    card.id
                                }
                                title={
                                    card.title
                                }
                                description={
                                    card.description
                                }
                                interactive
                                onClick={
                                    () => console.log(`Clicked ${
                                        card.title
                                    }`)
                            }>
                                <p className="text-sm text-muted-foreground">
                                    Click me to see the hover animation!
                                </p>
                            </AnimatedCard>
                        ))
                    } </AnimatedCardList>
                </motion.section>

                {/* Loading Animations Section */}
                <motion.section initial={
                        {
                            opacity: 0,
                            y: 20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            delay: 0.6
                        }
                    }
                    className="space-y-4">
                    <h2 className="text-2xl font-semibold">Loading Animations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Spinner</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <AnimatedLoading variant="spinner" size="md"/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pulse</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <AnimatedLoading variant="pulse" size="md"/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Dots</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <AnimatedLoading variant="dots" size="md"/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Bars</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <AnimatedLoading variant="bars" size="md"/>
                            </CardContent>
                        </Card>
                    </div>
                </motion.section>

                {/* Modal Demo Section */}
                <motion.section initial={
                        {
                            opacity: 0,
                            y: 20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            delay: 0.8
                        }
                    }
                    className="space-y-4">
                    <h2 className="text-2xl font-semibold">Modal Animation</h2>
                    <Button onClick={
                        () => setShowModal(true)
                    }>
                        Open Animated Modal
                    </Button>
                </motion.section>

                {/* Staggered List Section */}
                <motion.section initial={
                        {
                            opacity: 0,
                            y: 20
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {
                            delay: 1.0
                        }
                    }
                    className="space-y-4">
                    <h2 className="text-2xl font-semibold">Staggered List Animation</h2>
                    <motion.div {...containerProps} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                        Array.from({
                            length: 6
                        }, (_, i) => (
                            <motion.div key={i}
                                {...itemProps}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Item {
                                            i + 1
                                        }</CardTitle>
                                        <CardDescription>
                                            This item animates in with a stagger effect
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Each item appears with a slight delay for a smooth effect.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    } </motion.div>
                </motion.section>
            </div>

            {/* Animated Modal */}
            {
            showModal && (
                <motion.div {...backdropProps} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={
                        () => setShowModal(false)
                }>
                    <motion.div {...contentProps} className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full"
                        onClick={
                            (e) => e.stopPropagation()
                    }>
                        <h3 className="text-xl font-semibold mb-4">Animated Modal</h3>
                        <p className="text-muted-foreground mb-4">
                            This modal demonstrates the spring animation with backdrop blur.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline"
                                onClick={
                                    () => setShowModal(false)
                            }>
                                Cancel
                            </Button>
                            <Button onClick={
                                () => setShowModal(false)
                            }>
                                Confirm
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )
        } </motion.div>
    );
}
