```mermaid
sequenceDiagram
    actor Kupac
    participant A as Aplikacija
    participant DB as Baza podataka
    participant PP as Payment Provider
    participant Prodavač as Organizator/Prodavač

    Kupac->>A: Otvori online trgovinu
    A->>DB: Dohvati dostupne proizvode
    DB->>A: Vrati listu proizvoda
    A->>Kupac: Prikaže proizvode
    
    Kupac->>A: Primijeni filtere (kategorija, cijena)
    A->>DB: Dohvati filtrirane proizvode
    DB->>A: Vrati filtrirane proizvode
    A->>Kupac: Prikaže filtrirane proizvode
    
    Kupac->>A: Odabere proizvod + "Dodaj u košaricu"
    A->>DB: Provjeri stanje zaliha

    alt Proizvod nije dostupan
        DB->>A: out_of_stock
        A->>Kupac: Prikaže "Proizvod nije na zalihi"
    else Proizvod dostupan
        DB-->>A: Podaci o proizvodu
        A->>A: Dodaj u košaricu
        A->>Kupac: Prikaže "Dodano u košaricu"
        
        Kupac->>A: Klikne "Plaćanje"
        A->>PP: Iniciraj plaćanje
        PP->>Kupac: Prikaže proces plaćanja
        
        alt Plaćanje neuspješno
            PP->>A: failed
            A->>Kupac: Prikaže "Plaćanje nije uspjelo"
        else Plaćanje uspješno
            Kupac->>PP: Izvrši plaćanje
            PP->>A: success
            A->>DB: Ažuriraj stanje zaliha
            A->>DB: Kreiraj narudžbu
            A->>Prodavač: Obavijest o novoj narudžbi
            A->>Kupac: Prikaže "Kupnja uspješna" + detalji
        end
    end
```
