import { Injectable, Logger } from '@nestjs/common';
import { Card, Connection } from './canvas.gateway';

interface DesignState {
  id: string;
  cards: Card[];
  connections: Connection[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CanvasService {
  private logger = new Logger('CanvasService');
  private designStates: Map<string, DesignState> = new Map();

  async getDesignState(designId: string): Promise<DesignState> {
    if (!this.designStates.has(designId)) {
      this.designStates.set(designId, {
        id: designId,
        cards: [],
        connections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return this.designStates.get(designId);
  }

  async addCard(designId: string, card: Card): Promise<void> {
    const design = await this.getDesignState(designId);
    // Avoid duplicates
    const index = design.cards.findIndex((c) => c.id === card.id);
    if (index !== -1) {
      design.cards[index] = card;
    } else {
      design.cards.push(card);
    }
    design.updatedAt = new Date();
    this.logger.debug(`Card ${card.id} added to design ${designId}`);
  }

  async updateCard(
    designId: string,
    cardId: string,
    updates: Partial<Card>,
  ): Promise<void> {
    const design = await this.getDesignState(designId);
    const cardIndex = design.cards.findIndex((c) => c.id === cardId);
    if (cardIndex !== -1) {
      design.cards[cardIndex] = { ...design.cards[cardIndex], ...updates };
      design.updatedAt = new Date();
      this.logger.debug(`Card ${cardId} updated in design ${designId}`);
    }
  }

  async deleteCard(designId: string, cardId: string): Promise<void> {
    const design = await this.getDesignState(designId);
    // Delete card
    design.cards = design.cards.filter((c) => c.id !== cardId);
    // Delete connections related to this card
    design.connections = design.connections.filter(
      (conn) => conn.from !== cardId && conn.to !== cardId,
    );
    design.updatedAt = new Date();
    this.logger.debug(
      `Card ${cardId} and related connections deleted from design ${designId}`,
    );
  }

  async moveCard(
    designId: string,
    cardId: string,
    x: number,
    y: number,
  ): Promise<void> {
    const design = await this.getDesignState(designId);
    const card = design.cards.find((c) => c.id === cardId);
    if (card) {
      card.x = x;
      card.y = y;
      design.updatedAt = new Date();
      this.logger.debug(`Card ${cardId} moved to (${x}, ${y})`);
    }
  }

  async addConnection(designId: string, connection: Connection): Promise<void> {
    const design = await this.getDesignState(designId);
    // Avoid duplicates
    const index = design.connections.findIndex((c) => c.id === connection.id);
    if (index !== -1) {
      design.connections[index] = connection;
    } else {
      design.connections.push(connection);
    }
    design.updatedAt = new Date();
    this.logger.debug(
      `Connection ${connection.id} added to design ${designId}`,
    );
  }

  async deleteConnection(
    designId: string,
    connectionId: string,
  ): Promise<void> {
    const design = await this.getDesignState(designId);
    design.connections = design.connections.filter(
      (c) => c.id !== connectionId,
    );
    design.updatedAt = new Date();
    this.logger.debug(
      `Connection ${connectionId} deleted from design ${designId}`,
    );
  }

  async loadDesign(
    designId: string,
    cards: Card[],
    connections: Connection[],
  ): Promise<void> {
    this.designStates.set(designId, {
      id: designId,
      cards,
      connections,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.logger.debug(
      `Design ${designId} loaded with ${cards.length} cards and ${connections.length} connections`,
    );
  }

  async clearDesign(designId: string): Promise<void> {
    const design = await this.getDesignState(designId);
    design.cards = [];
    design.connections = [];
    design.updatedAt = new Date();
    this.logger.debug(`Design ${designId} cleared`);
  }

  async saveDesign(designId: string): Promise<DesignState> {
    const design = await this.getDesignState(designId);
    design.updatedAt = new Date();
    // TODO: Persist to MongoDB when database is configured
    this.logger.debug(`Design ${designId} saved at ${design.updatedAt}`);
    return design;
  }
}
