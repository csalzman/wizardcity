// Trying this
import { EventEmitter } from "events";

// A global event emitter for system-wide broadcasts
export const globalBroadcastBroker = new EventEmitter();

// Unique internal event name
export const BROADCAST_EVENT_NAME = "datastar:broadcast";

/**
 * Call this function from ANY endpoint or background worker in your app
 * to instantly update all active Datastar clients.
 */
export async function sendDatastarBroadcast(htmlFragment: string) {
  globalBroadcastBroker.emit(BROADCAST_EVENT_NAME, htmlFragment);
}
