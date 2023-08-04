import { Editor } from "./main";
import { scale } from './Scales';
import { tryEvaluate } from "./Evaluator";
import { MidiConnection } from "./IO/MidiConnection";
// @ts-ignore
import { webaudioOutput, samples } from '@strudel.cycles/webaudio';

const sound = (value: any) => ({
    value, context: {},
    ensureObjectValue: () => {}
});

class DrunkWalk {

    /**
     * A class that implements a "drunk walk" algorithm. This is useful for generating random
     * numbers in a constrained range. The "drunk" starts at a position, and then makes a step
     * of +1, 0, or -1. The "drunk" can be constrained to a range, and can wrap around the range.
     * 
     * @param min - The minimum value of the range
     * @param max - The maximum value of the range
     * @param wrap - Whether or not the "drunk" should wrap around the range
     * @param position - The starting/current position of the "drunk"
     */

    public min: number;
    public max: number;
    private wrap: boolean;
    public position: number;

    constructor(min: number, max: number, wrap: boolean) {
        this.min = min;
        this.max = max;
        this.wrap = wrap;
        this.position = 0;
    }

    step(): void {

        /**
         * Makes a step in the "drunk walk" algorithm. This is a random step of +1, 0, or -1.
         */

        const stepSize: number = Math.floor(Math.random() * 3) - 1;
        this.position += stepSize;

        if (this.wrap) {
            if (this.position > this.max) {
                this.position = this.min;
            } else if (this.position < this.min) {
                this.position = this.max;
            }
        } else {
            if (this.position < this.min) {
                this.position = this.min;
            } else if (this.position > this.max) {
                this.position = this.max;
            }
        }
    }

    getPosition(): number {
        /**
         * @returns The current position of the "drunk"
         */
        return this.position;
    }

    toggleWrap(b: boolean): void {
        /**
         * Whether or not the "drunk" should wrap around the range
         * 
         * @param b - Whether or not the "drunk" should wrap around the range
         */
        this.wrap = b;
    }
}

export class UserAPI {

    /**
     * The UserAPI class is the interface between the user's code and the backend. It provides
     * access to the AudioContext, to the MIDI Interface, to internal variables, mouse position, 
     * useful functions, etc... This is the class that is exposed to the user's action and any 
     * function destined to the user should be placed here.
     */

    private variables: { [key: string]: any } = {}
    private iterators: { [key: string]: any } = {}
    private _drunk: DrunkWalk = new DrunkWalk(-100, 100, false);

    MidiConnection: MidiConnection = new MidiConnection()
    load: samples

    constructor (public app: Editor) {
        this.load = samples("github:tidalcycles/Dirt-Samples/master");
    }

    // =============================================================
    // Time functions
    // =============================================================

    get time(): number {
        /**
         * @returns The current time for the AudioContext
         */
        return this.app.audioContext.currentTime
    }

    // =============================================================
    // Mouse functions
    // =============================================================

    get mouseX(): number { 
        /**
         * @returns The current x position of the mouse
         */
        return this.app._mouseX 
    }

    get mouseY(): number { 
        /**
         * @returns The current y position of the mouse
         */
        return this.app._mouseY 
    }

    // =============================================================
    // Utility functions
    // =============================================================

    log = console.log

    scale = scale

    rate(rate: number): void {
        // TODO: Implement this. This function should change the rate at which the global script
        // is evaluated. This is useful for slowing down the script, or speeding it up. The default
        // would be 1.0, which is the current rate (very speedy).
    }


    script(...args: number[]): void {
        /**
         * Evaluates 1-n local script(s)
         * 
         * @param args - The scripts to evaluate
         * @returns The result of the evaluation
         */
        args.forEach(arg => {
            tryEvaluate(
                this.app, 
                this.app.universes[this.app.selected_universe].locals[arg],
            )
        })
    }
    s = this.script

    clearscript(script: number): void {
        /**
         * Clears a local script
         * 
         * @param script - The script to clear
         */
        this.app.universes[this.app.selected_universe].locals[script] = {
            candidate: '', committed: '', evaluations: 0
        }
    }
    cs = this.clearscript

    copyscript(from: number, to: number): void {
        /**
         * Copy from a local script to another local script
         * 
         * @param from - The script to copy from
         * @param to - The script to copy to
         */
        this.app.universes[this.app.selected_universe].locals[to] =
            this.app.universes[this.app.selected_universe].locals[from]
    }
    cps = this.copyscript


