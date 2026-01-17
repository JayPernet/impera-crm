"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LeadsBySourceProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

const COLORS = [
    'var(--velvet-main)',
    'var(--champagne-main)',
    'var(--slate)',
    'var(--silk)',
    'var(--velvet-light)',
];

export function LeadsBySource({ data }: LeadsBySourceProps) {
    return (
        <div className="bg-white border border-marble shadow-sm h-full" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="p-6 border-b border-marble">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Leads por Origem</h3>
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
                                backgroundColor: 'var(--white)',
                                border: '1px solid var(--marble)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: 'var(--velvet-main)',
                                boxShadow: 'var(--shadow-level2)'
                            }}
                            itemStyle={{ color: 'var(--velvet-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="rect"
                            iconSize={10}
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '9px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--slate)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
