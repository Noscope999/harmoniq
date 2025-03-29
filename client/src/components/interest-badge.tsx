import { Badge } from "@/components/ui/badge";

interface InterestBadgeProps {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function InterestBadge({ 
  label, 
  variant = "primary", 
  className = ""
}: InterestBadgeProps) {
  const baseClasses = "px-3 py-1 rounded-full";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary hover:from-primary/15 hover:to-primary/25 border-primary/30",
    secondary: "bg-gradient-to-r from-secondary/10 to-secondary/20 text-secondary hover:from-secondary/15 hover:to-secondary/25 border-secondary/30"
  };
  
  return (
    <Badge
      variant="outline" 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {label}
    </Badge>
  );
}
