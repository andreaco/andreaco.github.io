# ACTAM Project

### TODO
- [X] Scrivere a Sarti/Borrelli per progetto combinato
- [X] Pensare alla funzione di fitting  
- [X] Velocity float invece che boolean
- [ ] Scrivere la funzione di mating
- [ ] Interfaccia "modulare"
- [ ] Aggiungere Snare + Hihat al mating e nel costruttore dei figli
- [ ] Logica di rendering
- [ ] Sequence representation



### Obiettivo
Generare un beat **ispirandosi** ad algoritmi genetici  
### Steps
- Inizialmente viene generato un pool di pattern pseudo randomici come prima generazione.
Viene calcolata la fitness di ogni individuo, sia algoritmicamente confrontandolo con un dataset di beat MIDI o a preferenza degli utenti, votando il preferito da un sottoinsieme
- I beat che sopravvivono a queste selezioni entreranno in un “Mating Pool”.
- A questo punto sarà necessario scegliere delle coppie di genitori dalla cui unione verranno generati dei pattern figli (uno o piu figli per ogni coppia di genitori?), eventualmente con delle leggere mutazioni randomiche (settare un grado di mutazione e dei parametri da far mutare all’utente)
- Infine otterremo una pool di figli che può essere usata come nuova generazione su cui ripetere questa procedura



### References
- https://scholarworks.uno.edu/cgi/viewcontent.cgi?article=1864&context=td
- https://osf.io/7vntp
- https://www.researchgate.net/publication/220991709_The_Distance_Geometry_of_Deep_Rhythms_and_Scales

- https://youtu.be/C9hX3c970O8?t=213
- https://maxforlive.com/library/device/5875/euclidean-sequencer
- https://github.com/2bbb/node-abletonlink
- https://sites.research.google/tonetransfer
- https://www.tatsuyatakahashi.com/2018-rbmg-tats-synth
