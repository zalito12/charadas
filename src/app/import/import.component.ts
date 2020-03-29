import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataService } from "../services/data.service";

interface Data {
  data: {
    noun: {
      value: string;
      numSyllables: number;
    };
  }[];
}

@Component({
  selector: "app-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.css"]
})
export class ImportComponent implements OnInit {
  constructor(private http: HttpClient, private dataService: DataService) {}

  ngOnInit(): void {}

  public import() {
    const imported: string[] = [];
    this.http.get("/assets/data.json").subscribe((json: Data) => {
      json.data.forEach(word => {
        if (
          imported.indexOf(word.noun.value) === -1 &&
          word.noun.value !== "pizza"
        ) {
          imported.push(word.noun.value);
          this.dataService.createWord(word.noun.value, word.noun.numSyllables);
        }
      });
    });
  }
}
