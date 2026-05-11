export type Participant = {
    id: number;
    nome: string;
  };
  
export type Match = {
    id: number;
    fase: string;
    rodada: string;
    home: string;
    away: string;
    home_score: number | null;
    away_score: number | null;
    is_brazil: boolean;
    day: number;
    status: string;
};
  
export type Prediction = {
    participant_id: number;
    match_id: number;
    pred_home: number;
    pred_away: number;
};