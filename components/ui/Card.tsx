import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'convex' | 'concave' | 'pressed';
}

export function Card({ className, variant = 'convex', ...props }: CardProps) {
  const variantClasses = {
    flat: 'neu-flat',
    convex: 'neu-convex',
    concave: 'neu-concave',
    pressed: 'neu-pressed'
  };

  return (
    <div
      className={cn('neu-card', variantClasses[variant], className)}
      {...props}
    />
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('p-6 pb-4', className)}
      {...props}
    />
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('p-6 pt-4', className)}
      {...props}
    />
  );
} 