Frontend Webapplikation: gruppe 8

Projektoversigt
Vi udvikler en lille frontend webapplikation, som skal køre lokalt og også implementeres i skyen. Den primære målsætning for applikationen er at tilbyde en brugervenlig grænseflade for at håndtere indkøbskurve funktionalitet samt ordreafgivelse.

Funktionaliteter: 

Indkøbskurv Visninger:
-	Vis liste over varer med pris per enhed og total.
-	Mulighed for at ændre mængde og fjerne varer.
-	Visning og redigering af gaveindpakning samt tilbagevendende ordreplaner.

Prisberegninger:
-	Automatisk beregning af rabatter baseret på ordrestørrelse og motivationer for at øge køb.

Adresse- og Betalingsinformation:
-	Indtastning af leverings og faktureringsadresse med bekræftelse.
-	Mulighed for at vælge betalingsmetode som faktura.

Ordreafgivelse:
-	Godkendelse af vilkår og betingelser samt modtagelse af marketingmails (hvilket er noget vi kun implementere i backend).
-	Indsendelse af ordreoplysninger til et endpoint.

Teknologier
-Sprog/Framework: HTML, React med TypeScript og Javascript.
-	Styling: CSS med fokus på design og tilgængelighed.
-	Routing: Anvendelse af React Router for navigation og håndtering af browserens tilbage og fremknapper.

Test og Dokumentation
-	Udvikling inkluderer skrivning af tests for at dække scenarierne.
-	En omfattende skriftlig rapport med skærmbilleder, beslutningsanalyse, og bidrag fra teammedlemmer skal inkluderes.

Team Samarbejde
Projektet indebar af 4 dele opgaver, hvor der var fokus på forskellige implementeringer, Dette var her hvor vi opdelte det. Vi havde regelmæssige møder omkring opdateringer, hvad vi kan gøre bedre samt uddeling af opgaver

Integration med Backend
i vores backend fag har vi udnyttet muligheden for at integrere frontend webapplikation med en server side løsning. Ved hjælp af Node.js og MongoDB har vi udviklet funktionalitet til håndtering af host anmodninger, herunder indsamling og lagring af kontaktinformationer.Denne integration sikrer, at når brugere indtaster deres kontaktinformationer på hjemmesiden, bliver disse data sendt til serveren, hvor de opbevares sikkert i MongoDB-databasen. Dette setup giver os en robust arkitektur, der tillader effektiv datahåndtering af vores applikation efter behov. Dette forbedrer både funktionalitet og brugeroplevelse.
