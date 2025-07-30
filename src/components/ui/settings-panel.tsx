'use client';

import React from 'react';
import {cn} from '@/lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from './card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './tabs';
import {Switch} from './switch';
import {Label} from './label';
import {Slider} from './slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select';
import {Separator} from './separator';
import {Button} from './button';
import {motion} from 'framer-motion';
import {
    Settings,
    Palette,
    Bell,
    Shield,
    Download,
    Save,
    RotateCcw
} from 'lucide-react';

interface SettingsPanelProps {
    className?: string;
    onSave?: (settings : Record < string, unknown >) => void;
    onReset?: () => void;
    loading?: boolean;
}

export function SettingsPanel({
    className,
    onSave,
    onReset,
    loading = false
} : SettingsPanelProps) {
    const [settings, setSettings] = React.useState({
        // Appearance
        theme: 'auto',
        reduceMotion: false,
        showAnimations: true,
        compactMode: false,

        // Notifications
        emailNotifications: true,
        pushNotifications: false,
        syncNotifications: true,

        // Privacy
        shareProfile: false,
        allowAnalytics: true,
        autoSync: true,

        // Ribbon Settings
        defaultLayout: 'horizontal',
        defaultSpacing: 10,
        showLabels: true,
        showDescriptions: false,
        maxRibbonsPerRow: 5,

        // Export Settings
        defaultFormat: 'svg',
        defaultQuality: 90,
        includeMetadata: true
    });

    const handleSettingChange = (key : string, value : unknown) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        onSave ?. (settings);
    };

    const handleReset = () => {
        onReset ?. ();
    };

    return (
        <motion.div initial={
                {
                    opacity: 0,
                    x: 20
                }
            }
            animate={
                {
                    opacity: 1,
                    x: 0
                }
            }
            transition={
                {
                    duration: 0.3
                }
            }
            className={
                cn('w-full max-w-4xl mx-auto', className)
        }>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5"/>
                        <CardTitle>Settings</CardTitle>
                    </div>
                    <CardDescription>
                        Customize your experience and preferences
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="appearance" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="appearance" className="flex items-center gap-2">
                                <Palette className="w-4 h-4"/>
                                <span className="hidden sm:inline">Appearance</span>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell className="w-4 h-4"/>
                                <span className="hidden sm:inline">Notifications</span>
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="flex items-center gap-2">
                                <Shield className="w-4 h-4"/>
                                <span className="hidden sm:inline">Privacy</span>
                            </TabsTrigger>
                            <TabsTrigger value="ribbons" className="flex items-center gap-2">
                                <Download className="w-4 h-4"/>
                                <span className="hidden sm:inline">Ribbons</span>
                            </TabsTrigger>
                            <TabsTrigger value="export" className="flex items-center gap-2">
                                <Download className="w-4 h-4"/>
                                <span className="hidden sm:inline">Export</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Appearance Settings */}
                        <TabsContent value="appearance" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">Theme</Label>
                                    <Select value={
                                            settings.theme
                                        }
                                        onValueChange={
                                            (value) => handleSettingChange('theme', value)
                                    }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select theme"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="auto">Auto (System)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator/>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="showAnimations">Show Animations</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Enable smooth animations throughout the app
                                            </p>
                                        </div>
                                        <Switch id="showAnimations"
                                            checked={
                                                settings.showAnimations
                                            }
                                            onCheckedChange={
                                                (checked) => handleSettingChange('showAnimations', checked)
                                            }/>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="reduceMotion">Reduce Motion</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Reduce motion for accessibility
                                            </p>
                                        </div>
                                        <Switch id="reduceMotion"
                                            checked={
                                                settings.reduceMotion
                                            }
                                            onCheckedChange={
                                                (checked) => handleSettingChange('reduceMotion', checked)
                                            }/>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="compactMode">Compact Mode</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Use more compact layouts
                                            </p>
                                        </div>
                                        <Switch id="compactMode"
                                            checked={
                                                settings.compactMode
                                            }
                                            onCheckedChange={
                                                (checked) => handleSettingChange('compactMode', checked)
                                            }/>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Notification Settings */}
                        <TabsContent value="notifications" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <Switch id="emailNotifications"
                                        checked={
                                            settings.emailNotifications
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('emailNotifications', checked)
                                        }/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive browser push notifications
                                        </p>
                                    </div>
                                    <Switch id="pushNotifications"
                                        checked={
                                            settings.pushNotifications
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('pushNotifications', checked)
                                        }/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="syncNotifications">Sync Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Notify when data sync completes
                                        </p>
                                    </div>
                                    <Switch id="syncNotifications"
                                        checked={
                                            settings.syncNotifications
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('syncNotifications', checked)
                                        }/>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Privacy Settings */}
                        <TabsContent value="privacy" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="shareProfile">Share Profile</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow others to view your profile
                                        </p>
                                    </div>
                                    <Switch id="shareProfile"
                                        checked={
                                            settings.shareProfile
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('shareProfile', checked)
                                        }/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="allowAnalytics">Analytics</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Help improve the app with anonymous analytics
                                        </p>
                                    </div>
                                    <Switch id="allowAnalytics"
                                        checked={
                                            settings.allowAnalytics
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('allowAnalytics', checked)
                                        }/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="autoSync">Auto Sync</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Automatically sync with Inara
                                        </p>
                                    </div>
                                    <Switch id="autoSync"
                                        checked={
                                            settings.autoSync
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('autoSync', checked)
                                        }/>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Ribbon Settings */}
                        <TabsContent value="ribbons" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultLayout">Default Layout</Label>
                                    <Select value={
                                            settings.defaultLayout
                                        }
                                        onValueChange={
                                            (value) => handleSettingChange('defaultLayout', value)
                                    }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select layout"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="horizontal">Horizontal</SelectItem>
                                            <SelectItem value="vertical">Vertical</SelectItem>
                                            <SelectItem value="grid">Grid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="spacing">Default Spacing: {
                                        settings.defaultSpacing
                                    }px</Label>
                                    <Slider id="spacing"
                                        min={5}
                                        max={20}
                                        step={1}
                                        value={
                                            [settings.defaultSpacing]
                                        }
                                        onValueChange={
                                            ([value]) => handleSettingChange('defaultSpacing', value)
                                        }/>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxRibbonsPerRow">Max Ribbons Per Row: {
                                        settings.maxRibbonsPerRow
                                    }</Label>
                                    <Slider id="maxRibbonsPerRow"
                                        min={3}
                                        max={10}
                                        step={1}
                                        value={
                                            [settings.maxRibbonsPerRow]
                                        }
                                        onValueChange={
                                            ([value]) => handleSettingChange('maxRibbonsPerRow', value)
                                        }/>
                                </div>

                                <Separator/>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="showLabels">Show Labels</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display ribbon names on ribbons
                                        </p>
                                    </div>
                                    <Switch id="showLabels"
                                        checked={
                                            settings.showLabels
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('showLabels', checked)
                                        }/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="showDescriptions">Show Descriptions</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display ribbon descriptions in tooltips
                                        </p>
                                    </div>
                                    <Switch id="showDescriptions"
                                        checked={
                                            settings.showDescriptions
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('showDescriptions', checked)
                                        }/>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Export Settings */}
                        <TabsContent value="export" className="space-y-6 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="defaultFormat">Default Export Format</Label>
                                    <Select value={
                                            settings.defaultFormat
                                        }
                                        onValueChange={
                                            (value) => handleSettingChange('defaultFormat', value)
                                    }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select format"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="svg">SVG (Vector)</SelectItem>
                                            <SelectItem value="png">PNG (Raster)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quality">Default Quality: {
                                        settings.defaultQuality
                                    }%</Label>
                                    <Slider id="quality"
                                        min={50}
                                        max={100}
                                        step={5}
                                        value={
                                            [settings.defaultQuality]
                                        }
                                        onValueChange={
                                            ([value]) => handleSettingChange('defaultQuality', value)
                                        }/>
                                </div>

                                <Separator/>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="includeMetadata">Include Metadata</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Add commander info to exported files
                                        </p>
                                    </div>
                                    <Switch id="includeMetadata"
                                        checked={
                                            settings.includeMetadata
                                        }
                                        onCheckedChange={
                                            (checked) => handleSettingChange('includeMetadata', checked)
                                        }/>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                        <Button variant="outline"
                            onClick={handleReset}
                            disabled={loading}>
                            <RotateCcw className="w-4 h-4 mr-2"/>
                            Reset
                        </Button>
                        <Button onClick={handleSave}
                            disabled={loading}>
                            <Save className="w-4 h-4 mr-2"/>
                            Save Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
