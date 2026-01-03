# ClayPlay

## 🧑‍💼 Administrator
Administrator ima ovlasti nad upravljanjem korisnicima i instruktorima unutar sustava ClayPlay.
Njegova uloga uključuje odobravanje novih instruktora prije nego što mogu objavljivati radionice ili izložbe te praćenje i održavanje pravilnog rada sustava. Administrator može pregledavati i nadzirati transakcije, članarine instruktora te slati obavijesti korisnicima.
Uloga administratora ključna je za održavanje sigurnosti, pouzdanosti i urednosti sustava.

## 👤 Obični korisnik
Obični korisnici aplikacije ClayPlay predstavljaju polaznike koji žele sudjelovati u keramičkim radionicama ili kupiti gotove proizvode. Oni imaju mogućnost pregleda i pretraživanja radionica prema lokaciji, terminu i instruktoru, te jednostavnog rezerviranja željenog termina.
Osim sudjelovanja u radionicama, korisnici mogu pregledavati i naručivati keramičke proizvode izrađene od strane instruktora, ostavljati recenzije te pratiti vlastitu povijest rezervacija i kupnji.

## 🧑‍🏫 Organizatori
Organizatori su voditelji keramičkih radionica koji putem aplikacije imaju mogućnost promovirati svoje radionice i proizvode.
Mogu izrađivati nove objave radionica s opisima, terminima i cijenama, pratiti prijave sudionika, profil na kojem mogu prikazati vlastite radove te nuditi gotove proizvode na prodaju. Aplikacija im omogućuje digitalnu prisutnost i jednostavno upravljanje svojim kreativnim sadržajem.

## 📃Opis projekta
ClayPlay je mobilna i web aplikacija namijenjena svima koji se žele baviti keramikom – bilo kao instruktori koji organiziraju radionice ili kao korisnici koji žele učiti, stvarati i kupovati jedinstvene keramičke proizvode. Aplikacija omogućuje pregled dostupnih radionica, jednostavnu rezervaciju termina i izravnu komunikaciju između polaznika i instruktora. Instruktori mogu upravljati svojim radionicama, objavljivati nove događaje i prodavati vlastite radove.
Sustav je razvijen s ciljem digitalizacije kreativnog procesa i promocije umjetnosti keramike kroz pristupačno i intuitivno korisničko iskustvo. ClayPlay spaja funkcionalnost, estetiku i zajednicu – stvarajući prostor u kojem ljubitelji keramike mogu učiti, surađivati i inspirirati jedni druge.

## ⚡Funkcijski zahtjevi
Sustav omogućuje registraciju i prijavu korisnika kao polaznika ili organizatora.<br />
Sustav omogućuje prijavu korisnika putem vanjskih servisa za autentifikaciju.<br />
Sustav omogućuje uređivanje javnog profila organizatora.<br />
Sustav omogućuje organizatoru dodavanje novih radionica s pripadajućim detaljima.<br />
Sustav omogućuje polaznicima pregled i rezervaciju termina radionica.<br />
Sustav omogućuje prikaz termina radionica putem integriranog kalendara.<br />
Sustav omogućuje korisnicima plaćanje termina radionica putem integriranih servisa.<br />
Sustav omogućuje organizatorima plaćanje članarine prema odabranom planu.<br />
Sustav omogućuje korisnicima otkazivanje rezervacija najkasnije 48 sati prije početka radionice.<br />
Sustav sadrži internetsku trgovinu keramičkih radova.<br />
Sustav omogućuje kupcima pregled, filtriranje i kupovinu proizvoda.<br />
Sustav omogućuje korisnicima ostavljanje recenzija i ocjena proizvoda nakon kupnje.<br />
Sustav omogućuje organizaciju i promociju izložbi keramičkih radova polaznika.<br />
Sustav omogućuje polaznicima prijavu za sudjelovanje na izložbi.<br />
Sustav omogućuje sudionicima objavu komentara i fotografija nakon održane izložbe.<br />
Sustav omogućuje korisnicima pretplatu na obavijesti o novim radionicama i proizvodima.<br />
Sustav omogućuje administratorima upravljanje korisnicima i odobravanje profila.<br />
Sustav omogućuje administratorima definiranje i ažuriranje cijena članarina.<br />
Sustav mora primjenjivati kontrolu pristupa prema korisničkim ulogama (polaznik, organizator, administrator) i ograničiti pristup nedozvoljenim funkcijama.<br />

