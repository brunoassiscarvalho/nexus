import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CanvasService } from './canvas.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Card {
  id: string;
  type:
    | 'api'
    | 'database'
    | 'service'
    | 'frontend'
    | 'backend'
    | 'queue'
    | 'cache'
    | 'loadbalancer';
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('CanvasGateway');
  private activeConnections: Map<
    string,
    { socket: Socket; userId?: string; designId?: string }
  > = new Map();

  private getRoomId(designId: string): string {
    return `design:${designId}`;
  }

  constructor(
    private canvasService: CanvasService,
    private configService: ConfigService,
  ) {}

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
    this.activeConnections.set(socket.id, { socket });
  }

  handleDisconnect(socket: Socket) {
    const connection = this.activeConnections.get(socket.id);
    if (connection?.designId) {
      this.logger.log(
        `Client disconnected from design ${connection.designId}: ${socket.id}`,
      );
    } else {
      this.logger.log(`Client disconnected: ${socket.id}`);
    }
    this.activeConnections.delete(socket.id);
  }

  // Join a design room for collaborative editing
  @SubscribeMessage('join-design')
  async handleJoinDesign(
    socket: Socket,
    data: { designId: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    socket.join(roomId);
    this.activeConnections.set(socket.id, {
      socket,
      userId: data.userId,
      designId: data.designId,
    });

    // Get current design state
    const designState = await this.canvasService.getDesignState(data.designId);

    // Send current state to new client
    socket.emit('design-state', designState);

    // Notify others that user joined
    this.server.to(roomId).emit('user-joined', {
      userId: data.userId,
      socketId: socket.id,
    });

    this.logger.log(
      `User ${data.userId || 'anonymous'} joined design: ${data.designId}`,
    );
  }

  // Leave a design room
  @SubscribeMessage('leave-design')
  handleLeaveDesign(
    socket: Socket,
    data: { designId: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    socket.leave(roomId);
    const connection = this.activeConnections.get(socket.id);
    if (connection) {
      connection.designId = undefined;
    }

    // Notify others that user left
    this.server.to(roomId).emit('user-left', {
      userId: data.userId,
      socketId: socket.id,
    });

    this.logger.log(
      `User ${data.userId || 'anonymous'} left design: ${data.designId}`,
    );
  }

  // Add card to canvas
  @SubscribeMessage('add-card')
  async handleAddCard(
    socket: Socket,
    data: { designId: string; card: Card; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.addCard(data.designId, data.card);

    // Broadcast to all clients in the design
    this.server.to(roomId).emit('card-added', {
      card: data.card,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Update card on canvas
  @SubscribeMessage('update-card')
  async handleUpdateCard(
    socket: Socket,
    data: {
      designId: string;
      id: string;
      updates: Partial<Card>;
      userId?: string;
    },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.updateCard(data.designId, data.id, data.updates);

    this.server.to(roomId).emit('card-updated', {
      id: data.id,
      updates: data.updates,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Delete card from canvas
  @SubscribeMessage('delete-card')
  async handleDeleteCard(
    socket: Socket,
    data: { designId: string; id: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.deleteCard(data.designId, data.id);

    this.server.to(roomId).emit('card-deleted', {
      id: data.id,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Move card on canvas (drag)
  @SubscribeMessage('move-card')
  async handleMoveCard(
    socket: Socket,
    data: {
      designId: string;
      id: string;
      x: number;
      y: number;
      userId?: string;
    },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.moveCard(data.designId, data.id, data.x, data.y);

    this.server.to(roomId).emit('card-moved', {
      id: data.id,
      x: data.x,
      y: data.y,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Add connection between cards
  @SubscribeMessage('add-connection')
  async handleAddConnection(
    socket: Socket,
    data: { designId: string; connection: Connection; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.addConnection(data.designId, data.connection);

    this.server.to(roomId).emit('connection-added', {
      connection: data.connection,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Delete connection
  @SubscribeMessage('delete-connection')
  async handleDeleteConnection(
    socket: Socket,
    data: { designId: string; id: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.deleteConnection(data.designId, data.id);

    this.server.to(roomId).emit('connection-deleted', {
      id: data.id,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Load design (replaces entire canvas state)
  @SubscribeMessage('load-design')
  async handleLoadDesign(
    socket: Socket,
    data: {
      designId: string;
      cards: Card[];
      connections: Connection[];
      userId?: string;
    },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.loadDesign(
      data.designId,
      data.cards,
      data.connections,
    );

    this.server.to(roomId).emit('design-loaded', {
      designId: data.designId,
      cards: data.cards,
      connections: data.connections,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Clear canvas
  @SubscribeMessage('clear-canvas')
  async handleClearCanvas(
    socket: Socket,
    data: { designId: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    await this.canvasService.clearDesign(data.designId);

    this.server.to(roomId).emit('canvas-cleared', {
      designId: data.designId,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Save design
  @SubscribeMessage('save-design')
  async handleSaveDesign(
    socket: Socket,
    data: { designId: string; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    const result = await this.canvasService.saveDesign(data.designId);

    this.server.to(roomId).emit('design-saved', {
      designId: data.designId,
      savedAt: result.updatedAt,
      userId: data.userId,
      timestamp: Date.now(),
    });
  }

  // Get connected users for a design
  @SubscribeMessage('get-connected-users')
  handleGetConnectedUsers(socket: Socket, data: { designId: string }) {
    const roomId = this.getRoomId(data.designId);
    const users = Array.from(this.activeConnections.entries())
      .filter(([_, conn]) => conn.socket.rooms.has(roomId))
      .map(([socketId, conn]) => ({
        socketId,
        userId: conn.userId,
      }));

    socket.emit('connected-users', users);
  }

  // Broadcast cursor position (real-time collaboration feedback)
  @SubscribeMessage('cursor-move')
  handleCursorMove(
    socket: Socket,
    data: { designId: string; x: number; y: number; userId?: string },
  ) {
    const roomId = this.getRoomId(data.designId);
    socket.broadcast.to(roomId).emit('cursor-moved', {
      socketId: socket.id,
      userId: data.userId,
      x: data.x,
      y: data.y,
      timestamp: Date.now(),
    });
  }
}
