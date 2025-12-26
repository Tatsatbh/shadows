"use client"

import { motion } from "motion/react"
import { useMemo, useState } from "react"

interface Dimension {
    label: string
    score: number
    maxScore: number
}

interface RadarChartProps {
    dimensions: Dimension[]
    size?: number
    animated?: boolean
    onDimensionClick?: (index: number) => void
    activeDimension?: number | null
}

export function RadarChart({
    dimensions,
    size = 280,
    animated = true,
    onDimensionClick,
    activeDimension
}: RadarChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const center = size / 2
    const outerRadius = size * 0.38
    const innerRadius = size * 0.18 // Increased from 0.12 to 0.18 for more breathing room
    const radiusRange = outerRadius - innerRadius
    const labelRadius = size * 0.48

    // Calculate points for the polygon
    const { axisPoints, dataPoints, labelPositions, axisStartPoints } = useMemo(() => {
        const angleStep = (2 * Math.PI) / dimensions.length
        const startAngle = -Math.PI / 2 // Start from top

        const axisPoints: { x: number; y: number }[] = []
        const axisStartPoints: { x: number; y: number }[] = []
        const dataPoints: { x: number; y: number }[] = []
        const labelPositions: { x: number; y: number; anchor: string }[] = []

        dimensions.forEach((dim, i) => {
            const angle = startAngle + i * angleStep
            const normalizedScore = dim.score / dim.maxScore

            // Calculate radius based on score, mapping 0 -> innerRadius, 1 -> outerRadius
            const scoreRadius = innerRadius + (normalizedScore * radiusRange)

            // Axis endpoint (full radius)
            axisPoints.push({
                x: center + outerRadius * Math.cos(angle),
                y: center + outerRadius * Math.sin(angle)
            })

            // Axis start point (inner radius)
            axisStartPoints.push({
                x: center + innerRadius * Math.cos(angle),
                y: center + innerRadius * Math.sin(angle)
            })

            // Data point
            dataPoints.push({
                x: center + scoreRadius * Math.cos(angle),
                y: center + scoreRadius * Math.sin(angle)
            })

            // Label position (outside the chart)
            const lx = center + labelRadius * Math.cos(angle)
            const ly = center + labelRadius * Math.sin(angle)
            let anchor = "middle"
            if (Math.cos(angle) < -0.1) anchor = "end"
            else if (Math.cos(angle) > 0.1) anchor = "start"

            labelPositions.push({ x: lx, y: ly, anchor })
        })

        return { axisPoints, dataPoints, labelPositions, axisStartPoints }
    }, [dimensions, center, outerRadius, innerRadius, radiusRange, labelRadius])

    // Create SVG path for data polygon
    const dataPath = useMemo(() => {
        if (dataPoints.length === 0) return ""
        return dataPoints
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ") + " Z"
    }, [dataPoints])

    // Calculate average score for color
    const avgScore = useMemo(() => {
        const total = dimensions.reduce((sum, d) => sum + d.score / d.maxScore, 0)
        return total / dimensions.length
    }, [dimensions])

    // Gradient colors based on performance
    const gradientId = `radar-gradient-${size}`
    const glowId = `radar-glow-${size}`

    const getScoreColor = (score: number, maxScore: number) => {
        const ratio = score / maxScore
        if (ratio >= 0.8) return "text-emerald-400"
        if (ratio >= 0.6) return "text-blue-400"
        if (ratio >= 0.4) return "text-yellow-400"
        return "text-red-400"
    }

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="overflow-visible">
                <defs>
                    {/* Gradient fill based on score */}
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        {avgScore >= 0.6 ? (
                            <>
                                <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
                            </>
                        ) : avgScore >= 0.4 ? (
                            <>
                                <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.6" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="rgb(248, 113, 113)" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.6" />
                            </>
                        )}
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background rings */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((progress, i) => {
                    // Interpolate radius for each ring
                    const ringRadius = innerRadius + (progress * radiusRange)
                    // Create points for the ring
                    const ringPoints = axisPoints.map((_, idx) => {
                        const angle = (-Math.PI / 2) + idx * ((2 * Math.PI) / dimensions.length)
                        return `${center + ringRadius * Math.cos(angle)},${center + ringRadius * Math.sin(angle)}`
                    }).join(" ")

                    return (
                        <polygon
                            key={i}
                            points={ringPoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-border opacity-40"
                        />
                    )
                })}

                {/* Axis lines */}
                {axisPoints.map((point, i) => (
                    <line
                        key={i}
                        x1={axisStartPoints[i].x}
                        y1={axisStartPoints[i].y}
                        x2={point.x}
                        y2={point.y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border opacity-40"
                    />
                ))}

                {/* Data polygon with animation */}
                <motion.path
                    d={dataPath}
                    fill={`url(#${gradientId})`}
                    stroke={avgScore >= 0.6 ? "rgb(52, 211, 153)" : avgScore >= 0.4 ? "rgb(251, 191, 36)" : "rgb(248, 113, 113)"}
                    strokeWidth="2"
                    filter={`url(#${glowId})`}
                    initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ transformOrigin: `${center}px ${center}px` }}
                />

                {/* Data points (dots) */}
                {dataPoints.map((point, i) => (
                    <motion.circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r={hoveredIndex === i || activeDimension === i ? 8 : 5}
                        fill={avgScore >= 0.6 ? "rgb(52, 211, 153)" : avgScore >= 0.4 ? "rgb(251, 191, 36)" : "rgb(248, 113, 113)"}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        initial={animated ? { opacity: 0, scale: 0 } : undefined}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onDimensionClick?.(i)}
                        style={{ filter: (hoveredIndex === i || activeDimension === i) ? "drop-shadow(0 0 8px currentColor)" : undefined }}
                    />
                ))}

                {/* Labels */}
                {labelPositions.map((pos, i) => {
                    const isActive = hoveredIndex === i || activeDimension === i
                    const scoreColorClass = getScoreColor(dimensions[i].score, dimensions[i].maxScore)

                    return (
                        <g key={i}>
                            <motion.text
                                x={pos.x}
                                y={pos.y}
                                textAnchor={pos.anchor}
                                dominantBaseline="middle"
                                className={`text-xs font-medium fill-current cursor-pointer transition-colors ${isActive ? scoreColorClass : "text-muted-foreground"
                                    }`}
                                initial={animated ? { opacity: 0 } : undefined}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => onDimensionClick?.(i)}
                            >
                                {dimensions[i].label}
                                {isActive && ` · ${dimensions[i].score}/${dimensions[i].maxScore}`}
                            </motion.text>
                        </g>
                    )
                })}

                {/* Center score */}
                <motion.text
                    x={center}
                    y={center - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold fill-current text-foreground"
                    initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {Math.round(avgScore * 100)}%
                </motion.text>
                <motion.text
                    x={center}
                    y={center + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-current text-muted-foreground uppercase tracking-wider"
                    initial={animated ? { opacity: 0 } : undefined}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Overall
                </motion.text>
            </svg>
        </div>
    )
}
