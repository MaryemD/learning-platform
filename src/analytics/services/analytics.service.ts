import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { SessionEvent } from '../dto/session-event.dto';

interface SessionData {
  activeStudents: Set<string>;
}

/**
 * Core analytics service that manages session event streams
 */
@Injectable()
export class AnalyticsService {
  private sessionEvents = new Map<string, Subject<SessionEvent>>();
  private sessionData = new Map<string, SessionData>();

  /**
   * Initialize a session
   */
  initSession(sessionId: string): void {
    if (!this.sessionEvents.has(sessionId)) {
      this.sessionEvents.set(sessionId, new Subject<SessionEvent>());
    }

    if (!this.sessionData.has(sessionId)) {
      this.sessionData.set(sessionId, {
        activeStudents: new Set<string>(),
      });
    }
  }

  /**
   * Subscribe to session events
   */
  subscribeToSession(sessionId: string): Observable<SessionEvent> {
    this.initSession(sessionId);
    return this.sessionEvents.get(sessionId)!.asObservable();
  }

  /**
   * Emit a session event
   */
  emitSessionEvent(event: SessionEvent): void {
    const { sessionId } = event;
    this.initSession(sessionId);

    const sessionData = this.sessionData.get(sessionId)!;
    sessionData.activeStudents.add(event.studentId);

    const subject = this.sessionEvents.get(sessionId);
    if (subject) {
      subject.next(event);
    }
  }

  /**
   * Clean up session resources
   */
  cleanupSession(sessionId: string): void {
    this.sessionEvents.delete(sessionId);
    this.sessionData.delete(sessionId);
  }
}
