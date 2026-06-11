const EventEmitter = require("events");

class RealtimeService extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map(); // residentId -> Set of res objects
  }

  registerClient(residentId, res) {
    if (!this.clients.has(residentId)) {
      this.clients.set(residentId, new Set());
    }
    this.clients.get(residentId).add(res);

    res.on("close", () => {
      const userClients = this.clients.get(residentId);
      if (userClients) {
        userClients.delete(res);
        if (userClients.size === 0) {
          this.clients.delete(residentId);
        }
      }
    });
  }

  sendToResident(residentId, eventName, data) {
    const userClients = this.clients.get(residentId);
    if (userClients) {
      const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
      userClients.forEach((res) => {
        try {
          res.write(payload);
        } catch (err) {
          console.error("Failed to write to client SSE stream:", err.message);
        }
      });
    }
  }

  broadcast(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((userClients) => {
      userClients.forEach((res) => {
        try {
          res.write(payload);
        } catch (err) {
          console.error("Failed to write to broadcast client SSE stream:", err.message);
        }
      });
    });
  }
}

module.exports = new RealtimeService();
