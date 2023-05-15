import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-barre-r',
  templateUrl: './barre-r.component.html',
  styleUrls: ['./barre-r.component.css']
})

export class BarreRComponent {
  sub!: Subscription;

  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef;

  paysListe: Array<Pays> = [
    {
      id: 'NC',
      nom: 'Nouvelle-Calédonie',
    },
    {
      id: 'FR',
      nom: 'France',
    },
    {
      id: 'ES',
      nom: 'Espagne',
    },
  ];
  currentPaysListe: Array<Pays> = [];

  constructor() { }

  ngAfterViewInit() {
    this.sub = fromEvent<any>(this.searchInput.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        map(event => event.target.value)
      )
      .subscribe(value => {
        if (value.trim().length === 0) {
          this.currentPaysListe = [];
        } else {
          this.currentPaysListe = this.paysListe.filter(pays =>
            pays.nom.toLowerCase().startsWith(value.toLowerCase())
          );
        }
      });
  }

  suggest() {
    const value = this.searchInput.nativeElement.value.trim();
    if (value.length > 0) {
      this.currentPaysListe = this.paysListe.filter(pays =>
        pays.nom.toLowerCase().startsWith(value.toLowerCase()));
    }
  }

  wait() {
    setTimeout(() => this.currentPaysListe = [], 400);
  }

  selectPays(pays: Pays) {
    this.searchInput.nativeElement.value = pays.nom;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export interface Pays {
  id: string;
  nom: string;
}
