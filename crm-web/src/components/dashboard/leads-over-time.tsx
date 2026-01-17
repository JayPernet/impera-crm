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
        <div className="bg-white border border-marble shadow-sm h-full" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="p-6 border-b border-marble">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Evolução de Leads</h3>
            </div>
            <div className="p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="0" stroke="var(--marble)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--muted)"
                            fontSize={9}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <YAxis
                            stroke="var(--muted)"
                            fontSize={9}
                            fontWeight={700}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
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
                            labelStyle={{ color: 'var(--gold)', marginBottom: '4px', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            cursor={{ stroke: 'var(--marble)', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--champagne-main)"
                            strokeWidth={3}
                            dot={{ fill: 'var(--white)', stroke: 'var(--champagne-main)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'var(--velvet-main)', stroke: 'var(--champagne-light)', strokeWidth: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
