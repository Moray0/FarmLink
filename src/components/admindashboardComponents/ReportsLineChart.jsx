import React from 'react';

// Line graph for the Reports page
export const ReportsLineChart = ({ data }) => {
    const width = 700;
    const height = 300;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 45;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxValue = Math.max(
        1,
        ...data.flatMap((day) => [
            day.users,
            day.products,
            day.orders,
        ])
    );

    const getX = (index) =>
        paddingLeft +
        (data.length > 1
            ? (index / (data.length - 1)) * chartWidth
            : chartWidth / 2);

    const getY = (value) =>
        paddingTop + chartHeight - (value / maxValue) * chartHeight;

    const lines = [
        { key: 'users', label: 'Users', color: '#2563eb' },
        { key: 'products', label: 'Products', color: '#16a34a' },
        { key: 'orders', label: 'Orders', color: '#9333ea' },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 mb-4">
                {lines.map((line) => (
                    <div
                        key={line.key}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: line.color }}
                        />
                        {line.label}
                    </div>
                ))}
            </div>

            <div className="w-full overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full min-w-125"
                    role="img"
                    aria-label="Daily user registrations, product listings, and orders over the last seven days"
                >
                    {Array.from({ length: 5 }, (_, index) => {
                        const value = Math.round((maxValue * index) / 4);
                        const y = getY(value);

                        return (
                            <g key={index}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={width - paddingRight}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={paddingLeft - 10}
                                    y={y + 4}
                                    fontSize="11"
                                    fill="#6b7280"
                                    textAnchor="end"
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    {data.map((day, index) => (
                        <text
                            key={day.label}
                            x={getX(index)}
                            y={height - 15}
                            fontSize="10"
                            fill="#6b7280"
                            textAnchor="middle"
                        >
                            {day.label}
                        </text>
                    ))}

                    {lines.map((line) => {
                        const points = data
                            .map(
                                (day, index) =>
                                    `${getX(index)},${getY(day[line.key])}`
                            )
                            .join(' ');

                        return (
                            <g key={line.key}>
                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {data.map((day, index) => (
                                    <circle
                                        key={`${line.key}-${index}`}
                                        cx={getX(index)}
                                        cy={getY(day[line.key])}
                                        r="4"
                                        fill={line.color}
                                    >
                                        <title>
                                            {`${day.label}: ${line.label}: ${day[line.key]}`}
                                        </title>
                                    </circle>
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

