from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set, Any
import json
import logging
from security.auth import decode_token

class ConnectionManager:
    """
    Manages WebSocket connections with role-based routing.
    Types: Unity, Teacher, Debug
    """
    def __init__(self):
        # Room ID -> Set of connections
        self.rooms: Dict[str, Set[WebSocket]] = {}
        # Connection -> Meta (role, client_id, etc)
        self.meta: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, token: str):
        await websocket.accept()
        
        # 1. Validate Token
        payload = decode_token(token)
        if not payload:
            await websocket.close(code=4003)
            return None

        # 2. Assign to Room
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        
        self.meta[websocket] = {
            "room_id": room_id,
            "role": payload.get("role", "student"),
            "client_id": payload.get("sub", "unknown")
        }
        
        return payload

    def disconnect(self, websocket: WebSocket):
        meta = self.meta.get(websocket)
        if meta:
            room_id = meta["room_id"]
            if room_id in self.rooms:
                self.rooms[room_id].remove(websocket)
            del self.meta[websocket]

    async def broadcast_to_room(self, room_id: str, message: dict, exclude_role: str = None):
        """Send message to everyone in the room except potentially a specific role."""
        if room_id not in self.rooms:
            return

        for connection in self.rooms[room_id]:
            meta = self.meta.get(connection)
            if exclude_role and meta and meta["role"] == exclude_role:
                continue
            
            try:
                await connection.send_json(message)
            except Exception as e:
                logging.error(f"Error broadcasting to {meta}: {e}")

    async def send_to_role(self, room_id: str, role: str, message: dict):
        """Send to all clients with a specific role in a room."""
        if room_id not in self.rooms:
            return

        for connection in self.rooms[room_id]:
            meta = self.meta.get(connection)
            if meta and meta["role"] == role:
                await connection.send_json(message)

    def get_room_clients(self, room_id: str) -> List[Dict[str, Any]]:
        if room_id not in self.rooms:
            return []
        return [self.meta[ws] for ws in self.rooms[room_id] if ws in self.meta]

manager = ConnectionManager()
