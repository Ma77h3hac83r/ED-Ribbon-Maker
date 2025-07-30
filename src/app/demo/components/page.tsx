'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {
    // Basic Components
    Button,
    Input,
    Label,
    Textarea,
    Badge,
    Avatar,
    AvatarFallback,
    AvatarImage,

    // Layout Components
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,

    // Form Components
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Checkbox,
    Switch,
    RadioGroup,
    RadioGroupItem,
    Slider,

    // Interactive Components
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,

    // Feedback Components
    Progress,
    Toaster,

    // Animated Components
    AnimatedButton,
    AnimatedCard,
    AnimatedLoading,

    // Specialized Components
    RibbonPreview,
    CommanderProfile,
    SettingsPanel
} from '@/components/ui';

export default function ComponentsDemoPage() {
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    // Sample data for components
    const sampleRibbons = [
        {
            id: '1',
            name: 'Combat',
            description: 'Elite combat rank',
            level: 5,
            type: 'Combat',
            color: '#dc2626',
            icon: '⚔️'
        }, {
            id: '2',
            name: 'Trade',
            description: 'Elite trade rank',
            level: 5,
            type: 'Trade',
            color: '#059669',
            icon: '💰'
        }, {
            id: '3',
            name: 'Exploration',
            description: 'Elite exploration rank',
            level: 5,
            type: 'Exploration',
            color: '#2563eb',
            icon: '🔍'
        },
    ];

    const sampleCommander = {
        id: '1',
        name: 'Commander John Doe',
        rank: 'Elite',
        combatRank: '5 Elite',
        tradeRank: '5 Elite',
        explorationRank: '5 Elite',
        cqcRank: '3 Champion',
        federationRank: '12 Admiral',
        empireRank: '12 King',
        squadron: {
            name: 'Elite Squadron',
            rank: 'Leader'
        },
        lastUpdated: new Date().toISOString(),
        location: 'Sol',
        credits: 1500000000,
        ship: 'Anaconda'
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
        }, 1000);
        return() => clearInterval(timer);
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <motion.div initial={
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
                        duration: 0.5
                    }
            }>
                <h1 className="text-4xl font-bold mb-2">shadcn/ui Components Demo</h1>
                <p className="text-muted-foreground">
                    A comprehensive showcase of all UI components for the ED Ribbon Maker application.
                </p>
            </motion.div>

            {/* Basic Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Basic Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Buttons */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Buttons</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                <Button>Default</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                                <Button variant="destructive">Destructive</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm">Small</Button>
                                <Button size="default">Default</Button>
                                <Button size="lg">Large</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Enter your message"/>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Badges & Avatars */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Badges & Avatars</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge>Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                            </div>
                            <div className="flex gap-2">
                                <Avatar>
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="User"/>
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarFallback>CM</AvatarFallback>
                                </Avatar>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Form Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Form Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Select & Checkbox */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select & Checkbox</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="framework">Framework</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a framework"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="next">Next.js</SelectItem>
                                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                        <SelectItem value="astro">Astro</SelectItem>
                                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms"/>
                                <Label htmlFor="terms">Accept terms and conditions</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="airplane-mode"/>
                                <Label htmlFor="airplane-mode">Airplane Mode</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Radio Group & Slider */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Radio Group & Slider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Layout Type</Label>
                                <RadioGroup defaultValue="horizontal">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="horizontal" id="horizontal"/>
                                        <Label htmlFor="horizontal">Horizontal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="vertical" id="vertical"/>
                                        <Label htmlFor="vertical">Vertical</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="grid" id="grid"/>
                                        <Label htmlFor="grid">Grid</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label>Spacing: {progress}px</Label>
                                <Slider value={
                                        [progress]
                                    }
                                    max={100}
                                    step={1}/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Interactive Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Interactive Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Dropdown Menu */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dropdown Menu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Open Menu</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>

                    {/* Popover */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Popover</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Popover open={popoverOpen}
                                onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Open Popover</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Dimensions</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Set the dimensions for the layer.
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="width">Width</Label>
                                                <Input id="width" defaultValue="100%" className="col-span-2 h-8"/>
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="maxWidth">Max. width</Label>
                                                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8"/>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </CardContent>
                    </Card>

                    {/* Tooltip */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tooltip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">Hover me</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This is a tooltip</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Layout Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Layout Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tabs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tabs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="account" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="account">Account</TabsTrigger>
                                    <TabsTrigger value="password">Password</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="John Doe"/>
                                    </div>
                                </TabsContent>
                                <TabsContent value="password">
                                    <div className="space-y-2">
                                        <Label htmlFor="current">Current password</Label>
                                        <Input id="current" type="password"/>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Sheet */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sheet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Sheet open={sheetOpen}
                                onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline">Open Sheet</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Edit profile</SheetTitle>
                                        <SheetDescription>
                                            Make changes to your profile here. Click save when you&apos;re done.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input id="name" defaultValue="John Doe" className="col-span-3"/>
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <Button type="submit">Save changes</Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Specialized Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Specialized Components</h2>

                {/* Ribbon Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ribbon Preview</CardTitle>
                        <CardDescription>
                            Display and interact with ribbon layouts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RibbonPreview ribbons={sampleRibbons}
                            layout="horizontal"
                            spacing={10}
                            showLabels={true}
                            interactive={true}
                            onRibbonClick={
                                (ribbon) => console.log('Clicked ribbon:', ribbon)
                            }/>
                    </CardContent>
                </Card>

                {/* Commander Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commander Profile</CardTitle>
                        <CardDescription>
                            Display commander information from Inara API
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CommanderProfile commander={sampleCommander}
                            onRefresh={
                                () => console.log('Refreshing commander data')
                            }
                            onViewDetails={
                                () => console.log('Viewing commander details')
                            }/>
                    </CardContent>
                </Card>

                {/* Settings Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Settings Panel</CardTitle>
                        <CardDescription>
                            Comprehensive settings management
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SettingsPanel onSave={
                                (settings) => console.log('Saving settings:', settings)
                            }
                            onReset={
                                () => console.log('Resetting settings')
                            }/>
                    </CardContent>
                </Card>
            </section>

            {/* Animated Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Animated Components</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Animated Button */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Animated Button</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <AnimatedButton>Click me</AnimatedButton>
                            <AnimatedButton variant="outline"
                                loading={true}>
                                Loading
                            </AnimatedButton>
                        </CardContent>
                    </Card>

                    {/* Animated Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Animated Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatedCard>
                                <CardHeader>
                                    <CardTitle>Animated Card</CardTitle>
                                    <CardDescription>This card has hover animations</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Hover over this card to see animations!</p>
                                </CardContent>
                            </AnimatedCard>
                        </CardContent>
                    </Card>

                    {/* Loading Components */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Loading Components</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AnimatedLoading variant="spinner"/>
                            <AnimatedLoading variant="pulse"/>
                            <AnimatedLoading variant="dots"/>
                            <AnimatedLoading variant="bars"/>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Progress */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Progress</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>Progress Bar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={progress}
                            className="w-full"/>
                        <p className="text-sm text-muted-foreground mt-2">
                            Progress: {progress}%
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Toaster */}
            <Toaster/>
        </div>
    );
}
