import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import "firebase/firestore";
import { GameDto } from "../common/game-dto";
import { Collections } from "../common/contants";
import { Observable, from } from "rxjs";
import { UserDto } from "../common/user-dto";
import { firestore } from "firebase";
import { GameUserDto } from "../common/game-user-dto";
import { map } from "rxjs/operators";
import { WordDto } from '../common/word-dto';

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private firestore: AngularFirestore) {}

  public getGame$(
    gameId: string
  ): Observable<firestore.DocumentSnapshot<firestore.DocumentData>> {
    return this.firestore
      .collection(Collections.games)
      .doc(gameId)
      .get();
  }

  public listenGame$(
    gameId: string
  ): Observable<unknown> {
    return this.firestore
      .collection(Collections.games)
      .doc(gameId)
      .valueChanges();
  }

  public createGame(name: string): Observable<DocumentReference> {
    if (!name) {
      return;
    }

    const game: GameDto = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      name: name,
      users: []
    };
    return from(this.firestore.collection(Collections.games).add(game));
  }

  public addUserToGame(user: UserDto): Observable<void> {
    if (!user.uid || !user.gameId || !user.name) {
      return;
    }

    const gameUser: GameUserDto = {
      uid: user.uid,
      name: user.name,
      points: 0
    };

    const game = this.firestore.collection(Collections.games).doc(user.gameId);

    return from(
      game.update({ users: firestore.FieldValue.arrayUnion(gameUser) })
    );
  }

  public listenUser$(
    userId: string
  ): Observable<unknown> {
    return this.firestore
      .collection(Collections.users)
      .doc(userId)
      .valueChanges();
  }

  public createUser(
    uid: string,
    name: string,
    gameId: string
  ): Observable<UserDto> {
    if (!uid || !gameId || !name) {
      return;
    }
    const user: UserDto = {
      uid: uid,
      name: name,
      gameId: gameId
    };
    return from(
      this.firestore
        .collection(Collections.users)
        .doc(uid)
        .set(user)
    ).pipe(
      map(_ => {
        return user;
      })
    );
  }



  public createWord(word: string, numSyllables: number): Observable<void> {
    if (!word) {
      return;
    }

    const id = this.firestore.createId();
    const doc: WordDto = {
      word: word,
      random: id,
      numSyllables: numSyllables
    };
    return from(this.firestore.collection(Collections.words).doc(id).set(doc));
  }
}
