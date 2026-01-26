import { useEffect, useRef, useState } from 'react';

const WS_BASE_URL = 'ws://localhost:8000/ws/v1/classroom';

export const useClassroomWS = (roomId: string, token: string) => {
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!roomId || !token) return;

        const url = `${WS_BASE_URL}/${roomId}?token=${token}`;
        console.log(`Connecting to WS: ${url}`);

        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
            console.log('WS Connected');
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WS Message:', data);
                setLastMessage(data);
            } catch (err) {
                console.error('WS Parse Error:', err);
            }
        };

        socket.onclose = () => {
            console.log('WS Disconnected');
            setIsConnected(false);
        };

        socket.onerror = (err) => {
            console.error('WS Error:', err);
        };

        return () => {
            socket.close();
        };
    }, [roomId, token]);

    const sendMessage = (message: any) => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify(message));
        }
    };

    return { lastMessage, isConnected, sendMessage };
};
