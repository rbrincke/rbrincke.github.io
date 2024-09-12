---
title: "A Digital Imitation Game: Building an Enigma"
date: 2023-02-09T18:47:21+01:00
categories: ["Cryptogram"]
tags: ["Enigma", "cryptography"]
math: true
hiddenFromSearch: true
hiddenFromHomePage: true
---

Let's build an Enigma simulator from scratch!

<!--more-->

The [Enigma](https://en.wikipedia.org/wiki/Enigma_machine) is a cipher device that was used by Germany during the Second World War. It is weak by modern standards, but posed a considerable challenge at the time. Cracking it required the [ingenuity of mathematicians](https://en.wikipedia.org/wiki/Cryptanalysis_of_the_Enigma) and purpose-built [electro-mechanical devices](https://en.wikipedia.org/wiki/Bomba_(cryptography)) to exploit design errors and operator mistakes. It prominently featured in the movie [The Imitation Game](https://www.imdb.com/title/tt2084970/), itself in part based on the book [Alan Turing: The Enigma](https://www.amazon.com/Alan-Turing-Enigma-Inspired-Imitation/dp/069116472X).

Wouldn't it be fun to play with one of these?

Ostensibly there are only a couple of hundred Enigma machines left, with prices up to half a million dollars. This somewhat exceeds the budget I had in mind, so I'll instead build an Enigma machine in virtual form to learn how it works and to gain an appreciation for the formidable achievement of breaking its encryption before general-purpose computers were a reality.

I'll write the simulator in [Rust](https://www.rust-lang.org), but you can pick almost any programming language. When we're done we'll be able to encrypt and decrypt our own messages using the Enigma cipher.

## The Enigma

Descriptions of the Enigma tend to be of a 'shock and awe' nature, involving terms like [polyalphabetic substitution ciphers](https://en.wikipedia.org/wiki/Polyalphabetic_cipher), plugboards, rotors, and reflectors. Fortunately all of these elements are really quite simple. After all, it is technology from 100 years ago that had to be produced at a mass scale. It is instead the interaction of these components that makes the machine complicated.

Let's start by exploring what you can do with an Enigma.

An Enigma is a machine that completes an electrical circuit after the operator presses one of 26 letters on a keyboard. The completed circuit illuminates one of 26 lights, each of which is labeled with a letter. The illuminated letter corresponds to the encrypted (or decrypted - more on this later) ciphertext character. It somewhat resembles a fancy-looking typewriter.

Imagine you want to send an Enigma-encrypted message to a friend. To encode the plaintext greeting `HI`, press `H`, write down the letter that lights up, and then do the same for `I`. The resulting ciphertext of this encryption of `HI`, for example `IO`, is transmitted via your communication channel of choice. In the 1940s you would've probably used morse code by wireless radio. On the receiving end your friend uses another Enigma machine, types in `I`, writes down the letter that lights up, then does this for `O`, and reads `HI`. Anyone monitoring the wireless channel just gets the letters `IO` and will probably just assume you're [Italian](https://en.wiktionary.org/wiki/io).

Just having an Enigma machine is not enough, you'll also need a shared key. Otherwise, an adversary could simply steal a machine and decode all of your traffic. With the wrong key, the machine returns gibberish (or Italian). Key exchange in the 1940s meant handing a piece of paper with the right settings to everyone you planned on talking to.

It would've been a lot easier if Enigma supported human-friendly passphrases, but alas: Enigma keys consist of a setting for each of its components. Enigma keys only make sense once you understand what those components do, and for that we first need to understand Enigma's cipher method.

## Alphabet soup with substitution ciphers

Enigma is a substitution cipher. Each plaintext letter of the message `HI` was *substituted* by another letter in the ciphertext, but retains its position. Substitution ciphers come in different flavors, and it's helpful to understand why that is the case.

Let's start simple. A famous substitution cipher is the Caesar or shift cipher, where each letter is shifted by three positions in the alphabet, where after Z we wrap around back to A and continue. For a shift of 3, A becomes D, B becomes E, and so on until Z, which becomes C. This turns the plaintext HI into the ciphertext KL. The key of this cipher is the shift 3. For an alphabet of 26 letters, there are only 25 possible shifts (shifting by 26 gives us the original message in plaintext!).

| Plaintext  | A   | B   | C   | D   | E   | F   | G   | H   | I   | J   | K   | L   | M   | N   | O   | P   | Q   | R   | S   | T   | U   | V   | W   | X   | Y   | Z   |
|------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Ciphertext | D   | E   | F   | G   | H   | I   | J   | K   | L   | M   | N   | O   | P   | Q   | R   | S   | T   | U   | V   | W   | X   | Y   | Z   |  A  | B   | C   |

Breaking a cipher with such a small key space is well within the reach of anyone with pen and paper and a few minutes to spare. An adversary could easily try all 25 and see which key corresponds to a meaningful message. The key space must be much larger, large enough to make enumeration infeasible.

Let's abandon the notion of any fixed offset. As long as all 26 letters are used once and each plaintext letter has exactly one ciphertext counterpart, the cipher is unambiguous. We may arbitrarily choose to pair A with F, B with Z, and so on. Our key space is now `26!` (about 89 bits), a truly large number, well beyond what your laptop can comfortably crunch through.

| Plaintext  | A   | B   | C   | D   | E   | F   | G   | H   | I   | J   | K   | L   | M   | N   | O   | P   | Q   | R   | S   | T   | U   | V   | W   | X   | Y   | Z   |
|------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Ciphertext | E   | K   | M   | F   | L   | G   | D   | Q   | V   | Z   | N   | T   | O   | W   | Y   | H   | X   | U   | S   | P   | A   | I   | B   | R   | J   | C   |

While the number of possible keys for substitution ciphers is incredibly large, each letter is still always encrypted as the same letter. For example, if we match A to E, all plaintext A's end up as ciphertext E's. The distribution of letters in a language is not random - in English the letter E is far more common than the letter Z. An adversary attempting to break this encryption can exploit this and match up the most frequent letter in a language and start out by assuming it must correspond to the most frequent ciphertext letter. Match all letter frequencies accordingly, and it soon leads to partially recognizable words that allow you to fill in or fix the remaining parts of the key. This is called frequency analysis.

A statistical property in the ciphertext therefore compromises the cipher's security. For the cipher to be any good, this property must be eliminated. One way to mask or eliminate it is by using a different substitution alphabet (a different key) for each letter: for `HI`, use one alphabet for the letter `H`, and then another for the letter `I`. Even if we encrypt `HELLOXTHERE`, which contains three E's, each substitution alphabet will potentially encrypt E as a different letter. The ciphertext will no longer reveal information about the letter frequencies directly. Because this process uses *multiple* alphabets, this is referred to as a *poly*alphabetic substitution cipher.

But how many substitution alphabets should we use until we go back and reuse the first one again? Imagine we pick an arbitrarily low number to avoid having too many substitution alphabets. If an adversary trying to break this cipher correctly infers or even guesses this number, letter frequency analysis is back in the mix! Say you chose 3 alphabets, meaning that letters 1, 4, 7, and so on, are all encrypted using the same alphabet (and a different alphabet for 2, 5, 9, and yet another for letters 3, 6, 10). Frequency analysis can then be applied to these letters independently giving us the three substitution alphabets, all we need is enough ciphertext. A long enough message or a short enough key lets us leverage the reuse of substitution alphabets and break the encryption.

It is therefore best to avoid any repetition at all and use at least as many substitution alphabets as there are characters in the longest message. But such a large key is impractical for encryption by hand and is not easy to share.

This is where Enigma shines. Enigma implements a polyalphabetic substitution cipher with a really very long cycle length and very large key space that did not require felling all the trees in Germany to share, and did not require manually cranking through substitution alphabets to achieve message security.

## Coding the machine

Enigma really consists of substitution ciphers all the way down.

### Rotors

Enigma mechanically implements a polyalphabetic substitution cipher by means of rotating discs. Its round, pancake-shaped discs are called rotors. Each rotor has 26 electrical contacts on each side, one for each letter in the alphabet. An electrical wire connects one contact on one side of the disc to exactly one other contact on the opposite side of the disc. Contacts are evenly distributed along the rotor's outer edge.

{{< image src="Rotors.jpg" caption="Two Enigma rotors. On the rotor to the left the teeth are visible. On the rotor to the right the notch side is visible, with a notch near the D. Photo from [Wikimedia](https://commons.wikimedia.org/wiki/File:Enigma_rotors_and_spindle_showing_contacts_rachet_and_notch.jpg)." width="200" >}}

Whoever designed the rotors chose the connections randomly. I've also done so in the sample schematic below, connecting for example contact 0 to 1 on the other side, contract 1 to contact 24, contact 2 to contact 0, and so on. Power applied to B goes to an endpoint touching contact 1, which comes out in contact 24, which touches a connection that lights up the letter Y. A single rotor acts as a monoalphabetic substitution cipher.

Rotors do not stay fixed in place, but rotate by 1/26th for each key press. Without rotations the machine is simply a very convoluted monoalphabetic substitution cipher, but with rotations we are in our polyalphabetic happy space.

When a rotor rotates by one position, the entire rotor including its electrical rotor contacts shift by *one* position. After a rotation, the electrical contact that previously touched B has shifted to the contact at A.

{{< image src="WiringAndStep.png" caption="**Left**: A completely made-up rotor wiring viewed from the top. The current from key B goes to rotor contact 1, which comes out at contact 24 on the other side of the rotor. B becomes Y. **Right**: A single step rotation. Note how the input endpoints are fixed and stay where they are, but the numbered rotor contacts and their wires move down by one position. If we now press B, it enters at contact 2 and comes out at contact 0, which now touches a connection leading to light bulb Z." width="50%" >}}

For a single rotor the contacts fall back into their original place after 26 key presses, a period far too short for most messages. Enigma devices therefore have multiple rotors that rotate at different speeds. Our Enigma has room for three rotors (some variants had four), all snugly placed next to one another.

It would not add any security if all rotors rotate in lockstep. Enigma was therefore designed such that not every rotor rotates for every key press. Observed from the front of the machine, only the rightmost rotor rotates on every key press.

It's not easy to understand under which conditions the other rotors rotate unless you understand the mechanism that causes a rotation, and it was not immediately obvious to me how it works. Each rotor has on its one side 26 evenly shaped teeth. Each key press lifts three pawls that **try** to push against these teeth and make it rotate by one step (the pawls go back down when the key is released). But didn't we say not all rotors rotate for every key press?

Even though *all* the pawls move up for *every* key press, the pushing motion does not always cause a rotor to rotate. This is because the pawls are aligned such that they straddle two rotors (see the schematic below). Half the pawl is over the rotor's teeth, but the other half is over the non-teeth side of the *previous* rotor, which is smooth and round almost all around. Whenever the pawl is pushed up against this smooth round surface, it simply slides over it and prevents it from engaging with the adjacent rotor's teeth. Only in certain places does the smooth round surface have a notch - a sort of gap - that allows the spring-loaded pawl to drop down and engage with the adjacent rotor's teeth, causing the movement of the pawl to rotate the rotor.

{{< image src="RotorPawls.png" caption="Top down schematic of three Enigma rotors aligned right to left. The rightmost rotor has no rotor to its right and therefore nothing prevents the pawl from engaging with its teeth, causing it to rotate on every single key press. The middle rotor has the rightmost rotor to its right, so its pawl can only engage its teeth side (yellow) when the pawl encounters a notch in the blue part of the rotor immediately to its right. The left rotor has the middle rotor to its right, so its pawl can only engage its teeth when the middle rotor has a notch. The left rotor also has a notch, but does not have a rotor to its left, so its notch is irrelevant." width="50%" >}}

Note that a pawl does not just catch and push against its rotor's teeth, it also catches and pushes against the previous rotor's notch! Once the middle rotor rotates to the point that the left rotor's pawl falls into the notch, the next key press pushes up the pawl, pushing against the left rotor's teeth, but *also* against the middle rotor's notch. The middle rotor turns twice in succession - a double-step. Actually the very same happens when the middle rotor's pawl falls in the notch of the rightmost rotor: it engages with the notch of the right rotor and turns it. But because the right rotor rotates on every turn anyway, it does not make a difference there.

So what is the machine's period assuming each rotor has a single notch? For every full rotation of the right rotor, the middle rotor turns once. The left rotor turns once for every middle rotor's full rotation, but whenever the left rotor turns it takes the middle rotor with it because of the double-step. Enigma therefore uses 26 x 25 x 26 = 16,900 different alphabets before it returns to its original setting.

Rotors are removable, and different rotors have different wire configurations and notches. Part of an Enigma key is therefore the chosen rotors (indicated by roman numerals), their ordering, and their starting position.

Then there is a third setting relating to rotors that you'll need: it is possible to rotate the internal wiring of a rotor! This is referred to as a rotor's *ring setting*. Because the notches are attached to the outer ring, rotating the internal wiring shifts the wiring relative to the position of the notch. This has the added advantage that the ring setting isn't visible from the outside of the machine in case you don't trust the machine operator.

{{< image src="RingSetting.png" caption="The dot indicates the ring setting. If the ring setting changes from 0 (the letter A) to 1 (the letter B), the wires all shift one position, but the labels (and notches) stay in place. Note that contract 0 is now in front of the wire previously in front of contact 25. A notch attached at contact 0 is still at contact 0, just the wires have shifted." width="50%" >}}

The ring setting's direction is opposite to the direction of the rotation.

### Reflectors

Once the current has passed through all rotors, it encounters the reflector. The reflector is similar to a rotor and also has 26 contacts, but its wires connect to *another* contact on the *same* side instead of a contact to the other side.

The current is therefore sent back through the very same rotors (in reverse order). That means if a plaintext A turns into a ciphertext K, pressing the K key produces an A. This is extremely convenient from an implementation perspective because it means decryption is the inverse of encryption and uses the same hardware!

We'll assume the reflector does not rotate and can be inserted in just one way, but note that other types of reflectors were available.

### Plugboard

Let's stop here, with just rotors and reflectors. What's the size of an Enigma key? Imagine there are 5 rotors to choose from. The order of rotors matters. For 5 rotors and 3 slots, there are $5 \times 4 \times 3 = 60$ possible arrangements. The rightmost and middle rotors each have 26 starting positions and 26 ring settings: $26 \times 26 = 676$. The leftmost rotor has no other rotor to its left - its notch position does not matter - and therefore only has 26 relevant settings. I'll assume there is just one reflector in a single possible position. The total number of settings is then $60 \times 676 \times 676 \times 26 = 712,882,560$ (712.8 million), approximately 30 bits (take the base-2 logarithm of the number of settings).

Now imagine that another (rotating) rotor is introduced. This increases the key space by a factor $26 \times 26 = 676$, for a grand total of 481,908,610,560 settings (39 bits).

It turns out this number can be made a lot higher by introducing yet another simple *configurable* substitution cipher. Enigma did so in the form of a plugboard that allows the operator to swap out letters by simply connecting various letter pairs using cables. For example, every `A` could be turned into a `J`, and every `S` could be turned into an `O`. Up to 13 cables can be connected, typically 10 were used.

The plugboard constitutes nothing but a simple monoalphabetic substitution cipher that in its own right is not hard to solve, but it greatly improves the security of Enigma in conjunction with the other components. The number of configurations is not quite the 26! of a simple substitution cipher, but it's nevertheless a very large number. How large? With 10 cables you can connect 20 out of 26 available slots, leading to `26 choose 20` (230,230) combinations. Given those chosen 20 slots, how could we arrange those cables? Randomly plug one end of the cable into a slot (it does not matter which one) - how many slots are available to connect the other end? One slot is already occupied, so that is 19. Now randomly plug one end of the next cable into a slot, how many are now still available? 17. This pattern continues: $19 \times 17 \times ... \times 1 = 654,729,075$. Now the number of settings is $230,230 \times 654,729,075 = 150,738,274,937,250$.

The key space has therefore been made 150,738,274,937,250 times larger, for a grand total of $150,738,274,937,250 \times 712,882,560 = 107,458,687,327,250,619,360,000$ settings (77 bits). A single plugboard increases the key space by the equivalent of about 5 additional rotors. That is a lot of bang for buck!

### Encryption and decryption

That's it - all the components are now there. All that's left is tying it all together. Once a key is pressed the rotors first turn. Then electricity goes from the keyboard to the plugboard, through the right, middle, and left rotors, into the reflector, back to the left, middle, and right rotors, the plugboard, and then to the light bulb.

{{< image src="Path.png" caption="A key press makes its way through Enigma's components." width="50%" >}}
