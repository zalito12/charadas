import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { GameDto } from "../common/game-dto";
import { UserDto } from "../common/user-dto";
import { DataService } from "./data.service";
import { HttpClient } from "@angular/common/http";
import { TurnDto } from "../common/turn-dto";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class PlayService {
  private basePath = `${environment.functionsUrl}/`;

  private user$: BehaviorSubject<UserDto> = new BehaviorSubject<UserDto>(null);
  private game$: BehaviorSubject<GameDto> = new BehaviorSubject<GameDto>(null);

  constructor(private data: DataService, private http: HttpClient) {}

  public getUser$(userId?: string): Observable<UserDto> {
    if (userId && !this.user$.getValue()) {
      this.data.listenUser$(userId).subscribe(data => {
        this.user$.next(<UserDto>data);
      });
    }

    return this.user$;
  }

  public getGame$(gameId?: string): Observable<GameDto> {
    if (gameId && !this.game$.getValue()) {
      this.data.listenGame$(gameId).subscribe(data => {
        this.game$.next(<GameDto>data);
      });
    }

    return this.game$;
  }

  public endTurn(turn: TurnDto) {
    this.http.post(`${this.basePath}endTurn`, turn).subscribe();
  }
}