    // =============================================================
    // MIDI related functions
    // =============================================================

    public midi_outputs(): Array<MIDIOutput> {
        /**
         * Prints a list of available MIDI outputs in the console.
         * 
         * @returns A list of available MIDI outputs
         */
        console.log(this.MidiConnection.listMidiOutputs());
        return this.MidiConnection.midiOutputs;
    }

    public midi_output(outputName: string): void {
        /**
         * Switches the MIDI output to the specified output.
         * 
         * @param outputName - The name of the MIDI output to switch to
         */
        if (!outputName) {
            console.log(this.MidiConnection.getCurrentMidiPort())
        } else {
            this.MidiConnection.switchMidiOutput(outputName)
        }
    }

    public note(note: number, channel: number, velocity: number, duration: number): void {
        /**
         * Sends a MIDI note to the current MIDI output.
         * TODO: Fix note duration
         * 
         * @param note - The MIDI note to send
         * @param channel - The MIDI channel to send the note on
         * @param velocity - The velocity of the note
         * @param duration - The duration of the note (in ms)
         * 
         */
        this.MidiConnection.sendMidiNote(note, channel, velocity, duration)
    }

    public midi_clock(): void {
        /**
         * Sends a MIDI clock to the current MIDI output.
         */
        this.MidiConnection.sendMidiClock()
    }

    public cc(control: number, value: number): void {
        /**
         * Sends a MIDI control change to the current MIDI output.
         * 
         * @param control - The MIDI control to send
         * @param value - The value of the control
         */
        this.MidiConnection.sendMidiControlChange(control, value)
    }

    public midi_panic(): void {
        /**
         * Sends a MIDI panic message to the current MIDI output.
         */
        this.MidiConnection.panic()
    }

    // =============================================================
    // Iterator related functions
    // =============================================================

    public iterator(name: string, limit?: number, step?: number): number {
        /**
         * Returns the current value of an iterator, and increments it by the step value.
         * 
         * @param name - The name of the iterator
         * @param limit - The upper limit of the iterator
         * @param step - The step value of the iterator
         * @returns The current value of the iterator
         */

        if (!(name in this.iterators)) {
            // Create new iterator with default step of 1
            this.iterators[name] = {
                value: 0,
                step: step ?? 1,
                limit
            };
        } else {
            // Increment existing iterator by step value
            this.iterators[name].value += this.iterators[name].step;

            // Check for limit overshoot
            if (this.iterators[name].limit !== undefined &&
                this.iterators[name].value > this.iterators[name].limit) {
                this.iterators[name].value = 0;
            }
        }

        // Return current iterator value
        return this.iterators[name].value;
    }
    it = this.iterator

    // =============================================================
    // Drunk mechanism
    // =============================================================

    get drunk() {
        /**
         * 
         * This function returns the current the drunk mechanism's
         * current value.
         * 
         * @returns The current position of the drunk mechanism
         */
        this._drunk.step();
        return this._drunk.getPosition();
    }

    set drunk(position: number) {
        /**
         * Sets the current position of the drunk mechanism.
         * 
         * @param position - The value to set the drunk mechanism to
         */
       this._drunk.position = position;
    }

    set drunk_max(max: number) {
        /**
         * Sets the maximum value of the drunk mechanism.
         * 
         * @param max - The maximum value of the drunk mechanism
         */
        this._drunk.max = max;
    }

    set drunk_min(min: number) {
        /**
         * Sets the minimum value of the drunk mechanism.
         * 
         * @param min - The minimum value of the drunk mechanism
         */
        this._drunk.min = min;
    }

    set drunk_wrap(wrap: boolean) {
        /**
         * Sets whether the drunk mechanism should wrap around
         * 
         * @param wrap - Whether the drunk mechanism should wrap around
         */
        this._drunk.toggleWrap(wrap);
    }

    // =============================================================
    // Variable related functions
    // =============================================================

    public variable(a: number | string, b?: any): any {
        /**
         * Sets or returns the value of a variable internal to API.
         * 
         * @param a - The name of the variable
         * @param b - [optional] The value to set the variable to
         * @returns The value of the variable 
         */
        if (typeof a === 'string' && b === undefined) {
            return this.variables[a]
        } else {
            this.variables[a] = b
            return this.variables[a]
        }
    }
    v = this.variable

