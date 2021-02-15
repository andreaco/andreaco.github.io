# Beat Generation
Rhythmic Pattern generation using Genetic Algorithms

## Description
Our project aims at finding a score to evaluate different rhythms according to some well known analytical features that exploit their euclidean representation.
The final goal is to use them as fitness functions on a Genetic Algorithm and see how it behave with them.
The final result is the generation of a pool of rhythms for which it is provided a graphic modelization of the features, allowing the user to understand them in a deeper and more intuitive way.

## Representations
**Overview**: Shows the euclidean representation of the rhythm

<img align="center" src="images/euclidean.gif" alt="Overview" width="246" height="200">

**Balance**: The balance of a rhythm is a quantification of the proximity of that rhythm's “centre of mass” to the
                centre of the unit circle

<img align="center" src="images/balance.png" alt="Overview" width="246" height="200">

**Evenness**: The evenness of a rhythm is a quantification of the lack of variance of its interonset intervals.
If the rhythm's interonset intervals are all similar in duration, the rhythm will have high evenness

<img align="center" src="images/evenness.png" alt="Overview" width="246" height="200">


**Entropy**: Entropy quantifies the unpredictability of a probability mass function computed on the intervals between the onsets of the rhythmic sequence

<img align="center" src="images/entropy.png" alt="Overview" width="246" height="200">


## Video Demo  
[![Watch the video](https://img.youtube.com/vi/vRPuwb6FgM8/maxresdefault.jpg)](https://youtu.be/vRPuwb6FgM8)
