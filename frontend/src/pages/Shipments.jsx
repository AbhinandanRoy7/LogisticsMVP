import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Shipments() {
    const [shipments, setShipments] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const { token, role } = useAuth();

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const res = await axios.get(`${API_URL}/shipments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setShipments(res.data);
            } catch (e) { console.error(e); }
        };
        fetchShipments();

        const socket = io(API_URL);
        socket.on('shipment_updated', (updatedShipment) => {
            setShipments(prev => {
                const idx = prev.findIndex(s => s.id === updatedShipment.id);
                if (idx === -1) return [updatedShipment, ...prev];
                const newArr = [...prev];
                newArr[idx] = updatedShipment;
                return newArr;
            });
        });

        return () => socket.disconnect();
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/shipments`, { origin, destination }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrigin('');
            setDestination('');
        } catch (err) {
            alert('Failed to create shipment');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`${API_URL}/shipments/${id}/status`, { new_status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Shipments</h1>
                <Link to="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
            </div>

            {role === 'ADMIN' && (
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreate} className="flex gap-4 items-end">
                            <div className="grid gap-2 flex-1">
                                <label className="text-sm font-medium">Origin</label>
                                <Input placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} required />
                            </div>
                            <div className="grid gap-2 flex-1">
                                <label className="text-sm font-medium">Destination</label>
                                <Input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} required />
                            </div>
                            <Button type="submit">Create Shipment</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {shipments.map(shipment => (
                    <Card key={shipment.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-bold text-lg">{shipment.origin} → {shipment.destination}</p>
                                <div className="flex gap-2 items-center mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            shipment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {shipment.status}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(shipment.updated_at).toLocaleString()}</span>
                                </div>
                            </div>
                            {role === 'ADMIN' && (
                                <div className="space-x-2">
                                    {['PICKED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map(status => (
                                        <Button
                                            key={status}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(shipment.id, status)}
                                            disabled={shipment.status === status || shipment.status === 'DELIVERED' || shipment.status === 'CANCELLED'}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {shipments.length === 0 && <p className="text-center text-gray-500">No shipments found.</p>}
            </div>
        </div>
    );
}
