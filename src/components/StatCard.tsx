
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  bgColor?: string;
}

export function StatCard({ title, value, icon, description, bgColor = "bg-white" }: StatCardProps) {
  return (
    <Card className={`${bgColor} border-none shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dental-charcoal">{title}</p>
            <p className="text-3xl font-bold text-dental-gray">{value}</p>
            <p className="text-xs text-dental-silver mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
