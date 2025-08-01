import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface PopularityChartProps {
  popularity: number;
  songTitle: string;
}

// Mock data for popularity trend over time
const generateMockData = (currentPopularity: number) => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 12; i++) {
    // Generate some variation around the current popularity
    const variation = (Math.random() - 0.5) * 20;
    const popularity = Math.max(0, Math.min(100, currentPopularity + variation));
    
    data.push({
      month: months[i],
      popularity: Math.round(popularity)
    });
  }
  
  return data;
};

export const PopularityChart = ({ popularity, songTitle }: PopularityChartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const chartData = generateMockData(popularity);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto font-normal">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-16 bg-gradient-to-r from-primary to-secondary h-2 rounded-full relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                style={{ width: `${popularity}%` }}
              />
            </div>
            <span className="font-medium">{popularity}%</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Popularity Trend - {songTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-sm fill-muted-foreground"
              />
              <YAxis 
                domain={[0, 100]}
                className="text-sm fill-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value) => [`${value}%`, 'Popularity']}
              />
              <Line 
                type="monotone" 
                dataKey="popularity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Popularity trend over the last 12 months</p>
          <p className="text-xs mt-1">Data shown is representative for demonstration purposes</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};