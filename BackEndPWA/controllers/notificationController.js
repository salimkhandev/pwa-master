const webPush = require('web-push');
const db = require('../config/dbconfig');

const vapidKeys = {
    publicKey: 'BDAcqYXV4SuunGqlTEsfrvyUF11s43wyDYZdtAPBN1iUw3zVPr4LrJJ_bD-ibBWe6C8fAosU7XBtLjgXkA0Prr8',
    privateKey: 'aXh-fSON5yZrlOSIz3-33hibIA2ItuwGsMaTKluDtrg'
};

// Configure web-push with your VAPID keys
webPush.setVapidDetails(
    'mailto:test@test.com',  // Add a valid email here
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// First, drop the existing table (since it's not properly set up)
const dropTableQuery = `
    DROP TABLE IF EXISTS push_subscriptions;
`;

// Then create the table with proper constraints
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_endpoint UNIQUE (endpoint)
    );
`;

exports.subscribe = async (req, res) => {
    try {
        console.log('Received subscription:', req.body);
        const subscription = req.body;
        
        // Drop and recreate table with proper constraints
        await db.query(dropTableQuery);
        await db.query(createTableQuery);
        
        // Then store subscription
        const query = `
            INSERT INTO push_subscriptions (endpoint, p256dh, auth)
            VALUES ($1, $2, $3)
            ON CONFLICT (endpoint) DO UPDATE 
            SET p256dh = $2, auth = $3
            RETURNING *
        `;
        
        const result = await db.query(query, [
            subscription.endpoint,
            subscription.keys.p256dh,
            subscription.keys.auth
        ]);

        console.log('Subscription saved:', result.rows[0]);
        res.status(201).json({ message: 'Subscription added successfully' });
    } catch (error) {
        console.error('Detailed subscription error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.sendNotification = async (req, res) => {
    try {
        console.log('Sending notification:', req.body);
        const { title, body } = req.body;
        
        const { rows: subscriptions } = await db.query('SELECT * FROM push_subscriptions');
        console.log('Found subscriptions:', subscriptions.length);
        
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: 'No subscriptions found' });
        }

        const notificationPromises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            
            try {
                await webPush.sendNotification(
                    pushSubscription,
                    JSON.stringify({ title, body })
                );
            } catch (error) {
                if (error.statusCode === 410) {
                    // Subscription has expired or been unsubscribed
                    console.log('Removing expired subscription:', sub.endpoint);
                    await db.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
                }
                return error;
            }
        });

        await Promise.all(notificationPromises);
        res.json({ message: 'Notifications processed' });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({ error: error.message });
    }
}; 