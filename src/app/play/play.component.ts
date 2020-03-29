import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { UserDto } from "../common/user-dto";
import { Observable } from "rxjs";
import { GameDto } from "../common/game-dto";
import { PlayService } from "../services/play.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"]
})
export class PlayComponent implements OnInit {
  private gameId: string;

  public user$: Observable<UserDto>;
  public game$: Observable<GameDto>;

  constructor(private auth: AuthService, private playService: PlayService) {}

  ngOnInit(): void {
    const authUser = this.auth.getUser();
    if (authUser) {
      this.user$ = this.playService.getUser$(authUser.uid).pipe(
        map(user => {
          if (user) {
            this.game$ = this.getGame$(user.gameId);
          }
          return user;
        })
      );
    }
  }

  public getGame$(gameId): Observable<GameDto> {
    if (!gameId) {
      return null;
    }

    return this.playService.getGame$(gameId).pipe(
      map(game => {
        if (game) {
          this.gameId = gameId;
          if (!game.users) {
            game.users = [];
          }
          game.sortedUsers = game.users.slice(0).sort((a, b) => b.points - a.points);
        }
        return game;
      })
    );
  }

  public correct(game: GameDto) {
    this.playService.endTurn({
      gameId: this.gameId,
      currentTurn: game.currentTurn,
      points: 1
    });
  }

  public wrong(game: GameDto) {
    this.playService.endTurn({
      gameId: this.gameId,
      currentTurn: game.currentTurn,
      points: 0
    });
  }
}
