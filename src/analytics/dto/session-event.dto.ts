import { EventType } from '../enums';

/**
 * Base interface for all session events
 */
export interface SessionEvent {
  type: EventType;
  timestamp: number;
  sessionId: number;
  [key: string]: any;
}

/**
 * Event for when a student joins a session
 */
export interface StudentJoinedEvent extends SessionEvent {
  type: EventType.StudentJoined;
  studentId: string;
  studentName: string;
}

/**
 * Event for when a student participates in a quiz
 */
export interface QuizParticipationEvent extends SessionEvent {
  type: EventType.QuizParticipation;
  studentId: string;
  quizId?: string;
  completed?: boolean;
}

/**
 * Event for when a quiz is answered (success or failure)
 */
export interface QuizQuestionResultEvent extends SessionEvent {
  type: EventType.QuestionResult;
  questionId: string;
  studentId: string;
  success: boolean;
}
