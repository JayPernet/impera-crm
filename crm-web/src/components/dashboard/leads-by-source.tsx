"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LeadsBySourceProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--info))',
    'hsl(var(--danger))',
];

export function LeadsBySource({ data }: LeadsBySourceProps) {
    return (
        <div className="luxury-card h-full">
            <div className="p-6 border-b border-white/[0.05]">
                <h3 className="sub-header">Leads por Origem</h3>
            </div>
            <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1A2028',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                color: '#E6EAF0',
                                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#E6EAF0' }}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{
                                fontSize: '11px',
                                fontFamily: 'var(--font-mono)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
