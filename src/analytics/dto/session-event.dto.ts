import { EventType } from '../enums';

/**
 * Base interface for all session events
 */
export interface SessionEvent {
  type: EventType;
  timestamp: number;
  sessionId: string;
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
 * Event for when a new question is asked
 */
export interface NewQuestionEvent extends SessionEvent {
  type: EventType.NewQuestion;
  questionId: string;
  question: string;
  studentId: string;
}

/**
 * Event for when a question is answered (success or failure)
 */
export interface QuestionResultEvent extends SessionEvent {
  type: EventType.QuestionResult;
  questionId: string;
  studentId: string;
  success: boolean;
}
