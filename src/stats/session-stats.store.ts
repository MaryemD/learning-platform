// Store pour stocker les statistiques de la session en mémoire
export const sessionStatsStore = new Map<number, { connectedUsers: Set<number> }>();