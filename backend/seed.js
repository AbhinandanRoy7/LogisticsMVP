import prisma from './src/utils/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding data...');

    // Create Admin if not exists
    const password_hash = await bcrypt.hash('password123', 10);
    let admin = await prisma.user.findUnique({ where: { email: 'admin@logistics.com' } });

    if (!admin) {
        admin = await prisma.user.create({
            data: {
                email: 'admin@logistics.com',
                password_hash,
                role: 'ADMIN',
                is_verified: true
            }
        });
        console.log('Created Admin: admin@logistics.com');
    }

    // Clear existing shipments to avoid duplicates/mess (optional, but good for clean slate)
    // await prisma.shipmentStatusLog.deleteMany({});
    // await prisma.shipment.deleteMany({});

    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Mumbai', 'Tokyo', 'Singapore', 'Dubai'];
    const statuses = ['CREATED', 'PICKED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

    const shipments = [];

    for (let i = 0; i < 50; i++) {
        const origin = cities[Math.floor(Math.random() * cities.length)];
        let destination = cities[Math.floor(Math.random() * cities.length)];
        while (destination === origin) destination = cities[Math.floor(Math.random() * cities.length)];

        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const price = Math.floor(Math.random() * 2000) + 100; // Random price 100-2100

        // Random date in last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        shipments.push({
            origin,
            destination,
            status,
            price,
            created_by: admin.id,
            created_at: date,
            updated_at: date
        });
    }

    for (const s of shipments) {
        await prisma.shipment.create({
            data: {
                ...s,
                logs: {
                    create: {
                        new_status: s.status,
                        updated_by: admin.id,
                        updated_at: s.created_at
                    }
                }
            }
        });
    }

    console.log(`Seeded ${shipments.length} shipments.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
