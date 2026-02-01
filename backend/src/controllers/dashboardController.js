import prisma from '../utils/prisma.js';

export const getMetrics = async (req, res) => {
    try {
        const [total, active, delivered, cancelled, revenueAgg] = await Promise.all([
            prisma.shipment.count(),
            prisma.shipment.count({ where: { status: { in: ['CREATED', 'PICKED', 'IN_TRANSIT'] } } }),
            prisma.shipment.count({ where: { status: 'DELIVERED' } }),
            prisma.shipment.count({ where: { status: 'CANCELLED' } }),
            prisma.shipment.aggregate({
                _sum: { price: true }
            })
        ]);

        // Get chart data: Shipments & Revenue by day (last 7 days usually, but lets do all time grouped by date)
        // Prisma group by date is a bit tricky, so we'll fetch meaningful data and aggregate in JS or use raw query.
        // For MVP/Demo: Fetch last 100 shipments and group by date manually.
        const lastShipments = await prisma.shipment.findMany({
            take: 100,
            orderBy: { created_at: 'asc' },
            select: { created_at: true, price: true }
        });

        const chartData = {};
        lastShipments.forEach(s => {
            const date = s.created_at.toISOString().split('T')[0];
            if (!chartData[date]) chartData[date] = { date, revenue: 0, shipments: 0 };
            chartData[date].revenue += s.price;
            chartData[date].shipments += 1;
        });

        res.json({
            total_shipments: total,
            active_shipments: active,
            delivered_shipments: delivered,
            cancelled_shipments: cancelled,
            total_revenue: revenueAgg._sum.price || 0,
            chart_data: Object.values(chartData)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
