import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {MovieApiResponse} from "./models/movies.model";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {State} from "./models/state.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TmdbService {


  http = inject(HttpClient)
  baseURL = "https://api.themoviedb.org"

  constructor() { }

  /* Permet de connaitre l'etat de la request http lors de son retour */
  private fetchTrendMovie$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>>
    = signal(State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build());

  fetchTrendMovie = computed(() => this.fetchTrendMovie$());

  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);
  }

  getTrends(): void {
    this.http.get<MovieApiResponse>(
      `${this.baseURL}/3/trending/movie/day`, {headers: this.getHeaders()})
      .subscribe({
        next: tmdbResponse =>
          this.fetchTrendMovie$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(tmdbResponse).build()),
        error: err => {
          this.fetchTrendMovie$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forError(err).build())
        }
      });
  }
}