    public delete_variable(name: string): void {
        /**
         * Deletes a variable internal to API.
         * 
         * @param name - The name of the variable to delete
         */
        delete this.variables[name]
    }
    dv = this.delete_variable

    public clear_variables(): void {
        /**
         * Clears all variables internal to API.
         * 
         * @remarks
         * This function will delete all variables without warning. 
         * Use with caution.
         */
        this.variables = {}
    }
    cv = this.clear_variables

    // =============================================================
    // Small algorithmic functions
    // =============================================================

    pick<T>(...array: T[]): T {
        /**
         * Returns a random element from an array.
         * 
         * @param array - The array of values to pick from
         */
        return array[Math.floor(Math.random() * array.length)] 
    }

    seqbeat<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current beat.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.beat % array.length] 
    }

    seqbar<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current bar.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.bar % array.length] 
    }

    seqpulse<T>(...array: T[]): T {
        /**
         * Returns an element from an array based on the current pulse.
         * 
         * @param array - The array of values to pick from
         */
        return array[this.app.clock.time_position.pulse % array.length]
     }

    // =============================================================
    // Randomness functions
    // =============================================================

    randI(min: number, max: number): number {
        /**
         * Returns a random integer between min and max.
         * 
         * @param min - The minimum value of the random number
         * @param max - The maximum value of the random number
         * @returns A random integer between min and max
         */
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    rand(min: number, max: number): number {
        /**
         * Returns a random float between min and max.
         * 
         * @param min - The minimum value of the random number
         * @param max - The maximum value of the random number
         * @returns A random float between min and max
         */
        return Math.random() * (max - min) + min
    }
    rI = this.randI; r = this.rand

    // =============================================================
    // Quantification functions
    // =============================================================

    public quantize(value: number, quantization: number[]): number {
        /**
         * Returns the closest value in an array to a given value.
         * 
         * @param value - The value to quantize
         * @param quantization - The array of values to quantize to
         * @returns The closest value in the array to the given value
         */
        if (quantization.length === 0) { return value }
        let closest = quantization[0]
        quantization.forEach(q => {
            if (Math.abs(q - value) < Math.abs(closest - value)) { closest = q }
        })
        return closest
    }
    quant = this.quantize

    public clamp(value: number, min: number, max: number): number {
        /**
         * Returns a value clamped between min and max.
         * 
         * @param value - The value to clamp
         * @param min - The minimum value of the clamped value
         * @param max - The maximum value of the clamped value
         * @returns A value clamped between min and max
         */
        return Math.min(Math.max(value, min), max)
    }
    cmp = this.clamp

    // =============================================================
    // Transport functions
    // =============================================================

    bpm(bpm?: number): number {
        /**
         * Sets or returns the current bpm.
         * 
         * @param bpm - [optional] The bpm to set
         * @returns The current bpm
         */
        if (bpm === undefined)
            return this.app.clock.bpm

        if (bpm < 1 || bpm > 500)
            console.log(`Setting bpm to ${bpm}`)
            this.app.clock.bpm = bpm
        return bpm
    }
    tempo = this.bpm

    time_signature(numerator: number, denominator: number): void {
        /**
         * Sets the time signature.
         * 
         * @param numerator - The numerator of the time signature
         * @param denominator - The denominator of the time signature
         * @returns The current time signature
         */
        this.app.clock.time_signature = [numerator, denominator]
    }

    // =============================================================
    // Probability functions
    // =============================================================

    public almostNever():boolean {
        /**
         * Returns true 10% of the time.
         * 
         * @returns True 10% of the time
         */
        return Math.random() > 0.9 
    }

    public sometimes(): boolean {
        /**
         * Returns true 50% of the time.
         * 
         * @returns True 50% of the time
         */
        return Math.random() > 0.5
    }

    public rarely():boolean {
        /**
         * Returns true 25% of the time.
         * 
         * @returns True 25% of the time
         */
        return Math.random() > 0.75
    }

    public often(): boolean {
        /**
         * Returns true 75% of the time.
         * 
         * @returns True 75% of the time
         */
        return Math.random() > 0.25
    }

    public almostAlways():boolean { 
        /**
         * Returns true 90% of the time.
         * 
         * @returns True 90% of the time
         */
        return Math.random() > 0.1 
    }

    public dice(sides: number):number {
        /**
         * Returns the value of a dice roll with n sides.
         * 
         * @param sides - The number of sides on the dice
         * @returns The value of a dice roll with n sides
         */
        return Math.floor(Math.random() * sides) + 1
    }

    // =============================================================
    // Iterator functions (for loops, with evaluation count, etc...)
    // =============================================================

    get i() {
        /**
         * Returns the current iteration of global file.
         * 
         * @returns The current iteration of global file 
         */
        return this.app.universes[this.app.selected_universe].global.evaluations
    }

    // =============================================================
    // Time markers
    // =============================================================

    get bar(): number { 
        /**
         * Returns the current bar number
         * 
         * @returns The current bar number
         */
        return this.app.clock.time_position.bar 
    }
 
    get tick(): number { 
        /**
         * Returns the current tick number
         * 
         * @returns The current tick number
         */
        return this.app.clock.tick 
    }

    get pulse(): number { 
        /**
         * Returns the current pulse number
         * 
         * @returns The current pulse number
         */
        return this.app.clock.time_position.pulse 
    }

    get beat(): number { 
        /** 
         * Returns the current beat number
         * 
         * @returns The current beat number
         */
        return this.app.clock.time_position.beat 
    }

    get t_beat(): number {
        /**
         * Returns the current beat number since the origin of time
         * TODO: fix! Why is this not working?
         */
        return Math.floor(this.app.clock.tick / this.app.clock.ppqn)
    }


    onbar(n: number, ...bar: number[]): boolean { 
        // n is acting as a modulo on the bar number
        const bar_list = [...Array(n).keys()].map(i => i + 1);
        console.log(bar.some(b => bar_list.includes(b % n)))
        return bar.some(b => bar_list.includes(b % n))
    }

    // TODO: bugfix here
    onbeat(...beat: number[]): boolean {
        let final_pulses: boolean[] = []
        beat.forEach(b => {
            b = b % this.app.clock.time_signature[0]
            let integral_part = Math.floor(b);
            let decimal_part = b - integral_part;
            final_pulses.push(
                integral_part === this.app.clock.time_position.beat &&
                this.app.clock.time_position.pulse === decimal_part * this.app.clock.ppqn
            )
        });
        return final_pulses.some(p => p == true)
    }

    stop(): void { 
        this.app.clock.pause() 
        this.app.setButtonHighlighting("pause", true);
    }
    silence = this.stop 
    hush = this.stop

    prob(p: number): boolean { return Math.random() * 100 < p }
    toss(): boolean { return Math.random() > 0.5 }
    min(...values: number[]): number { return Math.min(...values) }
    max(...values: number[]): number { return Math.max(...values) }
    limit(value: number, min: number, max: number): number { return Math.min(Math.max(value, min), max) }


    delay(ms: number, func: Function): void {
        setTimeout(func, ms)
    }

    delayr(ms: number, nb: number, func: Function): void {
        const list = [...Array(nb).keys()].map(i => ms * i);
        list.forEach((ms, _) => {
            setTimeout(func, ms)
        });
    }

    mod(...pulse: number[]): boolean { return pulse.some(p => this.app.clock.time_position.pulse % p === 0) }
    modbar(...bar: number[]): boolean { return bar.some(b => this.app.clock.time_position.bar % b === 0) }

    euclid(iterator: number, pulses: number, length: number, rotate: number=0): boolean { 
        return this.euclidean_cycle(pulses, length, rotate)[iterator % length];
     }

    euclidean_cycle(pulses: number, length: number, rotate: number = 0): boolean[] {
        function startsDescent(list: number[], i: number): boolean {
            const length = list.length;
            const nextIndex = (i + 1) % length;
            return list[i] > list[nextIndex] ? true : false;
        }
        if (pulses >= length) return [true];
        const resList = Array.from({length}, (_, i) => ((pulses * (i - 1)) % length + length) % length);
        let cycle = resList.map((_, i) => startsDescent(resList, i));
        if(rotate!=0) {
            cycle = cycle.slice(rotate).concat(cycle.slice(0, rotate));
        }
        return cycle;
    }

    // =============================================================
    // Time zones 
    // =============================================================

    // =============================================================
    // Trivial functions
    // =============================================================

    sound = async (values: object) => {
        webaudioOutput(sound(values), 0.00) 
    }
}
