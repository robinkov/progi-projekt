# ClayPlay

## 👤 Obični korisnik
Obični korisnici aplikacije ClayPlay predstavljaju polaznike koji žele sudjelovati u keramičkim radionicama ili kupiti gotove proizvode. Oni imaju mogućnost pregleda i pretraživanja radionica prema lokaciji, terminu i instruktoru, te jednostavnog rezerviranja željenog termina.
Osim sudjelovanja u radionicama, korisnici mogu pregledavati i naručivati keramičke proizvode izrađene od strane instruktora, ostavljati recenzije te pratiti vlastitu povijest rezervacija i kupnji.

## 🧑‍🏫 Instruktori
Instruktori su voditelji keramičkih radionica koji putem aplikacije imaju mogućnost promovirati svoje radionice i proizvode.
Mogu izrađivati nove objave radionica s opisima, terminima i cijenama, pratiti prijave sudionika, profil na kojem mogu prikazati vlastite radove te nuditi gotove proizvode na prodaju. Aplikacija im omogućuje digitalnu prisutnost i jednostavno upravljanje svojim kreativnim sadržajem.

## 📃Opis projekta
ClayPlay je mobilna i web aplikacija namijenjena svima koji se žele baviti keramikom – bilo kao instruktori koji organiziraju radionice ili kao korisnici koji žele učiti, stvarati i kupovati jedinstvene keramičke proizvode. Aplikacija omogućuje pregled dostupnih radionica, jednostavnu rezervaciju termina i izravnu komunikaciju između polaznika i instruktora. Instruktori mogu upravljati svojim radionicama, objavljivati nove događaje i prodavati vlastite radove.
Sustav je razvijen s ciljem digitalizacije kreativnog procesa i promocije umjetnosti keramike kroz pristupačno i intuitivno korisničko iskustvo. ClayPlay spaja funkcionalnost, estetiku i zajednicu – stvarajući prostor u kojem ljubitelji keramike mogu učiti, surađivati i inspirirati jedni druge.

## ⚡Funkcijski zahtjevi
> 👤 Korisnik<br />
> Aplikacija mora omogućiti korisniku registraciju i prijavu putem email adrese i lozinke. <br />
> Prilikom registracije, korisnik mora unijeti ime, prezime, email adresu i lozinku. <br />
> Nakon uspješne registracije, korisnik mora biti zapisan u bazu podataka te mu se mora omogućiti pristup sustavu. <br />
> Aplikacija mora omogućiti prijavljenom korisniku pregled svih dostupnih radionica. <br />
> Prilikom pregleda radionica, korisniku se moraju prikazati osnovne informacije o radionici, uključujući naslov, opis, vrijeme održavanja, trajanje, lokaciju, cijenu i broj > slobodnih mjesta. <br />
> Korisnik mora moći pretraživati radionice po kriterijima poput naziva, lokacije, instruktora i datuma održavanja. <br />
> Aplikacija mora omogućiti korisniku rezervaciju mjesta na odabranoj radionici. <br />
> Prilikom rezervacije, aplikacija mora pohraniti poveznicu između korisnika i radionice u tablicu rezervacija. <br />
> Korisnik mora moći pregledati sve svoje rezervacije te otkazati postojeću rezervaciju prije početka radionice. <br />
> Aplikacija mora omogućiti korisniku pregled izložbi i proizvoda koji su dostupni za kupnju. <br />
> Korisnik mora moći odabrati proizvod, dodati ga u narudžbu te izvršiti kupnju. <br />
> Nakon potvrde narudžbe, transakcija mora biti pohranjena u bazu podataka zajedno s podacima o metodi plaćanja i vremenu kupnje. <br />
> Aplikacija mora omogućiti korisniku ostavljanje recenzije za kupljeni proizvod. <br />
> Recenzija mora sadržavati ocjenu (1–5) i tekstualni komentar te se mora povezati s proizvodom i korisnikom koji ju je napisao. <br />
> Aplikacija mora omogućiti korisniku pretplatu na obavijesti. <br />
> Sustav mora voditi evidenciju o pročitanim i nepročitanim obavijestima za svakog korisnika. <br />
> 🧑‍🏫 Instruktor<br />
> Aplikacija mora omogućiti instruktoru registraciju kao organizatoru radionica. <br />
> Nakon registracije, instruktor mora čekati odobrenje administratora prije nego što može objavljivati sadržaj. <br />
> Aplikacija mora omogućiti instruktoru kreiranje, uređivanje i brisanje vlastitih radionica. <br />
> Prilikom kreiranja radionice, instruktor mora moći unijeti naslov, opis, datum i vrijeme održavanja, trajanje, lokaciju, maksimalan broj sudionika i cijenu. <br />
> Aplikacija mora osigurati da samo instruktor koji je kreirao radionicu može uređivati ili brisati vlastite radionice. <br />
> Aplikacija mora omogućiti instruktoru pregled prijava na njegove radionice. <br />
> Instruktor mora moći vidjeti podatke o polaznicima koji su rezervirali radionicu i upravljati dostupnim mjestima. <br />
> Aplikacija mora omogućiti instruktoru kreiranje i uređivanje izložbi. <br />
> Instruktor mora moći definirati naziv, opis, vrijeme i mjesto izložbe. <br />
> Instruktor mora moći povezati proizvode s izložbom, ažurirati količinu i cijenu proizvoda te upravljati njihovim prikazom. <br />
> Aplikacija mora omogućiti instruktoru pregled i ažuriranje vlastitog profila organizatora. <br />
> Profil mora sadržavati osnovne podatke o organizatoru, opis, profilnu i naslovnu fotografiju te informacije o članstvu. <br />
> 🧩 Administrator<br />
> Aplikacija mora omogućiti administratoru pregled svih registriranih korisnika i instruktora. <br />
> Administrator mora imati mogućnost odobriti ili odbiti zahtjeve instruktora za objavu sadržaja. <br />
> Administrator mora imati mogućnost upravljanja planovima članstva i odobravanjem članarina instruktora. <br />
> Administrator mora moći pregledati transakcije i evidenciju uplata te po potrebi ručno intervenirati u slučaju greške. <br />
> Aplikacija mora omogućiti administratoru slanje obavijesti korisnicima i instruktorima. <br />
> Administrator mora moći odabrati tip obavijesti, naslov i sadržaj te pregledati status pročitanih obavijesti. <br />
> 💰 Financijski i opći zahtjevi<br />
> Sustav mora voditi evidenciju o svim financijskim transakcijama, uključujući rezervacije radionica, kupnje proizvoda i članarine instruktora. <br />
> Za svaku transakciju mora biti pohranjen iznos, metoda plaćanja i vrijeme izvršenja. <br />
> Sustav mora omogućiti različite planove članstva za instruktore. <br />
> Svaki plan mora imati naziv, cijenu i trajanje izraženo u mjesecima. <br />
> Nakon isteka članstva, sustav mora onemogućiti instruktora dok se članstvo ne obnovi. <br />
> Sustav mora osigurati zaštitu podataka i kontrolu pristupa. <br />
> Pristup određenim funkcionalnostima (npr. kreiranje radionica ili odobravanje korisnika) mora biti ograničen prema ulozi korisnika (korisnik, instruktor, administrator).<br />

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