## ⚙️ Nefunkcijski zahtjevi

Sustav mora biti responzivan i prilagođen prikazu na uređajima različitih veličina ekrana (računala, tableti, mobilni uređaji).<br />
Sustav mora imati intuitivno korisničko sučelje koje omogućuje korisniku izvršavanje glavnih funkcija unutar najviše tri koraka.<br />
Vrijeme učitavanja svake stranice ne smije prelaziti 3 sekunde pri prosječnoj brzini internetske veze od 10 Mbps.<br />
Sustav mora podržavati istovremeni rad najmanje 100 aktivnih korisnika bez značajnog pada performansi (manje od 10% usporenja).<br />
Sustav mora sinkronizirati vanjske kalendare i servise unutar 10 sekundi od promjene podataka.<br />
Sustav mora osigurati sigurnu autentifikaciju korisnika korištenjem protokola koji podržavaju dvofaktorsku provjeru identiteta.<br />
Sustav mora pohranjivati i obrađivati osobne podatke korisnika u skladu s važećom GDPR regulativom.<br />
Sav mrežni promet između klijenta i poslužitelja mora biti šifriran korištenjem sigurnosnog protokola s certifikatom.<br />
Sustav mora biti izrađen na način koji omogućuje jednostavnu izmjenu i proširenje funkcionalnosti u roku kraćem od 2 dana po izmjeni.<br />
Sustav mora sadržavati tehničku dokumentaciju koja uključuje opis arhitekture, modula i API-ja, priručnik za korištenje s opisom osnovnih funkcionalnosti i postupaka rada te plan implementacije koji omogućuje postavljanje sustava u novo okruženje u roku od najviše 4 sata.<br />


## 🛠️Tehnologije
| Sloj                    | Tehnologija                   |
| ----------------------- | ----------------------------- |
| **Frontend**            | React Native                  |
| **Dizajn**              | Figma                         |
| **Backend**             | Flask (Python)                |
| **Deployment**          | Render                        |
| **Baza podataka**       | PostgreSQL                    |

## 👥Članovi tima

| Ime i prezime | Email | Mobitel | Glavno zaduženje | Predložena tehnologija |
| --- | --- | --- | --- | --- |
| **Robin Kovačić** | **robin.kovacic@fer.hr** | **+385993297142** | **Frontend** | **React** |
| Lucija Kozić | Lucija.Kozic@fer.hr | +385955102106 | UI/UX dizajn | Figma |
| Leon Krivski | leon.krivski@fer.hr | +385914042021 | Testiranje | Jest |
| Marin Mikulčić | marin.mikulcic@fer.hr | +385919503666 | Dokumentacija | Markdown |
| Roko Matek | roko.matek@fer.hr | +385995150871 | Backend | Flask |
| Lovre Jurjević | lovre.jurjevic@fer.hr | +385955093574 | Baze podataka | PostgreSQL |
| Josip Bušelić | josip.buselic@fer.hr | +385913661466 | Backend | Flask |

## 🏅Kontribucije

## 📝Licenca

Važeća (1)

#### [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License HR](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.hr)
> Ovaj repozitorij sadrži otvoreni obrazovni sadržaji (eng. Open Educational Resources) i licenciran je prema pravilima Creative Commons licencije koja omogućava da preuzmete djelo, podijelite ga s drugima uz uvjet da navođenja autora, ne upotrebljavate ga u komercijalne svrhe te dijelite pod istim uvjetima.
