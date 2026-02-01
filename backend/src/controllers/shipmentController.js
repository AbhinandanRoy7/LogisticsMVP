import prisma from '../utils/prisma.js';

export const createShipment = async (req, res) => {
    const { origin, destination } = req.body;
    try {
        const shipment = await prisma.shipment.create({
            data: {
                origin,
                destination,
                created_by: req.user.id,
                logs: {
                    create: {
                        new_status: 'CREATED',
                        updated_by: req.user.id
                    }
                }
            }
        });

        req.app.get('io').emit('shipment_updated', shipment);

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getShipments = async (req, res) => {
    const { status, date_from, date_to, origin, destination } = req.query;
    const where = {};

    if (status) where.status = status;
    if (origin) where.origin = { contains: origin, mode: 'insensitive' };
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };
    if (date_from || date_to) {
        where.created_at = {};
        if (date_from) where.created_at.gte = new Date(date_from);
        if (date_to) where.created_at.lte = new Date(date_to);
    }

    const shipments = await prisma.shipment.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: { logs: true }
    });

    res.json(shipments);
};

export const updateShipmentStatus = async (req, res) => {
    const { id } = req.params;
    const { new_status } = req.body;

    try {
        const oldShipment = await prisma.shipment.findUnique({ where: { id } });
        if (!oldShipment) return res.status(404).json({ error: 'Shipment not found' });

        const shipment = await prisma.shipment.update({
            where: { id },
            data: { status: new_status }
        });

        await prisma.shipmentStatusLog.create({
            data: {
                shipment_id: id,
                old_status: oldShipment.status,
                new_status,
                updated_by: req.user.id
            }
        });

        req.app.get('io').emit('shipment_updated', shipment);

        res.json(shipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
