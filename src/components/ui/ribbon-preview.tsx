'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { motion } from 'framer-motion';

interface Ribbon {
  id: string;
  name: string;
  description?: string;
  level: number;
  type: string;
  color: string;
  icon?: string;
}

interface RibbonPreviewProps {
  ribbons: Ribbon[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  spacing?: number;
  showLabels?: boolean;
  showDescriptions?: boolean;
  maxRibbonsPerRow?: number;
  className?: string;
  interactive?: boolean;
  onRibbonClick?: (ribbon: Ribbon) => void;
}

export function RibbonPreview({
  ribbons,
  layout = 'horizontal',
  spacing = 10,
  showLabels = true,
  showDescriptions: _showDescriptions = false,
  maxRibbonsPerRow = 5,
  className,
  interactive = false,
  onRibbonClick,
}: RibbonPreviewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const ribbonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const renderRibbon = (ribbon: Ribbon, _index: number) => (
    <motion.div
      key={ribbon.id}
      variants={ribbonVariants}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      className={cn(
        'relative group',
        interactive && 'cursor-pointer'
      )}
      onClick={() => interactive && onRibbonClick?.(ribbon)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'relative rounded-md border-2 border-gray-200 dark:border-gray-700',
                'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
                'shadow-sm hover:shadow-md transition-all duration-200',
                interactive && 'hover:border-primary/50'
              )}
              style={{
                backgroundColor: ribbon.color,
                minHeight: '60px',
                minWidth: '120px',
              }}
            >
              {/* Ribbon content */}
              <div className="flex items-center justify-center h-full p-2">
                {ribbon.icon && (
                  <span className="text-white text-lg font-bold mr-2">
                    {ribbon.icon}
                  </span>
                )}
                {showLabels && (
                  <span className="text-white text-xs font-medium text-center">
                    {ribbon.name}
                  </span>
                )}
              </div>

              {/* Level badge */}
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 text-xs"
              >
                {ribbon.level}
              </Badge>

              {/* Type badge */}
              <Badge
                variant="outline"
                className="absolute -bottom-2 -left-2 text-xs"
              >
                {ribbon.type}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">{ribbon.name}</p>
              {ribbon.description && (
                <p className="text-sm text-muted-foreground">
                  {ribbon.description}
                </p>
              )}
              <div className="flex gap-2 text-xs">
                <span>Level: {ribbon.level}</span>
                <span>Type: {ribbon.type}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );

  const renderHorizontalLayout = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-2"
      style={{ gap: `${spacing}px` }}
    >
      {ribbons.map((ribbon, index) => renderRibbon(ribbon, index))}
    </motion.div>
  );

  const renderVerticalLayout = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-2"
      style={{ gap: `${spacing}px` }}
    >
      {ribbons.map((ribbon, index) => renderRibbon(ribbon, index))}
    </motion.div>
  );

  const renderGridLayout = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-2"
      style={{
        gap: `${spacing}px`,
        gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`,
        maxWidth: `${maxRibbonsPerRow * (120 + spacing) - spacing}px`,
      }}
    >
      {ribbons.map((ribbon, index) => renderRibbon(ribbon, index))}
    </motion.div>
  );

  return (
    <Card className={cn('p-4', className)}>
      <CardContent className="p-0">
        {layout === 'horizontal' && renderHorizontalLayout()}
        {layout === 'vertical' && renderVerticalLayout()}
        {layout === 'grid' && renderGridLayout()}
      </CardContent>
    </Card>
  );
}
