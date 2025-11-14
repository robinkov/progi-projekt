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
> Aplikacija mora omogućiti predstavniku kreiranje novog sastanka.<br />
> Prilikom kreiranja sastanka, aplikacija mora omogućiti dodavanje naslova, sažetak namjere sastanka, vrijeme, mjesto i niz točaka dnevnog reda.<br />
> Aplikacija mora omogućiti predstavniku prevođenje kreiranog sastanka u stanje "Objavljen", osim ako sastanak nema definiranu nijednu točku dnevnog reda.<br />
> Aplikacija predstavniku mora omogućiti dodavanje novih točaka dnevnog reda za sastanke u stanju "Planiran".<br />
> Za sastanak u stanju "Objavljen" aplikacija mora poslati obavijest na e-mail suvlasnicima i prikazati ga na oglasnoj ploči aplikacije.<br />
> Za sastanak u stanju "Objavljen" aplikacija mora omogućiti označavanje sudjelovanja suvlasnicima.<br />
> Aplikacija mora prikazivati broj potvrđenih sudjelovanja na početnom prikazu sastanka.<br />
> Aplikacija mora omogućiti predstavniku prevođenje sastanka iz stanja "Objavljen" u stanje "Obavljen" nakon isteka termina sastanka.<br />
> Aplikacija mora omogućiti predstavniku dodavanje zaključka svakoj točki dnevnog reda za sastanke u stanju "Obavljen".<br />
> Aplikacija mora omogućiti predstavniku svrstavanje pojedine točke dnevnog reda u onu s pravnim učinkom ili onu bez pravnog učinka.<br />
> Aplikacija mora omogućiti predstavniku svrstavanje zaključka s pravnim učinkom u "Izglasan" ili "Odbijen".<br />
> Aplikacija mora omogućiti predstavniku prevođenje sastanka iz stanja "Obavljen" u stanje "Arhiviran", osim ako nisu dodani zaključci na točke dnevnog reda koje imaju pravni učinak.<br />
> Za sastanak u stanju "Arhiviran" aplikacija mora poslati obavijest na e-mail suvlasnicima.<br />
> Aplikacija mora omogućiti suvlasnicima pregledavanje zaključaka arhiviranih sastanaka.<br />
> Aplikacija se mora moći spojiti kao klijent na aplikacijsko sučelje aplikacije StanBlog, preuzeti listu diskusija i njihove poveznice.<br />
> Aplikacija mora moći postaviti poveznicu na diskusiju u aplikaciji StanBlog za neku točku dnevnog reda.<br />
> Aplikacija mora omogućiti administratoru kreiranje profila predstavnika i suvlasnika.<br />
> Aplikacija za svaki profil omogućuje kreiranje korisničkog imena, lozinke i e-mail adrese.<br />
> Aplikacija mora korisnicima omogućiti promjenu lozinke koristeći prethodnu lozinku.<br />
> Aplikacija realizira aplikacijsko sučelje koje će koristiti aplikacija StanBlog, a preko kojeg je moguće kreirati sastanak kreiran iz specifične diskusije.<br />
> Proces registracije i prijave bit će pojednostavljen korištenjem vanjskih servisa za autentifikaciju.<br />

## ⚙️ Nefunkcijski zahtjevi
> Sustav mora čuvati i osigurati sve podatke o korisnicima, instruktorima i administratorima. <br />
> Aplikacija mora biti dostupna korisnicima 24 sata dnevno. <br />
> Svi podaci o radionicama, izložbama, narudžbama i transakcijama moraju biti sigurno pohranjeni. <br />
> Sustav mora omogućiti brz i pouzdan pristup informacijama bez dugog učitavanja. <br />
> Korisničko sučelje mora biti jednostavno za korištenje i prilagođeno mobilnim uređajima. <br />
> Aplikacija mora omogućiti jednostavno dodavanje novih funkcionalnosti bez potrebe za promjenom postojećih dijelova sustava. <br />
> Svi osjetljivi podaci, poput lozinki i ključeva, moraju biti zaštićeni i pohranjeni izvan izvornog koda. <br />

## 🛠️Tehnologije
| Sloj                    | Tehnologija                   |
| ----------------------- | ----------------------------- |
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
