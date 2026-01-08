"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LeadsOverTimeProps {
    data: Array<{
        date: string;
        count: number;
    }>;
}

export function LeadsOverTime({ data }: LeadsOverTimeProps) {
    return (
        <div className="luxury-card h-full">
            <div className="p-6 border-b border-white/[0.05]">
                <h3 className="sub-header">Evolução de Leads</h3>
            </div>
            <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3744" opacity={0.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9AA4B2"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            fontFamily="var(--font-mono)"
                        />
                        <YAxis
                            stroke="#9AA4B2"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                            fontFamily="var(--font-mono)"
                        />
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
                            labelStyle={{ color: '#9AA4B2', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--gold)"
                            strokeWidth={3}
                            dot={{ fill: '#0B1215', stroke: 'var(--gold)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'var(--gold)', stroke: 'rgba(201,162,77,0.3)', strokeWidth: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
