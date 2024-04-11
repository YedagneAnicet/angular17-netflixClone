import {Component, effect, inject} from '@angular/core';
import {Movie} from "../../services/models/movies.model";
import {TmdbService} from "../../services/tmdb.service";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  tmdbService = inject(TmdbService);

  trendMovie : Movie | undefined;

  constructor() {
    effect(() => {
      const trendMovieReponse = this.tmdbService.fetchTrendMovie.value;

      if(trendMovieReponse) {
        this.trendMovie = trendMovieReponse.results[0];
      }

    });
  }

  ngOnInit(): void {
    this.fetchMovieTrends()
  }

  fetchMovieTrends():void {
    this.tmdbService.getTrends();
  }
}
