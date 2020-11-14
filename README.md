# ACTAM Project

### TODO
- [X] Scrivere a Sarti/Borrelli per progetto combinato
- [ ] Scrivere la funzione di mating
- [ ] Interfaccia "modulare"  
- [ ] Pensare alla funzione di fitting  
- [ ] Velocity float invece che boolean


### Obiettivo
Generare un beat **ispirandosi** ad algoritmi genetici  
### Steps
- Inizialmente viene generato un pool di pattern pseudo randomici come prima generazione.
Viene calcolata la fitness di ogni individuo, sia algoritmicamente confrontandolo con un dataset di beat MIDI o a preferenza degli utenti, votando il preferito da un sottoinsieme
- I beat che sopravvivono a queste selezioni entreranno in un “Mating Pool”.
- A questo punto sarà necessario scegliere delle coppie di genitori dalla cui unione verranno generati dei pattern figli (uno o piu figli per ogni coppia di genitori?), eventualmente con delle leggere mutazioni randomiche (settare un grado di mutazione e dei parametri da far mutare all’utente)
- Infine otterremo una pool di figli che può essere usata come nuova generazione su cui ripetere questa procedura



### References
- https://dood.al/pinktrombone/
- https://youtu.be/C9hX3c970O8?t=213
- https://synthmata.com/
- https://maxforlive.com/library/device/5875/euclidean-sequencer
- https://github.com/2bbb/node-abletonlink
- https://sites.research.google/tonetransfer
- https://www.syntorial.com/
- https://vochlea.com/
- https://www.tatsuyatakahashi.com/2018-rbmg-tats-synth
