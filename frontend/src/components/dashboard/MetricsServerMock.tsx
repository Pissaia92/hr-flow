'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedChartsMock from '@/components/charts/EnhancedChartsMock';

export default function MetricsServerMock() { 
const [mockMetrics, setMockMetrics] = useState<any>(null); 
const [loading, setLoading] = useState(true); 
const router = useRouter(); 

useEffect(() => {
// Simulate metrics loading
const loadMockMetrics = async () => {
setLoading(true);

// Generate mock data
const mockData = generateMockMetrics();

// Simulate network delay
await new Promise(resolve => setTimeout(resolve, 800));

setMockMetrics(mockData);
setLoading(false);
};

loadMockMetrics();
}, []);

// Function to generate simulated data
const generateMockMetrics = () => {
// Simulated data for the period 03/25 to 08/25
const evolution = [
{ date: '2025-03', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 },
{ date: '2025-04', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 },
{ date: '2025-05', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 },
{ date: '2025-06', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 }, 
{ date: '2025-07', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 }, 
{ date: '2025-08', count: Math.floor(Math.random() * (44 - 23 + 1)) + 23 } 
]; 

// Calculate totals based on evolution 
const total = evolution.reduce((sum, month) => sum + month.count, 0); 

// Priority distribution (based on total)
const byPriority = {
urgent: Math.floor(total * 0.15), // 15% urgent
important: Math.floor(total * 0.35), // 35% important
normal: total - Math.floor(total * 0.15) - Math.floor(total * 0.35) // Remaining normal
};

// Status distribution (based on total)
const byStatus = {
open: Math.floor(total * 0.25), // 25% open
in_progress: Math.floor(total * 0.35), // 35% in progress
closed: total - Math.floor(total * 0.25) - Math.floor(total * 0.35) // Remaining closed
};

return { 
total, 
byPriority, 
byStatus, 
evolution 
}; 
}; 

if (loading) { 
return ( 
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"> 
<div className="flex justify-center items-center h-40"> 
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div> 
</div> 
</div> 
); 
} 

if (!mockMetrics) { 
return ( 
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"> 
<p className="text-gray-500 dark:text-gray-400">No metrics available</p> 
</div> 
); 
}

// Use the EnhancedChartsMock component with mock data
return (
<div className="space-y-8">
<EnhancedChartsMock useMockData={true} />
</div>
);
}