import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

interface PopularityChartProps {
  popularity: number;
  songTitle: string;
  releaseDate: string;
}

// Mock data for popularity trend over time
const generateMockData = (currentPopularity: number, selectedYear: number, releaseDate: string) => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const releaseYear = new Date(releaseDate).getFullYear();
  
  // Only show data from release year onwards
  if (selectedYear < releaseYear) {
    return [];
  }
  
  const endMonth = selectedYear === currentYear ? currentMonth : 11;
  
  for (let i = 0; i <= endMonth; i++) {
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

export const PopularityChart = ({ popularity, songTitle, releaseDate }: PopularityChartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const releaseYear = new Date(releaseDate).getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const chartData = generateMockData(popularity, selectedYear, releaseDate);
  
  // Generate available years (from release year to current year)
  const availableYears = [];
  for (let year = releaseYear; year <= currentYear; year++) {
    availableYears.push(year);
  }

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
        
        <div className="mb-4">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
          <p>Popularity trend for {selectedYear} {selectedYear === currentYear ? '(up to current month)' : ''}</p>
          <p className="text-xs mt-1">Data shown is representative for demonstration purposes</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};