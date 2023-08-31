import { type Editor } from "../main";
import { makeExampleFactory, key_shortcut } from "../Documentation";

export const synths = (application: Editor): string => {
  const makeExample = makeExampleFactory(application);
  return `
# Synthesizers
	
Topos comes with a small number of basic synthesizers. These synths are based on a basic [WebAudio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) design. For heavy synthesis duties, please use MIDI and speak to more complex instruments.
	
# Substractive Synthesis
	
The <ic>sound</ic> function can take the name of a synthesizer as first argument.
- <ic>sine</ic>, <ic>sawtooth</ic>,<ic>triangle</ic>, <ic>square</ic> for the waveform selection.
- <ic>cutoff</ic> and <ic>resonance</ic> for adding a low-pass filter with cutoff frequency and filter resonance.
  - <ic>hcutoff</ic> or <ic>bandf</ic> to switch to a high-pass or bandpass filter.
	- <ic>hresonance</ic> and <ic>bandq</ic> for the resonance parameter of these filters.
	
${makeExample(
  "Simple synthesizer voice with filter",
  `
mod(.5) && snd('sawtooth')
  .cutoff([2000,500].pick() + usine(.5) * 4000)
  .resonance(0.9).freq([100,150].pick())
  .out()
	`,
  true
)}

${makeExample(
  "Listening to the different waveforms from the sweetest to the harshest",
  `
mod(.5) && snd(['sine', 'triangle', 'sawtooth', 'square'].beat()).freq(100).out()
  .freq(50)
  .out()
	`,
  false
)}


${makeExample(
  "Blessed by the square wave",
  `
mod(4) :: [100,101].forEach((freq) => sound('square').freq(freq).sustain(0.1).out())
mod(.5) :: [100,101].forEach((freq) => sound('square').freq(freq*2).sustain(0.01).out())
mod([.5, .75, 2].beat()) :: [100,101].forEach((freq) => sound('square')
  .freq(freq*4 + usquare(2) * 200).sustain(0.125).out())
mod(.25) :: sound('square').freq(100*[1,2,4,8].beat()).sustain(0.1).out()`,
  false
)}


${makeExample(
  "Ghost carillon",
  `
mod(1/8)::sound('sine')
  .velocity(rand(0.0, 1.0))
  .delay(0.75).delayt(.5)
  .sustain(0.4)
	.cutoff(2000)
  .freq(mouseX())
	.gain(0.25)
  .out()`,
  false
)}
	
	
# Frequency Modulation Synthesis (FM)
	
The same basic waveforms can take additional methods to switch to a basic two operators FM synth design (with _carrier_ and _modulator_). FM Synthesis is a complex topic but take this advice: simple ratios will yield stable and harmonic sounds, complex ratios will generate noises, percussions and gritty sounds.
	
- <ic>fmi</ic> (_frequency modulation index_): a floating point value between <ic>1</ic> and <ic>n</ic>.
- <ic>fmh</ic> (_frequency modulation harmonic ratio_): a floating point value between <ic>1</ic> and <ic>n</ic>.

${makeExample(
  "80s nostalgia",
  `
mod(.25) && snd('sine')
  .fmi([1,2,4,8].pick())
  .fmh([1,2,4,8].div(8))
  .freq([100,150].pick())
  .sustain(0.1)
  .out()
	`,
  true
)}

${makeExample(
  "Giving some love to weird ratios",
  `
mod([.5, .25].bar()) :: sound('sine').fm('2.2183:3.18293').sustain(0.05).out()
mod([4].bar()) :: sound('sine').fm('5.2183:4.5').sustain(0.05).out()
mod(.5) :: sound('sine')
  .fmh([1, 1.75].beat())
  .fmi($(1) % 30).orbit(2).room(0.5).out()`,
  false
)}


${makeExample(
  "Some peace and serenity",
  `
mod(0.25) :: sound('sine')
  .note([60, 67, 70, 72, 77].beat() - [0,12].bar())
  .attack(0.2).release(0.5).gain(0.25)
  .room(0.9).size(0.8).sustain(0.5)
  .fmi(Math.floor(usine(.25) * 10))
  .cutoff(1500).delay(0.5).delayt(0.125)
  .delayfb(0.8).fmh(Math.floor(usine(.5) * 4))
  .out()`,
  false
)}

**Note:** you can also set the _modulation index_ and the _harmonic ratio_ with the <ic>fm</ic> argument. You will have to feed both as a string: <ic>fm('2:4')</ic>. If you only feed one number, only the _modulation index_ will be updated.

There is also a more advanced set of parameters you can use to control the envelope of the modulator. These parameters are:
- <ic>fmattack</ic> / <ic>fmatk</ic>: attack time of the modulator envelope.
- <ic>fmdecay</ic> / <ic>fmdec</ic>: decay time of the modulator envelope.
- <ic>fmsustain</ic> / <ic>fmsus</ic>: sustain time of the modulator envelope.
- <ic>fmrelease</ic> / <ic>fmrel</ic>: release time of the modulator envelope.

${makeExample("FM Synthesis with envelope control", ``, true)}
${makeExample("A very long envelope on the modulator", ``, true)}
${makeExample("A very short envelope on the modulator", ``, true)}

## ZzFX

[ZzFX](https://github.com/KilledByAPixel/ZzFX) is a _Zuper Zmall Zound Zynth_. It was created by Frank Force (_aka_ KilledByAPixel) to generate small sound effects for games. It is a very simple synthesizer that can generate a wide range of sounds. It is based on a single oscillator with a simple envelope. ZzFX is very useful for generating percussive sounds and short sound effects. It is also very useful for generating chiptune sounds. You can use it in Topos just like the regular basic synthesizer.

ZZfX can be triggered by picking a default ZZfX waveform in the following list: <ic>z_sine</ic>, <ic>z_triangle</ic>, <ic>z_sawtooth</ic>, <ic>z_tan</ic>, <ic>z_noise</ic>.

${makeExample(
  "Picking a waveform",
  `
mod(.5) :: sound(['z_sine', 'z_triangle', 'z_sawtooth', 'z_tan', 'z_noise'].beat()).out()
`,
  true
)}

It comes with a set of parameters that can be used to tweak the sound:

| Method   | Alias | Description                                                |
|----------|-------|------------------------------------------------------------|
|<ic>zrand</ic>| randomisation factor. Seems to concern pitch as well, beware.
|<ic>volume</ic>| overall volume of the sound. 
|<ic>frequency</ic>| sound frequency, also controllable using <ic>note</ic>.
|<ic>attack</ic>, <ic>decay</ic>, <ic>sustain</ic>, <ic>release</ic> | <ic>atk</ic>: envelope parameters.


# Speech synthesis

Topos can also speak using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). Speech synthesis can be used in two ways:

- <ic>speak(text: string, lang: string, voice: number, rate: number, pitch: number, volume: number)</ic>: speak the given text.

Or by using string and chaining:

- <ic>"Hello".rate(1.5).pitch(0.5).speak()</ic>.

Value ranges for the different parameters are:
- <ic>lang(string)</ic>: language code, for example <ic>en</ic> for English, <ic>fr</ic> for French or with the country code for example British English <ic>en-GB</ic>. See supported values from the [list](https://cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages).
- <ic>voice(number)</ic>: voice index, for example <ic>0</ic> for the first voice, <ic>1</ic> for the second voice, etc.
- <ic>rate(number)</ic>: speaking rate, from <ic>0.0</ic> to <ic>10</ic>.
- <ic>pitch(number)</ic>: speaking pitch, from <ic>0.0</ic> to <ic>2</ic>.
- <ic>volume(number)</ic>: speaking volume, from <ic>0.0</ic> to <ic>1.0</ic>.

Examples:

${makeExample(
  "Hello world!",
  `
mod(4) :: speak("Hello world!")
  `,
  false
)}

${makeExample(
  "Different voices",
  `
mod(2) :: speak("Topos!","fr",irand(0,5))
  `,
  false
)}

${makeExample(
  "Chaining string",
  `
  onbeat(1,3) :: "Foobaba".voice(irand(0,10)).speak()
  `,
  false
)}

${makeExample(
  "Building string and chaining",
  `
  const subject = ["coder","user","loser"].pick()
  const verb = ["is", "was", "isnt"].pick()
  const object = ["happy","sad","tired"].pick()
  const sentence = subject+" "+verb+" "+" "+object
    
  mod(6) :: sentence.pitch(0).rate(0).voice([0,2].pick()).speak()
  `,
  false
)}

${makeExample(
  "String chaining with array chaining",
  `
  const croissant = ["Croissant!", "Volant", "Arc-en-ciel", "Chocolat", "Dansant", "Nuage", "Tournant", "Galaxie", "Chatoyant", "Flamboyant", "Cosmique"];

  onbeat(1) :: croissant.bar()
    .lang("fr")
    .volume(rand(0.2,2.0))
    .rate(rand(.4,.6))
    .speak();
  
  `,
  false
)}
`;
};
