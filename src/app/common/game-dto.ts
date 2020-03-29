import { firestore } from "firebase";
import { GameUserDto } from "./game-user-dto";

export interface GameDto {
  createdAt: firestore.FieldValue;
  name: string;
  users: GameUserDto[]
  sortedUsers?: GameUserDto[]
  word?: string;
  currentTurn?: number;
}
