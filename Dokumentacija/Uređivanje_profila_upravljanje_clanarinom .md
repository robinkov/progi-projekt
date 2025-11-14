```mermaid
sequenceDiagram
    actor Organizator
    participant A as Aplikacija
    participant DB as Baza podataka
    participant PP as Payment Provider

    alt Uredi profil
        Organizator->>A: Klikne "Uredi profil"
        A->>DB: Dohvati podatke o profilu organizatora
        DB-->>A: Vrati podatke
        A->>Organizator: Prikaže formu za uređivanje
        
        Organizator->>A: Unosi nove podatke + slika
        
        alt Neispravan format slike
            A->>Organizator: Prikaže "Učitajte ispravnu sliku"
        else Podaci ispravni
            A->>DB: Ažuriraj profil organizatora
            
            alt Baza nedostupna
                DB-->>A: Vrati grešku
                A->>Organizator: Prikaže grešku
            else Uspješno ažuriranje
                DB-->>A: Potvrdi spremanje
                A->>Organizator: Prikaže "Profil ažuriran"
            end
        end
    else Upravljanje članarinom organizatora
        Organizator->>A: Otvori "Članstvo"
        A->>DB: Dohvati članarine
        DB->>A: Vrati vrste članarina i cijene
        A->>Organizator: Prikaže opcije članstva
    
        Organizator->>A: Odabere plan (mjesečni/godišnji)
        A->>PP: Generiraj payment request
        PP->>Organizator: Prikaže plaćanje
    
        alt Plaćanje odbijeno
            PP->>A: Obavijesti o neuspjehu
            A->>Organizator: Prikaži "Plaćanje nije uspjelo"
            
        else Uspješno plaćanje
            PP->>A: Obavijesti o uspjehu
            A->>DB: Ažuriraj članstvo organizatora
            A->>DB: Spremi transakciju
        
            alt Greška pri spremanju
                DB-->>A: Vrati grešku
                A->>Organizator: Prikaže upozorenje
            else Uspješno spremljeno
                DB-->>A: Potvrdi ažuriranje
                A->>Organizator: Prikaži "Članstvo aktivirano"
            end
        end
    end
```
